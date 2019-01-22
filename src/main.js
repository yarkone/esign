// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import router from './router'
import Vuex from './store/index'
import App from './App'
import { LoadingPlugin, ToastPlugin, AlertPlugin, ConfirmPlugin, BusPlugin } from 'vux'
import promise from 'es6-promise'
import {post,fetch,patch,put} from './http/index'
import 'lib-flexible/flexible'


//定义全局变量
Vue.prototype.$post=post;
Vue.prototype.$fetch=fetch;
Vue.prototype.$patch=patch;
Vue.prototype.$put=put;

promise.polyfill()

Vue.use(LoadingPlugin)
Vue.use(ToastPlugin)
Vue.use(AlertPlugin)
Vue.use(ConfirmPlugin)
Vue.use(BusPlugin)
Vue.use(Vuex)

FastClick.attach(document.body)


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
}).$mount('#app-box')
