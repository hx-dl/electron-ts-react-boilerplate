import window from './window'
import pdf from './pdf'
import update from './update'

//将个个模块注册全局对象services, 方便渲染进程使用 remote.getGlobal 调用
global.services = {
	window,
	pdf,
	update,
}

export {
	window, //渲染进程窗口管理模块
	pdf, //pdf相关模块
	update, //热更新相关模块
}
