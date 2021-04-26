module.exports = {
	types: [
		{
			value: '新功能',
			name: '✨  新功能:\t新加入的功能',
		},
		{
			value: '问题修复',
			name: '🐞  修复:\t修复已存在的问题',
		},
		{
			value: '配置变更',
			name: '⚙️   配置:\t修改项目配置',
		},
		{
			value: '文档更新',
			name: '📚  文档:\t修改文档内容',
		},
	],
	// override the messages, defaults are as follows
	messages: {
		type: '选择一种提交类型:',
		subject: '为提交内容编写简短的描述:\n',
		confirmCommit: '确认提交?',
	},
	// skip any questions you want
	allowCustomScopes: false,
	skipQuestions: ['body', 'scope', 'breaking', 'footer'],
}
