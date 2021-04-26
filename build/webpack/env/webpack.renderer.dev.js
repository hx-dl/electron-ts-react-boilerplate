/** @type { import('webpack').Configuration } */

const commonConf = require('./webpack.renderer.common')
const { merge } = require('webpack-merge')
const { getContentBase } = require('./logicalConfig')
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

let devConf = merge(commonConf, {
	devtool: 'eval-source-map',
	mode: 'development',
	devServer: {
		stats: {
			all: false,
			colors: true,
			errorsCount: true,
			errors: true,
			moduleTrace: true,
			logging: 'error',
		},
		port: 3000,
		contentBase: getContentBase(),
		hot: true, // 开启 HMR 特性，如果资源不支持 HMR 会 fallback 到 live reloading
		noInfo: true,
	},
	plugins: [
		// react 模块热替换插件，相比react-hot-loader减少了对代码的侵入型，是react官方推崇的新一代react热更新替代品
		new ReactRefreshPlugin(),
		//由于使用的babel对ts进行编译，而babel编译ts的原理是直接将类型剥离后当成js进行编译
		//所以不会有ts的类型检查报警，在编译过程中发生的ts错误也就无法得知。
		// ForkTsCheckerWebpackPlugin 作用便是在一个单独的进程中进行类型检查，这样保证ts校验的同时也不会影响到编译进程的性能
		new ForkTsCheckerWebpackPlugin({
			logger: {
				issues: 'webpack-infrastructure',
			},
		}),
	],
})

module.exports = devConf
