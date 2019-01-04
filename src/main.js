// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import router from './router'
import Vuex from './store/index'
import App from './App'
import { LoadingPlugin, ToastPlugin, BusPlugin } from 'vux'
import api from './http/index'
import 'lib-flexible/flexible'

Vue.use(LoadingPlugin)
Vue.use(ToastPlugin)
Vue.use(BusPlugin)
Vue.use(Vuex)
Vue.use(api)

FastClick.attach(document.body)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
}).$mount('#app-box')
