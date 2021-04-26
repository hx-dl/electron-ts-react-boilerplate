/** @type { import('webpack').Configuration } */

const { merge } = require('webpack-merge')
const commonConf = require('./webpack.main.common')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const { createBundleAnalyzerPage } = require('./logicalConfig')
const testMode = process.env.NODE_ENV === 'test'
//定义目录
const rootPath = process.cwd()
const diyLoaderPath = `${rootPath}/build/webpack/loaders`

let prodConf = merge(commonConf, {
	mode: 'production',
	devtool: testMode && 'source-map',
	output: {
		filename: 'main.bundle.js',
		path: `${rootPath}/app/dist`,
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				exclude: /node_modules/,
				use: [
					`${diyLoaderPath}/production-loader`, //使用自定义loader 修剪main.dev.js生成不需要的代码,
					{
						loader: 'babel-loader',
						options: {
							presets: [
								[
									'@babel/preset-env',
									{
										targets: {
											node: 'current',
										},
									},
								],
								'@babel/preset-typescript',
							],
						},
					},
				],
			},
		],
	},
	plugins: [...createBundleAnalyzerPage()],
	optimization: {
		minimize: true, //启用代码压缩
		minimizer: [
			new TerserWebpackPlugin({
				parallel: true, //启用多进程加速代码压缩
				extractComments: false, //关闭生成注释提取txt文件
			}),
		],
	},
})

module.exports = prodConf
