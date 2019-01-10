<template>
    <div class="wrap">
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
import { XButton, XHeader } from 'vux'

export default {
    name: 'container',
    components: {
        XButton,
        XHeader
    },
    data() { 
        return {
            title: '电子签约',
            transitionName: 'slide-left',
            config: 'bankCardAuth,mobileAuth,bodyAuth,realPhotoAuth'
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
        goBack() {console.log(1);
            this.$router.goBack()
        }
    },
    watch: {
        $route(to, from){
            this.title = to.meta.title;
        }
    },
    mounted () {
        
        // this.$router.push({
        //     name: 'bankCardAuth'
        // })
        // this.title = '银行卡认证'
        
        this.$router.push({
            name: 'contract'
        })
        this.title = '客户签名'
    }

}
</script>

<style lang="less">
    @import '../style/defined.less';
    @import '../style/iconfont.less';
    @import '../style/mixin.less';
    @import '../style/public.less';
    @import '../style/layout.less';

    .container {
        height: 100%;
        overflow: scroll;
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        font-size: 36px;
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
</style>