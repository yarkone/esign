/*
 * @Author: yarkone
 * @Date: 2018-09-11 11:34:57
 * @Last Modified by: yarkone
 * @Last Modified time: 2018-12-03 14:21:57
 */
import axios from './api'

/*
 * 将所有接口统一起来便于维护
 * 如果项目很大可以将 url 独立成文件，接口分成不同的模块
 */

// 登录接口
export const doLogin = data => {
    return axios({
        url: '/login/doLogin',
        method: 'post',
        data
    })
}

// 退出登录接口
export const doLogout = data => {
    return axios({
        url: '/logout',
        method: 'post',
        data
    })
}

//消息请求接口
export const msgInterval = () => {
    return axios({
        url: '/busiMsg/get?pageNum=1&pageSize=5',
        method: 'get'
    })
}

//菜单树接口
export const menuTree = () => {
    return axios({
        url: '/menu/tree',
        method: 'get'
    })
}

// 贷款办理接口
export const loanOrderWorkbench = data => {
    return axios({
        url: 'loanOrder/workbench',
        method: 'post',
        data
    })
}

//选择银行
export const demandBankSelectBank = () => {
    return axios({
        hideLoading: true,
        url: '/demandBank/selectBank',
        method: 'get'
    })
}

//分公司
export const pmsDeptGetPmsDeptList = () => {
    return axios({
        hideLoading: true,
        url: '/pmsDept/getPmsDeptList',
        method: 'get'
    })
}

//解锁接口
export const taskLock = data => {
    return axios({
        url: 'task/lock',
        method: 'post',
        data
    })
}

export const list = (id) => {
    return axios({
        url: `/list${id}`,
        method: 'get'
    })
}

export const upload = data => {
    return axios({
        url: '/upload',
        method: 'post',
        data
    })
}

// 默认全部导出
export default {
    doLogin,
    doLogout,
    msgInterval,
    menuTree,
    loanOrderWorkbench,
    taskLock,
    demandBankSelectBank,
    pmsDeptGetPmsDeptList,


    list,
    upload
}
