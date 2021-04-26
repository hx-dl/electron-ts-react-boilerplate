const fs = require('fs')
const { spawn, execSync } = require('child_process')
const process = require('process')
const spinner = require('../helpers/Spinner')
const distPath = `${process.cwd()}/app/dist`
const releasePath = `${process.cwd()}/release`

function startPackage() {
	try {
		spinner.start('清空旧文件')
		execSync(`rm -rf ${releasePath}/*`)
		spinner.succeed('清空旧文件完成')
	} catch (error) {
		spinner.fail('清空旧文件失败')
	}
	try {
		if (!fs.existsSync(releasePath)) fs.mkdirSync(releasePath)
		spinner.start('拷贝更新文件至release/update目录')
		execSync(`cp -r ${distPath} ${releasePath}/update`)
		spinner.succeed('拷贝更新文件完成')
	} catch (error) {
		spinner.fail('拷贝更新文件失败')
	}
	spinner.start('开始生成客户端')
	const packageProcess = spawn('electron-builder', ['-mw', '--project=app/dist'], { stdio: 'pipe' })
	packageProcess.stdout.on('data', data => {
		const text = data.toString().trim()
		if (text) spinner.text = text
	})
	packageProcess.stdout.on('close', data => {
		spinner.text = '清理无效文件'
		try {
			execSync(`rm -rf ${releasePath}/installer/*.blockmap`)
			execSync(`rm -rf ${releasePath}/installer/.icon-icns`)
			execSync(`rm -rf ${releasePath}/installer/.icon-ico`)
			execSync(`rm -rf ${releasePath}/installer/*.zip`)
			execSync(`rm -rf ${releasePath}/installer/builder-effective-config.yaml`)
		} catch (error) {}

		spinner.succeed('生成win/mac客户端及安装包完成')
	})
}

startPackage()
