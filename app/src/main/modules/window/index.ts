import { isDev } from '../../utils'
import path from 'path'
import { BrowserWindow, Tray, Menu, app, BrowserWindowProxy, BrowserView } from 'electron'

// windowMap用于保持每个窗口对象的引用，防止窗口对象被JavaScript对象被垃圾回收
const windowMap: Map<string, BrowserWindow | null> = new Map()

/** 创建业务主窗口方法,如果窗口已存在则聚焦到窗口 */
const createBizWin = () => {
	if (!windowMap.get('biz')) {
		const bizWin = new BrowserWindow({
			width: 400,
			height: 700,
			show: false,
			webPreferences: {
				nodeIntegration: true,
				enableRemoteModule: true,
				webSecurity: false,
				plugins: true,
			},
		})
		windowMap.set('biz', bizWin) //保存窗口引用
		if (isDev()) {
			bizWin.loadURL('http://localhost:3000/biz.html') //开发模式下加载本地开发服务器页面
			bizWin.webContents.openDevTools() //开启控制台
		} else {
			bizWin.loadFile(`renderer/biz.html`)
		}
		bizWin.on('ready-to-show', bizWin.show)
		bizWin.on('closed', () => {
			windowMap.set('biz', null) //窗口关闭后清除引用
		})
		return bizWin
	} else {
		windowMap.get('biz')!.focus() //窗口已创建则聚焦窗口
		return windowMap.get('biz')!
	}
}

/** 创建热更新窗口方法*/
const createUpdateWin = () => {
	const updateWin = new BrowserWindow({
		width: 300,
		height: 240,
		show: false,
		resizable: false,
		modal: true,
		parent: windowMap.get('biz')!,
		webPreferences: {
			nodeIntegration: true,
			enableRemoteModule: true,
			webSecurity: false,
		},
	})
	windowMap.set('update', updateWin) //保存窗口引用
	if (isDev()) {
		updateWin.loadURL('http://localhost:3000/update.html') //开发模式下加载本地开发服务器页面
	} else {
		updateWin.loadFile(`renderer/update.html`)
	}
	updateWin.on('closed', () => {
		windowMap.set('update', null) //窗口关闭后清除引用
	})
	return updateWin
}

// 定义全局变量 否则会被回收
let tray: Tray
/**
 * 创建系统托盘
 * @param {string} windowId 窗口的id
 */
const setUpTray = (windowId: string) => {
	const lightIcon = path.join(__dirname, '/res/smallicon.png')
	tray = new Tray(lightIcon)

	let windowObj = windowMap.get(windowId)!

	const contextMenu = Menu.buildFromTemplate([
		{
			label: '打开/隐藏客户端',
			click: () => {
				windowObj.isVisible() ? windowObj.hide() : windowObj.show()
			},
		},
		{
			label: '退出',
			click: () => {
				app.quit()
			},
		},
	])
	tray.setToolTip('金融项目客户端')
	tray.setContextMenu(contextMenu)

	// windows下双击托盘图标打开app
	tray.on('double-click', () => {
		windowObj.isVisible() ? windowObj.hide() : windowObj.show()
	})
}

export default {
	windowMap,
	createBizWin,
	createUpdateWin,
	setUpTray,
}
