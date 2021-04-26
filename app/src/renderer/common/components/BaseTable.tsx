import React from 'react'
import { Table } from 'antd'

interface PropsStruct {
	dataSource: Array<any>
	columns: Array<any>
}

function BaseTable(props: PropsStruct) {
	return <Table dataSource={props.dataSource} columns={props.columns}></Table>
}

export default BaseTable
