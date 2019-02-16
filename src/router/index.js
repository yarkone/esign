import Vue from 'vue'
import Router from 'vue-router'
import index from '@/pages/index'
import bankCardAuth from '@/pages/bankCardAuth'
import mobileAuth from '@/pages/mobileAuth'
import bodyAuth from '@/pages/bodyAuth'
import bodyAuthResult from '@/pages/bodyAuthResult'
import faceContrastAuth from '@/pages/faceContrastAuth'
import contract from '@/pages/contract'

Router.prototype.goBack = function () {
	this.isBack = true
	window.history.go(-1)
}

Vue.use(Router)

export default new Router({
	mode: 'history',
    scrollBehavior (to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { x: 0, y: 0 }
        }
	},
  	routes: [{
		path: '',
		name: '',
		component: index,
		meta: {
			title: '电子签约'
		}
	  }, {
		path: '/',
		name: 'index',
		component: index,
		meta: {
			title: '电子签约'
		}
	}, {
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
		path: '/bodyAuth',
		name: 'bodyAuth',
		component: bodyAuth,
		meta: {
			title: '活体检测',
			keepAlive: false, //此组件需要被缓存
			isBack: false, //用于判断上一个页面是哪个
			isFirstEnter: false //是否第一次进入页面
		}
	}, {
		path: '/bodyAuthResult',
		name: 'bodyAuthResult',
		component: bodyAuthResult,
		meta: {
			title: '活体检测结果',
			keepAlive: false, //此组件需要被缓存
			isBack: false, //用于判断上一个页面是哪个
			isFirstEnter: false //是否第一次进入页面
		}
	}, {
		path: '/faceContrastAuth',
		name: 'faceContrastAuth',
		component: faceContrastAuth,
		meta: {
			title: '人脸对比',
			keepAlive: false, //此组件需要被缓存
			isBack: false, //用于判断上一个页面是哪个
			isFirstEnter: false //是否第一次进入页面
		}
	}, {
		path: '/contract',
		name: 'contract',
		component: contract,
		meta: {
			title: '客户签名',
			keepAlive: false, //此组件需要被缓存
			isBack: false, //用于判断上一个页面是哪个
			isFirstEnter: false //是否第一次进入页面
		}
	}]
})
