import fs from 'fs'
import path from 'path'
import { BrowserWindow } from 'electron'

/**
 * HTML转PDF方法
 * @htmlPath html 文件路径
 */
const htmlToPdf = async (htmlPath: string) => {
	const win = new BrowserWindow({
		show: false,
	})
	win.loadFile(htmlPath)
	let data = await win.webContents.printToPDF({
		printBackground: true,
		pageSize: 'A4',
	})
	fs.writeFileSync('temp/html.pdf', data)
	return path.resolve(__dirname, 'temp/html.pdf')
}

export default {
	htmlToPdf,
}
