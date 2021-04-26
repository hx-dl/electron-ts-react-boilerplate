/** @type { import('webpack').Configuration } */

const { merge } = require('webpack-merge')
const commonConf = require('./webpack.main.common')
const LoadExtensionPlugin = require('../plugins/LoadExtensionPlugin')
//定义目录
const rootPath = process.cwd()

let devConf = merge(commonConf, {
	devtool: 'eval-source-map',
	mode: 'development',
	output: {
		filename: 'main.dev.bundle.js',
		path: `${rootPath}/app/dist`,
	},
	// watch: true,
	watchOptions: {
		aggregateTimeout: 3000,
	},
	plugins: [
		//加载 react-devtool等 chrome插件到electron
		new LoadExtensionPlugin(),
	],
})

module.exports = devConf
