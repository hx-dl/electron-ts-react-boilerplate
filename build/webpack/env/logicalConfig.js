const fs = require('fs')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin')
const isDev = process.env.NODE_ENV === 'development'
const analyzer = process.env.NODE_ENV === 'localAnalyze'
//定义目录
const baseDir = `${process.cwd()}/app/src/renderer/pages`
const publicPath = `${process.cwd()}/app/public`

const entryFiles = fs.readdirSync(baseDir)

module.exports = {
	//获取renderer多页应用入口
	getRendererEntry() {
		let entry = {}
		entryFiles.forEach(dir => {
			entry[dir] = [`${baseDir}/${dir}/index.tsx`]
		})
		return entry
	},
	getContentBase() {
		return publicPath
	},
	getBabelOptions() {
		const plugins = ['@babel/proposal-class-properties']
		if (isDev) plugins.push('react-refresh/babel')
		return {
			cacheDirectory: true,
			presets: [
				[
					'@babel/preset-env',
					{
						targets: {
							electron: '10.2.0',
						},
					},
				],
				'@babel/preset-react',
				'@babel/preset-typescript',
			],
			plugins,
		}
	},
	//生成多个htmlPlugin List
	createMultiPageHtml() {
		const htmlPlugins = []
		//根据不同入口生成不同页面
		entryFiles.forEach(dir => {
			htmlPlugins.push(
				new HtmlWebpackPlugin({
					filename: `${dir}.html`,
					template: path.join(publicPath, './template.ejs'),
					inject: 'body', //js插入的位置，true/'head'/'body'/false
					title: 'PUDDING',
					chunks: [dir], //需要引入的chunk，不配置就会引入所有页面的资源
					minify: {
						removeComments: true, //移除HTML中的注释
						collapseWhitespace: false, //删除空白符与换行符
					},
				})
			)
		})
		return htmlPlugins
	},
	createBundleAnalyzerPage() {
		let analyzerPluginList = []
		if (analyzer) {
			analyzerPluginList = [
				new BundleAnalyzerPlugin({
					analyzerMode: 'static',
					openAnalyzer: true,
				}),
				new SpeedMeasureWebpackPlugin(),
			]
		}
		return analyzerPluginList
	},
}
