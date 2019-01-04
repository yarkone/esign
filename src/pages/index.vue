<template>
    <div class="wrap">
        <x-header
            :left-options="{backText: ''}"
            class="vux-1px-b"
            style="background-color: #fff;width:100%;position:fixed;left:0;top:0;z-index:100;"
        >{{title}}</x-header>
        <div class="container" style="padding-top: 46px;">
            <keep-alive>
                <router-view v-if="$route.meta.keepAlive"></router-view>
            </keep-alive>
            <router-view v-if="!$route.meta.keepAlive"></router-view>
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
            title: '电子签约'
        }
    },
    methods: {
        haha() {
            
        }
    },
    watch: {
        $route(to, from){
            this.title = to.meta.title;
        }
    },
    mounted () {

        this.$router.push({
            name: 'bankCardAuth'
        })
        this.title = '银行卡认证'
    }

}
</script>

<style lang="less">
    @import '../style/defined.less';
    @import '../style/iconfont.less';
    @import '../style/mixin.less';
    @import '../style/layout.less';

    .container {
        height: 100%;
        overflow: scroll;
    }
</style>