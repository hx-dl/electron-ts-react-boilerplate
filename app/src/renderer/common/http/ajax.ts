import axios, { AxiosRequestConfig, AxiosPromise } from 'axios'
export default class HttpRequest {
	request(config: AxiosRequestConfig): AxiosPromise<any> {
		return axios(config)
	}
}
