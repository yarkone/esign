import Vue from 'vue'
import Router from 'vue-router'
import index from '@/pages/index'
import bankCardAuth from '@/pages/bankCardAuth'
import mobileAuth from '@/pages/mobileAuth'

Router.prototype.goBack = function () {
	this.isBack = true
	window.history.go(-1)
}

Vue.use(Router)

export default new Router({
  	routes: [{
		path: '/',
		name: 'index',
		component: index,
		children: [{
			path: '',
			name: 'bankCardAuth',
			component: bankCardAuth,
			meta: {
				title: '银行卡认证'
			}
		},{
			path: '/bankCardAuth',
			name: 'bankCardAuth',
			component: bankCardAuth,
			meta: {
				title: '银行卡认证'
			}
		}, {
			path: '/mobileAuth',
			name: 'mobileAuth',
			component: mobileAuth,
			meta: {
				title: '短信认证'
			}
		}]
	}]
})
