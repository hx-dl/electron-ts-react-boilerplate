const babel = require('@babel/core')
const babylon = require('@babel/parser')
const traverse = require('@babel/traverse').default

module.exports = source => {
	// 编译main.dev.js => main.js,将生产环境不需要的逻辑从代码中剔除
	const ast = babylon.parse(source, {
		sourceType: 'module',
	})
	traverse(ast, {
		IfStatement(path) {
			const { node } = path
			const statement = node.test.callee && (node.test.callee.name === 'isDev' || node.test.callee.name === 'dev')
			if (statement) {
				// 定位到if(dev()) 或者 if(isDev()) 条件语句块
				const index = path.parent.body.findIndex(item => item.type === 'IfStatement') //获取当前节点索引
				let branch = null //定义变量，用于缓存分支节点
				if (node.alternate) {
					//如果存在其他分支，例如，else if 、else语句，则直接替换掉当前节点
					branch = node.alternate
					if (branch.type === 'IfStatement') {
						// else if 情况
						path.parent.body.splice(index, 1, branch)
					}
					if (branch.type === 'BlockStatement') {
						// else 情况
						branch = branch.body
						path.parent.body.splice(index, 1, ...branch)
					}
				} else {
					//如果不存在分支,直接将if语句删除
					path.parent.body.splice(index, 1)
				}
			}
		},
	})
	const { code } = babel.transformFromAst(ast) //将修剪完毕的ast转换为js，交给webpack做打包处理
	// console.log(code)
	return code
}
