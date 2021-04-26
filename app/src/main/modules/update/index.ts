import md5 from 'md5'
import path from 'path'
import fs from 'fs-extra'
import { execSync } from 'child_process'
import { app, net, dialog } from 'electron'
import config from '../../config/mainConf'
import { printLog, writeFileSyncExtra, copyDirSync } from '../../utils'

interface filesMap {
	[name: string]: {
		type: string
		hash: string
	}
}

//检查是否有新版本
const checkNewVersion = () => {
	return new Promise(resolve => {
		//定义路径
		const currentVersionInfoFilePath = `${app.getAppPath()}/manifest.json`
		const remoteVersionInfoFilePath = `${config.UPDATE_ADDRESS}/manifest.json`
		//发送请求
		const request = net.request(remoteVersionInfoFilePath)
		request.on('response', response => {
			let responseData = ''
			response.on('data', chunk => {
				responseData += chunk
			})
			response.on('end', () => {
				let currentVersionInfo: any = ''
				let remoteVersionInfo: any = ''
				try {
					currentVersionInfo = JSON.parse(fs.readFileSync(currentVersionInfoFilePath, 'utf-8'))
				} catch (error) {
					dialog.showErrorBox('解析本地 manifest.json 异常', error.message)
					resolve(false)
				}
				try {
					remoteVersionInfo = JSON.parse(responseData)
				} catch (error) {
					dialog.showErrorBox('解析远程 manifest.json 异常', error.message)
					resolve(false)
				}
				const currentVersionNumber = currentVersionInfo.version.split('.').join('')
				const remoteVersionNumber = remoteVersionInfo.version.split('.').join('')
				const currentFilesMap = currentVersionInfo.files
				const remoteFilesMap = remoteVersionInfo.files
				//校验版本号是否一致
				if (currentVersionNumber !== remoteVersionNumber) {
					writeFileSyncExtra(`${app.getAppPath()}/manifest.json`, responseData, 'utf-8') //将新的 manifest.json写入本地
					resolve({
						currentFilesMap,
						remoteFilesMap,
					})
				} else resolve(false)
			})
		})
		request.on('error', e => {
			dialog.showErrorBox('更新请求出错', e.message)
			app.quit()
		})
		request.end()
	})
}

//询问更新弹框
const showUpdateDialog = () => {
	return dialog.showMessageBox({
		type: 'info',
		title: '版本更新提示',
		message: '检测到新的版本，软件必须在升级后方可使用',
		buttons: ['同意更新', '稍后提醒'],
	})
}

//备份文件
const backupFile = (): boolean => {
	try {
		const backupPath = path.resolve(app.getAppPath(), '../backup')
		execSync(`rm -rf ${backupPath}`) //清理旧的备份
		copyDirSync(app.getAppPath(), backupPath)
		return true
	} catch (e) {
		dialog.showErrorBox('备份文件失败', e.message)
		return false
	}
}

//下载hash不一致文件到本地
const downLoadDiffFiles = (obj: versionDiffData, onProcess: (process: number) => void, onComplete: () => void) => {
	const { currentFilesMap, remoteFilesMap } = obj
	const downloadFileList: string[] = []
	const deleteFileList: string[] = []
	let downloadFileCount = 0
	//遍历检查当前文件
	Object.keys(currentFilesMap).forEach(fileName => {
		if (!remoteFilesMap[fileName]) {
			//若 当前存在的文件，远程文件列表中不存在，则需要删除
			deleteFileList.push(fileName)
		}
	})
	//遍历检查远程文件
	Object.keys(remoteFilesMap).forEach(fileName => {
		if (!currentFilesMap[fileName] || remoteFilesMap[fileName].hash !== currentFilesMap[fileName].hash) {
			//若 当前不存在该远程文件名称 或者 远程文件hash和当前文件内容hash不一致，则更新文件
			downloadFileList.push(fileName)
		}
	})
	deleteFileList.forEach(fileName => {
		execSync(`rm -rf ${app.getAppPath()}/${fileName}`) //清理新版本不需要的文件
	})
	//下载文件
	const downLoadFile = (fileName: string, remoteFilesMap: filesMap, downloadComplete: () => void) => {
		const request = net.request({
			url: `${config.UPDATE_ADDRESS}/${fileName}`,
		})

		request.on('response', response => {
			let responseData = ''
			const fileType = remoteFilesMap[fileName].type
			const fileHash = remoteFilesMap[fileName].hash
			response.on('data', chunk => {
				if (config.BINARY_FILE_TYPE.includes(fileType)) {
					responseData += chunk.toString('binary')
				} else {
					responseData += chunk
				}
			})
			response.on('end', () => {
				// const tempPath = path.resolve(app.getAppPath(), '../temp')
				const hash = md5(responseData) //将下载内容hash
				//比对下载内容hash与远程文件hash一致性，保证下载的内容正确
				if (fileHash === hash) {
					//若是二进制类型文件
					if (config.BINARY_FILE_TYPE.includes(fileType)) {
						writeFileSyncExtra(`${app.getAppPath()}/${fileName}`, responseData, 'binary')
					} else {
						writeFileSyncExtra(`${app.getAppPath()}/${fileName}`, responseData, 'utf-8')
					}
				} else {
					dialog.showErrorBox('文件校验错误', 'hash不一致')
				}
				downloadComplete()
			})
		})
		request.on('error', e => {
			printLog('Error: ' + e.message)
		})
		request.end()
	}
	downloadFileList.forEach(fileName => {
		downLoadFile(fileName, remoteFilesMap, () => {
			downloadFileCount++
			let process = Math.round((downloadFileCount / downloadFileList.length) * 100) - 5 //计算下载进度，预留5%进度给替换文件操作
			if (downloadFileCount >= downloadFileList.length) onComplete()
			else onProcess(process)
		})
	})
}

export default { checkNewVersion, showUpdateDialog, backupFile, downLoadDiffFiles }
