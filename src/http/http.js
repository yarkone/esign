/*
 * @Author: yarkone 
 * @Date: 2018-09-10 17:01:40 
 * @Last Modified by: yarkone
 * @Last Modified time: 2018-09-10 17:27:49
 */
import axios from 'axios'
import { baseUrl } from './env'
import Element from 'element-ui'

//axios配置
axios.defaults.timeout = 5000
axios.defaults.baseURL = baseUrl

//http request 拦截器
axios.interceptors.request.use(
    config => {
        if (Cookie.get('_hr_token')) {
            config.headers.Authorization = `Bearer ${Cookie.get('_hr_token')}`
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    }
)

//http response 拦截器
axios.interceptors.response.use(
    response => {
        return response;
    },
    err => {
        if(err.response) {
            switch (err.response.code) {
                default:
                    Element.$alert(`$(err.response.msg)`, '提示', {
                        confirmButtonText: '确定',
                        callback: action => {}
                    });
            }
        }
        // console.log(JSON.stringify(error));//console : Error: Request failed with status code 402
        return Promise.reject(error.response.data)
    }
)

export default axios
