<template>
	<div id="app">
		<div class="container" ref="container" style="margin-top:46px;">
			<transition :name="transitionName">
					<router-view class="child-view"></router-view>
			</transition>
		</div>

		<!-- <transition :name="transitionName">
			<div class="container" ref="container" style="margin-top:46px;">
				<router-view class="child-view"></router-view>
			</div>
		</transition> -->
        
		<x-header
            :left-options="{backText: '', showBack: showBackIcon, preventGoBack: true}"
            @on-click-back="backConfirm"
            class="vux-1px-b"
            style="background-color: #fff;width:100%;position:absolute;left:0;top:0;z-index:1;"
        >{{title}}</x-header>
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
				transitionName: 'slide-left',
				BScroll: null,
			}
		},
		created () {
			//首页不需要返回按钮
			if(this.$route.name === '' || this.$route.name === 'index') {
				this.showBackIcon = false;
			}
			//每个页面的header的title
			document.title = this.title = this.$route.meta.title;
		},
		mounted () {console.log('app.vue')
			this._initBScroll();
		},
		methods: {
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
			},
			_initBScroll() {
				this.$nextTick(() => {
					if(!this.BScroll) {
						this.BScroll = new BScroll(this.$refs.container, { mouseWheel: true, click: true, tap: true });
					} else {
						this.BScroll.refresh();
					}
				});
			},
			_BScrollRefresh() {
				if(this.BScroll) {
					// this.BScroll.refresh();
					this.BScroll.destroy();
					this.BScroll = new BScroll(this.$refs.container, { mouseWheel: true, click: true, tap: true });
				}
			},
		},
		watch: {
			$route(to, from){
				const routeDeep = tool.getTotalInfo().authTypesArr || [''];
				const toDepth = routeDeep.indexOf(to.name)
				const fromDepth = routeDeep.indexOf(from.name)
				this.transitionName = toDepth > fromDepth ? 'slide-left' : 'slide-right'
				
				if(to.name !== '' && to.name !== 'index') {
					this.showBackIcon = true;
				}
				document.title = this.title = to.meta.title;
			},
		},
	}
</script>

<style lang="less">
	@import '~vux/src/styles/reset.less';
	@import '~vux/src/styles/1px.less';

	html, body {
		height: 100%;
		background-color: #eeeeee;
		#app {
			height: 100%;
		}
		.weui-mask_transparent {
			background: rgba(0, 0, 0, 0.4);
		}
		.container {
			position: absolute;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			z-index: 1;
			overflow: hidden;
			.child-view {
				position: absolute;
				top: 0;
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
