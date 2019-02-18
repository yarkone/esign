<template>
	<div id="app">
		<x-header
            :left-options="{backText: '', showBack: showBackIcon, preventGoBack: true}"
            @on-click-back="backConfirm"
            class="vux-1px-b"
            style="background-color: #fff;width:100%;position:absolute;left:0;top:0;z-index:100;"
        >{{title}}</x-header>
        <div class="container" ref="container">
            <transition :name="transitionName">
                <router-view class="child-view" style="padding-top:46px;"></router-view>
            </transition>
        </div>
	</div>
</template>

<script>
	import { XButton, XHeader, querystring } from 'vux'
	import { tool } from './mixins/tool'
	import BScroll from 'better-scroll'

	export default {
		name: 'app',
		components: {
			XHeader
		},
		data() { 
			return {
				totalInfo: null,
				title: '电子签约',
				showBackIcon: true,
				transitionName: 'slide-left'
			}
		},
		beforeRouteEnter (to, from, next) {console.log('App.vue.  beforeRouteEnter');
			// 在渲染该组件的对应路由被 confirm 前调用
			// 不！能！获取组件实例 `this`
			// 因为当守卫执行前，组件实例还没被创建
		},
		beforeRouteUpdate (to, from, next) {console.log('App.vue.  beforeRouteUpdate');
			let isBack = this.$router.isBack
			if (isBack) {
				this.transitionName = 'slide-right'
			} else {
				this.transitionName = 'slide-left'
			}
			this.$router.isBack = false
			next()
		},
		beforeRouteLeave (to, from, next) {console.log('App.vue.  beforeRouteLeave');
			// 导航离开该组件的对应路由时调用
			// 可以访问组件实例 `this`
		},
		created () {
			//首页不需要返回按钮
			if(this.$route.name === '' || this.$route.name === 'index') {
				this.showBackIcon = false;
			}
			//每个页面的header的title
			this.title = this.$route.meta.title;
		},
		mounted () {
			this.$nextTick(() => {
				this.BScroll = new BScroll(this.$refs.container)
			});
		},
		methods: {
			haha() {
				
			},
			backConfirm() {
				let that = this;
				this.$vux.confirm.show({
					title: '提示',
					content: '您当前正在进行电子签约，请确定，是否退出？',
					onCancel () {},
					onConfirm () {
						//Todo  跳转到sdk对接方页面
						that.$router.goBack();
					}
				})
			}
		},
		watch: {
			$route(to, from){
				const routeDeep = tool.getTotalInfo().authTypes || [''];
				const toDepth = routeDeep.indexOf(to.name)
				const fromDepth = routeDeep.indexOf(from.name)
				this.transitionName = toDepth > fromDepth ? 'slide-left' : 'slide-right'
				
				if(to.name !== '' && to.name !== 'index') {
					this.showBackIcon = true;
				}
				this.title = to.meta.title;
			}
		},
	}
</script>

<style lang="less">
	@import '~vux/src/styles/reset.less';
	@import '~vux/src/styles/1px.less';

	body {
		background-color: #eeeeee;
		.container {
			height: 100%;
			overflow: scroll;
			position: absolute;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			.child-view {
				position: absolute;
				width:100%;
				transition: all .3s cubic-bezier(.55,0,.1,1);
			}
			.slide-left-enter, .slide-right-leave-active {
				opacity: 0;
				-webkit-transform: translate(50px, 0);
				transform: translate(50px, 0);
			}
			.slide-left-leave-active, .slide-right-enter {
				opacity: 0;
				-webkit-transform: translate(-50px, 0);
				transform: translate(-50px, 0);
			}
		}
	}
</style>
