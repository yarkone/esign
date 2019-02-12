import axios from 'axios';
import Vue from 'vue'


let authorityTip, requestingCount = 0;
let _base_host, _estage_host, _wind_host, _img_host;
if(process.env.NODE_ENV == 'development') {
    _base_host = 'http://hrfax.imwork.net:16161/';
    _estage_host = 'http://hrfax.imwork.net:18887/api/';
    _wind_host = 'http://hrfax.imwork.net:18887/';
    _img_host = 'http://hrfax.imwork.net:10082';
} else {
    _base_host = 'http://carloan.hrfax.cn/api';
    _img_host = 'http://carloan.hrfax.cn/api/img/';
}

const startLoading = () => {
    Vue.$vux.loading.show();
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

// axios.defaults.timeout = 5000;
axios.defaults.baseURL = _base_host;

//http request 拦截器
axios.interceptors.request.use(
  config => {

    //loading
    handleRequestLoading(config.hideLoading);

    // const token = getCookie('名称');注意使用的时候需要引入cookie方法，推荐js-cookie
    if(config.method === 'post') {
        config.data = JSON.stringify(config.data);
        config.headers = {
            'Content-Type':'application/json;charset=utf-8'
        }
    }
    
    
    // if(token){
    //   config.params = {'token':token}
    // }
    return config;
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
    return Promise.reject(err);
  }
);


//http response 拦截器
axios.interceptors.response.use(
  response => {
    //关闭 loading
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
        // Vue.$vux.toast.show({
        //     type: 'text',
        //     text: data.msg || '系统异常',
        //     width: '10em',
        //     position: 'bottom'
        // })
        Vue.$vux.alert.show({
            title: '提示',
            content: data.msg || '系统异常'
        })
    }
    return data;
  },
  error => {
    handleResponseLoading();
    return Promise.reject(error)
  }
)


/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function fetch(url,params = {}, config = {}){
  return new Promise((resolve,reject) => {
    axios.get(url,{
      params: params,
      config: config
    })
    .then(response => {
      resolve(response);
    })
    .catch(err => {
      reject(err)
    })
  })
}


/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

 export function post(url,data = {}){
   return new Promise((resolve,reject) => {
     axios.post(url,data)
          .then(response => {
            resolve(response);
          },err => {
            reject(err)
          })
   })
 }

 /**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function patch(url,data = {}){
  return new Promise((resolve,reject) => {
    axios.patch(url,data)
         .then(response => {
           resolve(response);
         },err => {
           reject(err)
         })
  })
}

 /**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function put(url,data = {}){
  return new Promise((resolve,reject) => {
    axios.put(url,data)
         .then(response => {
           resolve(response);
         },err => {
           reject(err)
         })
  })
}

export function getApi(method, name) {
  // name不传值，代表取mock中假数据
  if(!name)
    return 'http://127.0.0.1:8083/mock/' + method;
  else
    switch (name) {
      case 'estage':
        return _estage_host + method;
      case 'wind':
        return _wind_host + method;
      case 'img':
        return _img_host + method;
      default:
        return _base_host + method;
    }
}


