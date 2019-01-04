<template>
    <mt-header :title="headConfig.title" style="background: #fff;">
        <router-link to="/" slot="left">
            <mt-button icon="back" @click="handleClose"></mt-button>
        </router-link>
        <mt-button icon="" slot="right" @click="more" v-show="headConfig.more">{{headConfig.more}}</mt-button>
    </mt-header>
</template>

<script>

    export default {
        name: 'headTop',
        props: {
            headConfig: {
                type: Object,

            }
        },
        data () {
			return {
                
            }
		},
		mounted () {
            		
		},
        methods: {
            handleClose: function(){
                console.log("返回")
                history.go(-1);
            },
            more: function(){
            
            }

        }
    }
</script>

<style lang="less">
	@import "../style/defined";
    @import '../style/public';
    @import '../style/headTop';    
</style>
