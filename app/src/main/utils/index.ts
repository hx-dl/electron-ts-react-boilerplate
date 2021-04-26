import fs from 'fs-extra'
import path from 'path'
import is from 'electron-is'
import log from 'electron-log'
import { execSync } from 'child_process'

const isDev = () => is.dev()

const writeFileSyncExtra = (pathStr: string, contents: any, encoding: string) => {
	const getDirName = path.dirname
	fs.mkdirpSync(getDirName(pathStr))
	fs.writeFileSync(pathStr, contents, encoding)
}

const copyDirSync = (from: string, to: string) => {
	let winCmd = `xcopy ${from}\\* ${to} /s /y /e`
	let cmdLin = `cp -R ${from} ${to}`
	let cmd = is.windows() ? winCmd : cmdLin
	execSync(cmd)
}
const printLog = (text: any, ...args: any[]) => {
	log.info(text, ...args)
}

const normalizePath = (pathStr: string): string => {
	return path.normalize(pathStr)
}

export { writeFileSyncExtra, copyDirSync, printLog, isDev, normalizePath }
