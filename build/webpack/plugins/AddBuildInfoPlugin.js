const fs = require('fs')
const md5 = require('md5')
const path = require('path')
const waitOn = require('wait-on')
const { execSync } = require('child_process')
const spinner = require('../../helpers/Spinner')
const rootPath = process.cwd()
const mainBundlerPath = `${rootPath}/app/dist/main.bundle.js`

module.exports = class AddBuildInfoPlugin {
	apply(compiler) {
		//获取最新的git tag号, 记为当前版本号
		let tag = ''
		try {
			tag = execSync('git describe --abbrev=0').toString().trim()
			spinner.info(`当前 tag 号: ${tag}`)
		} catch (e) {
			spinner.info('AddBuildInfoPlugin: 未找到tag号')
		}
		const version = tag.replace(/(integration.|release.|hotfix.)/, '')

		//afterEmit表示在文件生成资源到 output 目录之后。  异步时刻
		compiler.hooks.afterEmit.tap('addBuildInfo', compilation => {
			const manifest = {
				version,
				files: {},
			}
			waitOn({
				resources: [mainBundlerPath],
				timeout: '9999999', //等待超时时间
			})
				.then(() => {
					const getFileMap = (currentPath, fileMap) => {
						const files = fs.readdirSync(currentPath)
						files.forEach(fileName => {
							const filePath = path.join(currentPath, fileName)
							const stat = fs.statSync(filePath)
							if (stat.isFile()) {
								const fileName = filePath.replace(`${rootPath}/app/dist/`, '')
								const fileNameSplit = fileName.split('.')
								const type = fileName.split('.')[fileNameSplit.length - 1].toLowerCase()
								const BINARY_FILE_TYPE = ['jpg', 'png', 'gif', 'pdf', 'ico']
								if (BINARY_FILE_TYPE.includes(type)) {
									const fileContent = fs.readFileSync(filePath, 'binary')
									var hash = md5(fileContent)
								} else {
									const fileContent = fs.readFileSync(filePath, 'utf-8')
									var hash = md5(fileContent)
								}
								fileMap[fileName] = {
									hash,
									type,
								}
							} else {
								return getFileMap(filePath, fileMap)
							}
						})
					}
					getFileMap(`${rootPath}/app/dist`, manifest.files)

					fs.writeFileSync(`${rootPath}/app/dist/manifest.json`, JSON.stringify(manifest), {
						encoding: 'utf-8',
					})
				})
				.catch(err => {
					spinner.fail(`AddBuildInfoPlugin 执行失败, error: ${err}`)
				})
		})
	}
}
