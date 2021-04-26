import fs from 'fs'
import styled from 'styled-components'
import { Button } from 'antd'
import React, { useState, useEffect } from 'react'
import PDFViewer from '@components/PDFViewer'
import { remote } from 'electron'
import logo from '@images/logo.svg'
import is from 'electron-is'

const isDev = process.env.NODE_ENV === 'development'
const isWindows = is.windows()

function Login() {
	let path = ''
	if (isDev) {
		path = 'file://' + process.cwd() + '/app/static/demo.pdf##scrollbars=0&toolbar=0&statusbar=0&view=FitH'
	} else {
		path = '../demo.pdf#toolbar=1&view=FitH'
	}
	const [count, setCount] = React.useState(0)
	const [tempPath, setTempPath] = useState(path)
	const [visible, setVisible] = useState(false)

	useEffect(() => {
		if (isWindows) {
			path = path.replace('/', '\\')
			setTempPath(path)
		}
	}, [])

	const handleOpenPdfViewer = () => {
		setVisible(true)
	}

	const handleCloseViewer = () => {
		setVisible(false)
	}

	const handleClick = () => {
		setCount(count + 1)
	}

	//electron 导出网页为pdf
	const printToPDF = async () => {
		let data = await remote.getCurrentWindow().webContents.printToPDF({
			printBackground: true,
			pageSize: 'A4',
		})
		let pathObj = await remote.dialog.showSaveDialog({
			title: '保存成PDF',
			filters: [{ name: 'pdf', extensions: ['pdf'] }],
		})
		if (pathObj.canceled) return
		else {
			fs.writeFile(pathObj.filePath!, data, err => {
				if (err) throw err
				console.log('保存成功')
			})
		}
	}

	return (
		<LoginWrapper>
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<p onClick={handleClick}>点击增加数值: {count}</p>
				<Button type="primary" onClick={handleOpenPdfViewer}>
					pdf预览弹窗
				</Button>
				<Button onClick={printToPDF}>当前网页转pdf</Button>
				<div> node 版本: v{process.versions['chrome']}</div>
				<div> chromium 版本: v{process.versions['node']} </div>
				<PDFViewer pdfPath={tempPath} visible={visible} onCancel={handleCloseViewer} />
			</header>
		</LoginWrapper>
	)
}

const LoginWrapper = styled.div`
	.App-header {
		background-color: #282c34;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: calc(10px + 2vmin);
		text-align: center;

		div,
		p {
			color: white;
			margin-bottom: 10px;
		}

		button {
			margin-bottom: 10px;
		}

		.App-logo {
			height: 40vmin;
			pointer-events: none;
		}
	}

	@media (prefers-reduced-motion: no-preference) {
		.App-logo {
			animation: App-logo-spin infinite 20s linear;
		}
	}

	@keyframes App-logo-spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
`

export default Login
