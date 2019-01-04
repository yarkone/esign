/*
 * @Author: yarkone 
 * @Date: 2018-09-11 11:34:37 
 * @Last Modified by: yarkone
 * @Last Modified time: 2018-09-11 11:56:57
 */
// 导入所有接口
import apiList from './interface'
const install = Vue => {
    if (install.installed) 
        return;
    install.installed = true;

    Object.defineProperties(Vue.prototype, {
        // 注意哦，此处挂载在 Vue 原型的 $api 对象上
        $api: {
            get() {
                return apiList
            }
        }
    })
}

export default install
