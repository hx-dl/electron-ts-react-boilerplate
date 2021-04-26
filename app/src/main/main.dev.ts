import path from 'path'
import { app, session } from 'electron'
import { window, update } from './modules'
import { isDev } from './utils'
const { windowMap } = window
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true' // 关闭安全警告

function initApp() {
	global.update = {
		executeUpdateProcess: async (onProcess: (process: number) => void, onComplete: () => void) => {
			if (isDev()) {
				windowMap.get('update')!.close() //关闭更新窗口
			} else {
				//生产逻辑，热更新
				let res = await update.checkNewVersion() //检查版本是否有更新
				if (res) {
					//提示更新弹框
					update.showUpdateDialog().then(dialogRes => {
						if (dialogRes.response === 0) {
							//点击同意更新
							let isBackupSucceed = update.backupFile() //备份旧文件
							if (!isBackupSucceed) return //备份失败直接退出
							windowMap.get('update')!.show() //备份成功，显示更新下载 update窗口
							//开始执行文件hash 对比并下载文件
							update.downLoadDiffFiles(res as versionDiffData, onProcess, () => {
								windowMap.get('update')!.close() //关闭更新窗口
								onComplete()
								//更新完成后重新启动应用程序
								app.relaunch({ args: process.argv.slice(1).concat(['--relaunch']) })
								app.exit(0)
							})
						}
					})
				} else {
					windowMap.get('update')!.close() //关闭更新窗口
				}
			}
		},
	}
	window.createBizWin().on('ready-to-show', window.createUpdateWin) //创建主业务窗口并创建更新窗口
}

app.on('ready', () => {
	if (isDev()) {
		//加载控制台调试扩展插件
		const extensionFolder = path.resolve(`${process.cwd()}/app/static/devtools`)
		session.defaultSession.loadExtension(`${extensionFolder}/devtron`)
		session.defaultSession.loadExtension(`${extensionFolder}/react-development-tools`)
	}
	initApp()
})

app.on('activate', () => {
	// 在macOS上，当单击dock图标并且没有其他窗口打开时，通常在应用程序中重新创建一个窗口。
	if (windowMap.get('biz')) window.createBizWin()
})

app.on('window-all-closed', () => {
	// 在 macOS 上，除非用户用 Cmd + Q 确定地退出，否则绝大部分应用及其菜单栏会保持激活。
	if (process.platform !== 'darwin') app.quit()
})
