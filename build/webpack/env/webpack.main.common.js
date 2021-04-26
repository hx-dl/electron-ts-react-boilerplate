/** @type { import('webpack').Configuration } */

const WebpackBar = require('webpackbar')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
//定义目录
const rootPath = process.cwd()

module.exports = {
	target: 'electron-main',
	entry: `${rootPath}/app/src/main/main.dev.ts`,
	node: {
		__dirname: false,
		__filename: false,
	},
	resolve: {
		extensions: ['.ts', '.js'],
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				exclude: /node_modules/,
				use: [
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
			{
				//处理依赖中出现 #!/usr/bin/env node 这样的语句
				test: /\.js$/,
				include: /node_modules/,
				use: 'shebang-loader',
			},
			{
				//处理依赖中包含了 *.node 的脚本
				test: /\.node$/,
				use: 'node-loader',
				include: /node_modules/,
			},
		],
	},
	plugins: [
		new WebpackBar({ name: '主进程代码编译', color: '#faad14' }), //打包进度条
		new FriendlyErrorsWebpackPlugin({ clearConsole: false }),
	],
}
