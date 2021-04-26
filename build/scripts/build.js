const webpack = require('webpack')
const spinner = require('../helpers/Spinner')
const { execSync } = require('child_process')
const mainWebpackConfig = require('../webpack/env/webpack.main.prod')
const rendererWebpackConfig = require('../webpack/env/webpack.renderer.prod')
const distPath = `${process.cwd()}/app/dist`

// 多实例并行打包
function build() {
	spinner.info(`启动 Webpack 构建, 环境 ${process.env.NODE_ENV}`)
	execSync(`rm -rf ${distPath}/*`)
	const compiler = webpack([mainWebpackConfig, rendererWebpackConfig]) //创建compiler
	compiler.run((err, stats) => {
		if (err || stats.hasErrors()) {
			return spinner.fail(`代码打包出错 ${err ? err : stats.toString('errors-only')}`)
		}
		spinner.succeed('所有代码打包完成')
	})
}

build()
