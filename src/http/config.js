/*
 * @Author: yarkone 
 * @Date: 2018-09-11 11:34:26 
 * @Last Modified by: yarkone
 * @Last Modified time: 2018-11-05 10:26:04
 */
import { baseUrl } from './env'

export default {
    method: 'post',
    // 基础url前缀
    baseURL: baseUrl,
    // 请求头信息
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    },
    // 参数
    data: {},
    // 设置超时时间
    timeout: 10000,
    // 携带凭证
    withCredentials: true,
    // 返回数据类型
    responseType: 'json'
}
