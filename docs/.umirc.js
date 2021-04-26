const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

function getComponents() {
	const componentsRawPath = path.resolve(__dirname, '../app/src/renderer/common/components')
	const componentDocPath = path.resolve(__dirname, './components')
	let RawPath = fs.readdirSync(componentsRawPath)
	console.log(arr)
	arr.forEach(componentName => {
		execSync(`cp ${componentsRawPath}/${componentName}/index.md ${componentDocPath}/${componentName}.md`)
		components.push({
			title: componentName,
		})
	})
	return components
}

// getComponents()

module.exports = {
	favicon: '/icon.png',
	title: 'PUDDING ｜ 项目开发文档',
	mode: 'site',
	navs: [
		{
			title: '项目文档',
			path: '/project',
			children: [
				{ title: 'API', path: '/project/api' },
				{ title: '组件', path: '/project/components' },
				{ title: '配置', path: '/project/config' },
			],
		},
		{
			title: '框架文档',
			path: '/pudding',
			children: [
				{ title: '框架介绍', path: '/pudding/introduction' },
				{ title: '框架设计说明', path: '/pudding/design' },
			],
		},
		{
			title: '相关链接',
			children: [
				{ title: '蓝湖PRD', path: 'https://lanhuapp.com' },
				{ title: 'Git仓库', path: 'https://' },
			],
		},
	],
	devtool: false,
	devServer: {
		contentBase: 'public/',
		port: 4000,
	},
	nodeModulesTransform: {
		type: 'none',
	},
	resolve: {
		includes: ['./markdown', '../app/src/renderer/common/components'],
	},
	alias: {
		'@components': path.resolve(__dirname, '../app/src/renderer/common/components'),
	},
	extraBabelPlugins: [
		[
			'import',
			{
				libraryName: 'antd',
				libraryDirectory: 'es',
				style: 'css',
			},
		],
	],
	chainWebpack(config) {
		config.devServer.noInfo(true)
		config.resolve.alias.set('@', path.resolve(__dirname, '../app/src/renderer/common/components'))
		config.module
			.rule('js')
			.include.add(path.resolve(__dirname, '..'))
			.end()
			.exclude.add(/node_modules/)
		config.plugin('progress').tap(options => [
			{
				name: '项目文档编译',
				color: '#13c2c2',
			},
		])
		config.plugins.delete('friendly-error')
	},
}
