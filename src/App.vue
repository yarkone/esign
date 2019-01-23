<template>
	<div id="app">
		<x-header
            :left-options="{backText: '', preventGoBack: true}"
            @on-click-back="goBack"
            class="vux-1px-b"
            style="background-color: #fff;width:100%;position:fixed;left:0;top:0;z-index:100;"
        >{{title}}</x-header>
        <div class="container" style="padding-top: 46px;">
            <transition :name="transitionName">
                <router-view class="child-view"></router-view>
            </transition>
        </div>
	</div>
</template>

<script>
	import { XButton, XHeader, querystring } from 'vux'

	export default {
		name: 'app',
		components: {
			XHeader
		},
		data() { 
			return {
				totalInfo: null,
				title: '电子签约',
				transitionName: 'slide-left'
			}
		},
		beforeRouteUpdate (to, from, next) {
			let isBack = this.$router.isBack
			if (isBack) {
				this.transitionName = 'slide-right'
			} else {
				this.transitionName = 'slide-left'
			}
			this.$router.isBack = false
			next()
		},
		methods: {
			haha() {
				
			},
			goBack() {
				let that = this;
				this.$vux.confirm.show({
					title: '提示',
					content: '您当前正在进行电子签约，请确定，是否退出？',
					onCancel () {},
					onConfirm () {
						that.$router.goBack();
					}
				})
				
			}
		},
		watch: {
			$route(to, from){
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
			position: fixed;
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
