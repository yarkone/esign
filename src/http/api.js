/*
 * @Author: yarkone 
 * @Date: 2018-09-10 17:39:52 
 * @Last Modified by: yarkone
 * @Last Modified time: 2019-01-04 17:09:38
 */
import axios from 'axios'
import config from './config'
import qs from 'qs'

import router from '@/router'
import Vue from 'vue'
// 使用vuex做全局loading时使用
// import store from '@/store'

let authorityTip, requestingCount = 0;

const startLoading = () => {
    Vue.$vux.loading.show()
}

const stopLoading = () => {
    Vue.$vux.loading.hide();
}

const handleRequestLoading = (hideLoading) => {
    if (!requestingCount && !hideLoading)  startLoading();
    requestingCount++
}
const handleResponseLoading = () => {
    requestingCount--
    if (!requestingCount)  stopLoading();
}

export default function $axios(options) {
  return new Promise((resolve, reject) => {
    const instance = axios.create({
      baseURL: config.baseURL,
      headers: {},
      transformResponse: [function (data) {
      }]
    })

    // request 拦截器
    instance.interceptors.request.use(
      config => {
        // let token = Cookies.get('_hr_token')
        // 1. 请求开始的时候可以结合 vuex 开启全屏 loading 动画
        // console.log('准备发送请求...')
        handleRequestLoading(options.hideLoading);
        // 2. 带上token
        // if (token) {
        //   config.headers.Authorization = 'Bearer ' + token
        // }
        // 3. 根据请求方法，序列化传来的参数，根据后端需求是否序列化
        if (config.method === 'post') {
          if (config.data.__proto__ === FormData.prototype
            || config.url.endsWith('path')
            || config.url.endsWith('mark')
            || config.url.endsWith('patchs')
          ) {
          } else {
            config.data = qs.stringify(config.data)
          }
        }
        return config
      },

      error => {
        handleResponseLoading();
        // 请求错误时
        console.log('request:', error)
        // 1. 判断请求超时
        if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
          console.log('timeout请求超时')
          // return service.request(originalRequest);//再重复请求一次
        }
        // 2. 需要重定向到错误页面
        const errorInfo = error.response
        console.log(errorInfo)
        if (errorInfo) {
          //error =errorInfo.data  //页面那边catch的时候就能拿到详细的错误信息,看最下边的Promise.reject
          const errorStatus = errorInfo.status; // 404 403 500 ...
          router.push({
            path: `/error/${errorStatus}`
          })
        }
        return Promise.reject(error) // 在调用的那边可以拿到(catch)你想返回的错误信息
      }
    )

    // response 拦截器
    instance.interceptors.response.use(
      response => {
        //guanbi loading
        handleResponseLoading();

        let data;
        
        // IE9时response.data是undefined，因此需要使用response.request.responseText(Stringify后的字符串)
        if (response.data == undefined) {
          data = JSON.parse(response.request.responseText)
        } else {
          data = response.data
        }
        // 根据返回的code值来做不同的处理
        switch (data.code) {
          case 0:
            return data;
          default:
            //处理错误
            console.log('非法code:' + data.code)
            // if(router.history.current.path == '/') {
            //     // 如果是登录页
            //     MessageBox('登录失败，检查后再重试', '提示', {
            //         showClose: false
            //     });
            // } else {
            //     if(authorityTip) return Promise.reject(data);
            //     authorityTip = true;
            //     let done = function() {
            //         authorityTip = false;
            //         router.push('/');
            //     }
            //     MessageBox(data.msg || '', '提示').then(() => {
            //         done();
            //     }).catch(() => {
            //         done();     
            //     });
            // }
            return Promise.reject(data);
            // return Promise.reject('error')
            // return false;
        }
      },
      err => {
        handleResponseLoading();
        if (err && err.response) {
          switch (err.response.status) {
            case 400:
              err.message = '请求错误'
              break

            case 401:
              err.message = '未授权，请登录'
              break

            case 403:
              err.message = '拒绝访问'
              break

            case 404:
              err.message = `请求地址出错: ${err.response.config.url}`
              break

            case 408:
              err.message = '请求超时'
              break

            case 500:
              err.message = '服务器内部错误'
              break

            case 501:
              err.message = '服务未实现'
              break

            case 502:
              err.message = '网关错误'
              break

            case 503:
              err.message = '服务不可用'
              break

            case 504:
              err.message = '网关超时'
              break

            case 505:
              err.message = 'HTTP版本不受支持'
              break

            default:
          }
        }
        console.error(err)
        return Promise.reject(err) // 返回接口返回的错误信息
      }
    )

    // 请求处理
    instance(options).then(res => {
      resolve(res)
      return false
    }).catch(error => {
      reject(error)
    })
  })
}
