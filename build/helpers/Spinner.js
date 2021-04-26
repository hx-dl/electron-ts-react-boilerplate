const ora = require('ora')
const chalk = require('react-dev-utils/chalk')

class Spinner {
	constructor(text) {
		this.ora = null
		this.initializedOra(text)
	}

	//初始化ora
	initializedOra(text) {
		//定义控制台打印
		this.ora = ora({
			text,
			prefixText: chalk.gray('[PUDDING]'),
		})
	}
}

module.exports = new Spinner().ora
