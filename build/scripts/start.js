const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const waitOn = require('wait-on')
const kill = require('tree-kill')
const chokidar = require('chokidar')
const { spawn } = require('child_process')
const spinner = require('../helpers/Spinner')
const mainWebpackConfig = require('../webpack/env/webpack.main.dev')
const rendererWebpackConfig = require('../webpack/env/webpack.renderer.dev')
//定义路径
const appPath = process.cwd()
const mainBundlerPath = `${appPath}/app/dist/main.dev.bundle.js`

// 启动本地开发服务
function start() {
	startApp()
	startElectron()
}

start()

function startApp() {
	spinner.info(`环境 ${process.env.NODE_ENV}`)

	//启动 main 编译
	const mainCompiler = webpack(mainWebpackConfig) //创建main编译器
	mainCompiler.watch(mainWebpackConfig.watchOptions, (err, stats) => {
		if (err) return spinner.fail(`编译 main 代码失败, error: ${err}`)
	})

	// //启动 renderer 编译
	const rendererCompiler = webpack(rendererWebpackConfig) //创建renderer编译器实例
	const rendererServer = new WebpackDevServer(rendererCompiler, rendererWebpackConfig.devServer)
	const rendererPort = rendererWebpackConfig.devServer.port
	//执行webpack-dev-server监听
	rendererServer.listen(rendererPort, err => {
		if (err) return spinner.fail(`编译 renderer 代码失败, error: ${err}`)
	})
}

function startElectron() {
	//等待开发代码编译成功
	waitOn({
		resources: [mainBundlerPath, 'http://localhost:3000'],
		timeout: '30000', //等待超时时间
	})
		.then(() => {
			// 启动并保存electron进程引用
			let electronProcess = spawn('electron', ['./'], { stdio: 'pipe' })
			electronProcess.stdout.isTTY = true
			electronProcess.stdout.on('data', data => {
				spinner.info(`主进程日志 ${data.toString()}`)
			})
			electronProcess.stdout.on('error', data => {
				spinner.info(`错误日志 ${data.toString()}`)
			})
			//监听main.dev.bundle.js文件改动
			chokidar.watch(mainBundlerPath).on('change', () => {
				kill(electronProcess.pid) //杀掉旧的进程
				electronProcess = spawn('electron', ['./'], { stdio: 'pipe' }) //重启进程
				electronProcess.stdout.on('data', data => {
					spinner.info(`主进程日志 ${data.toString()}`)
				})
				spinner.succeed('重载 electron 成功')
			})
			spinner.succeed('本地开发服务启动成功')
		})
		.catch(err => {
			spinner.fail(`本地开发服务启动失败, error: ${err}`)
		})
}
