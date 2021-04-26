/** @type { import('webpack').Configuration } */

const WebpackBar = require('webpackbar')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const { getRendererEntry, getBabelOptions, createMultiPageHtml } = require('./logicalConfig')
const devMode = process.env.NODE_ENV === 'development'

module.exports = {
	target: 'electron-renderer',
	entry: getRendererEntry(),
	output: {
		filename: 'js/[name].bundle.js',
		path: `${process.cwd()}/app/dist/renderer`,
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
		alias: {
			'@src': `${process.cwd()}/app/src/renderer`,
			'@common': `${process.cwd()}/app/src/renderer/common`,
			'@components': `${process.cwd()}/app/src/renderer/common/components`,
			'@styles': `${process.cwd()}/app/src/renderer/common/assets/styles`,
			'@images': `${process.cwd()}/app/src/renderer/common/assets/images`,
			'@lang': `${process.cwd()}/app/src/renderer/common/assets/lang`,
		},
	},
	plugins: [
		new MiniCssExtractPlugin({
			ignoreOrder: true,
			filename: 'css/[name].css',
			chunkFilename: 'css/[id].css',
		}),
		new FriendlyErrorsWebpackPlugin({ clearConsole: false }),
		new WebpackBar({ name: '渲染进程代码编译', color: '#d3adf7' }),
		...createMultiPageHtml(),
	],
	module: {
		noParse: function (content) {
			return /\*\.min\.js/.test(content) // 不解析*.min.js
		},
		rules: [
			//ts语法转换,使用babel一步到位
			{
				test: /\.ts(x)?$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'thread-loader',
						options: {
							workers: 2,
						},
					},
					{
						loader: 'babel-loader',
						options: getBabelOptions(),
					},
				],
			},
			//层叠样式表抽离
			{
				test: /\.css$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: { publicPath: '../' },
					},
					'css-loader',
				],
			},
			//antd内部样式预处理使用了less，所以这里做了less语法支持
			{
				test: /\.less$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: { publicPath: '../' },
					},
					'css-loader',
					{
						loader: 'less-loader',
						options: {
							lessOptions: {
								javascriptEnabled: true,
							},
						},
					},
				],
			},
			//iconfont静态文件
			{
				test: /\.(woff2?|eot|ttf|otf|cur)(\?.*)?$/,
				use: {
					loader: 'file-loader',
					options: {
						name: 'iconfont/[name].[ext]',
						esModule: false,
					},
				},
			},
			//本地图片资源,由于是客户端本地打包，图片资源不需要使用url-loader转为base64注入js bundle中
			{
				test: /\.(png|jpg|gif|jpeg|svg)$/,
				use: {
					loader: 'file-loader',
					options: {
						name: 'images/[name].[ext]',
						esModule: false,
					},
				},
			},
		],
	},
}
