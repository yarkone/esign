import Vue from 'vue'
import Router from 'vue-router'
import index from '@/pages/index'
import bankCardAuth from '@/pages/bankCardAuth'
import mobileAuth from '@/pages/mobileAuth'

Vue.use(Router)

export default new Router({
  	routes: [{
		path: '/',
		name: 'index',
		component: index,
		children: [{
			path: '/index/bankCardAuth',
			name: 'bankCardAuth',
			component: bankCardAuth,
			meta: {
				title: '银行卡认证',
				keepAlive: false, //此组件需要被缓存
				isBack: false, //用于判断上一个页面是哪个
				isFirstEnter: false //是否第一次进入页面
			}
		}, {
			path: '/index/mobileAuth',
			name: 'mobileAuth',
			component: mobileAuth,
			meta: {
				title: '短信认证',
				keepAlive: false, //此组件需要被缓存
				isBack: false, //用于判断上一个页面是哪个
				isFirstEnter: false //是否第一次进入页面
			}
		}]
	}]
})
