import React, { useState, useEffect } from 'react'
import { Progress } from 'antd'
import { remote } from 'electron'
import styled from 'styled-components'
import 'antd/es/progress/style/index.css'

function Update() {
	const [rate, setRate] = useState(0)
	const [tipText, setTipText] = useState('下载更新内容')

	useEffect(() => {
		remote.getGlobal('update').executeUpdateProcess(
			(process: number) => {
				if (process >= 100) process = 95
				setRate(process)
			},
			() => {
				setRate(100)
			}
		)
	}, [])

	useEffect(() => {
		if (rate >= 100) {
			setTipText('下载完成')
		}
	}, [rate])

	return (
		<WrappedUpdate>
			<div className="progress-area">
				<Progress percent={rate} type="circle" status="active" />
				<p className="text">{tipText}</p>
			</div>
		</WrappedUpdate>
	)
}

const WrappedUpdate = styled.div`
	background: #f2f3f8;
	height: 100vh;
	text-align: center;
	display: flex;
	justify-content: center;
	align-items: center;
	.text {
		margin-top: 10px;
		font-size: 20px;
	}
`
export default Update
