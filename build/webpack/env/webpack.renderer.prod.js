/** @type { import('webpack').Configuration } */

const { merge } = require('webpack-merge')
const commonConf = require('./webpack.renderer.common')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin')
const AddBuildInfoPlugin = require('../plugins/AddBuildInfoPlugin')
const { createBundleAnalyzerPage } = require('./logicalConfig')
const testMode = process.env.NODE_ENV === 'test'
//定义目录
const publicPath = `${process.cwd()}/app/public`

let prodConf = merge(commonConf, {
	mode: 'production',
	devtool: testMode && 'source-map',
	plugins: [
		new CleanWebpackPlugin(),
		new CopyWebpackPlugin({
			patterns: [
				{ from: `${publicPath}/package.json`, to: '../' },
				{ from: `${process.cwd()}/app/static/demo.pdf`, to: '../' },
				{ from: `${process.cwd()}/app/static/res`, to: '../res' },
			],
		}),
	],
	optimization: {
		minimize: true, //启用代码压缩
		minimizer: [
			new TerserWebpackPlugin({
				parallel: true, //启用多进程加速代码压缩
				extractComments: false, //关闭生成注释提取txt文件
				terserOptions: {
					//压缩策略： compress决定是否省略变量赋值语句， mangle决定是否做变量替换以压缩体积
					compress: false,
					mangle: true,
				},
			}),
			new CssMinimizerWebpackPlugin(),
			new AddBuildInfoPlugin(),
			...createBundleAnalyzerPage(),
		],
		//拆分公共代码
		splitChunks: {
			chunks: 'all', // 使用webpack默认方案，自动提取所有公共模块到单独 bundle
		},
	},
})

module.exports = prodConf
