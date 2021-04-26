import React from 'react'
import { render } from 'react-dom'
import { HashRouter, Route } from 'react-router-dom'
import { routeConfig } from './routes'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/lib/locale/zh_CN'
import 'antd/dist/antd.less'
import '@styles/reset.less'

const App = () => {
	return (
		<ConfigProvider componentSize="middle" locale={zhCN}>
			<HashRouter>
				{routeConfig.map(route => {
					return <Route key={route.path} path={route.path} component={route.component}></Route>
				})}
			</HashRouter>
		</ConfigProvider>
	)
}

render(<App />, document.getElementById('root'))
