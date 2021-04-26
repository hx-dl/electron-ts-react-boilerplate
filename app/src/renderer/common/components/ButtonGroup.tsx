import React, { useState } from 'react'
import { Button } from 'antd'

interface PropsStruct {
	text: string
}

function ButtonGroup(props: PropsStruct) {
	return (
		<div>
			<Button type="primary">{props.text}</Button>
			<Button type="ghost">{props.text}</Button>
			<Button type="dashed">{props.text}</Button>
			<Button type="link">{props.text}</Button>
		</div>
	)
}

export default ButtonGroup
