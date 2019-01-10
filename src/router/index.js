import Vue from 'vue'
import Router from 'vue-router'
import index from '@/pages/index'
import bankCardAuth from '@/pages/bankCardAuth'
import mobileAuth from '@/pages/mobileAuth'
import bodyAuth from '@/pages/bodyAuth'
import realPhotoAuth from '@/pages/realPhotoAuth'
import contract from '@/pages/contract'

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
		}, {
			path: '/index/bodyAuth',
			name: 'bodyAuth',
			component: bodyAuth,
			meta: {
				title: '活体检测',
				keepAlive: false, //此组件需要被缓存
				isBack: false, //用于判断上一个页面是哪个
				isFirstEnter: false //是否第一次进入页面
			}
		}, {
			path: '/index/realPhotoAuth',
			name: 'realPhotoAuth',
			component: realPhotoAuth,
			meta: {
				title: '人脸对比',
				keepAlive: false, //此组件需要被缓存
				isBack: false, //用于判断上一个页面是哪个
				isFirstEnter: false //是否第一次进入页面
			}
		}, {
			path: '/index/contract',
			name: 'contract',
			component: contract,
			meta: {
				title: '客户签名',
				keepAlive: false, //此组件需要被缓存
				isBack: false, //用于判断上一个页面是哪个
				isFirstEnter: false //是否第一次进入页面
			}
		}]
	}]
})
