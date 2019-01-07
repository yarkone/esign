<template>
    <div class="padding2020 bankCardAuth">
        <div class="white-box">
            <div class="result-panel">
                <i class="iconfont color-success i-success">&#xe784;</i>
                <span class="result-text">验证通过</span>
            </div>
            <div class="list-wrap">
                <div class="list-item vux-1px-b"><div class="list-item-left">姓名：</div><div class="list-item-right">金飞</div></div>
                <div class="list-item vux-1px-b"><div class="list-item-left">身份证号：</div><div class="list-item-right">412802199302033154</div></div>
                <div class="list-item vux-1px-b"><div class="list-item-left">银行卡号：</div><div class="list-item-right">154615451545125152</div></div>
                <div class="list-item vux-1px-b"><div class="list-item-left">银行卡预留手机号：</div><div class="list-item-right">13002601634</div></div>
            </div>
            <div class="rule-area">
                
            </div>
            <x-button type="warn" @click.native="next">下一步</x-button>
        </div>
        <!-- <div class="white-box">
            <div class="result-panel">
                <i class="iconfont color-fail i-success">&#xe706;</i>
                <span class="result-text">验证失败</span>
            </div>
            <div class="list-wrap">
                <div class="list-item vux-1px-b">姓名：<span class="list-item-right">金飞</span></div>
                <div class="list-item vux-1px-b">身份证号：<span class="list-item-right">412802199302033154</span></div>
                <div class="list-item vux-1px-b">银行卡号：<span class="list-item-right">154615451545125152</span></div>
                <div class="list-item vux-1px-b">银行卡预留手机号：<span class="list-item-right">13002601634</span></div>
            </div>
            <x-button type="default">返回</x-button>
        </div> -->
    </div>
</template>

<script>
    import { XButton } from 'vux'

    export default {
        name: 'bankCardAuth',
        components: {
            XButton
        },
        data() { 
            return {

            }
        },
        methods: {
            next () {
                this.$router.push({
                    name: 'mobileAuth'
                })
            }
        },
        mounted() {
            var params = {
                account: '100000004',
                password: '96e79218965eb72c92a549dd5a330112',
                LoginAgent: 'WEB'
            }
            // this.$api.doLogin(params).then(res => {
            //     // console.log(res)
            // }).catch(error => {
            //     console.log(error);
            // })
        }
    }
</script>

<style lang="less" scoped>
    .bankCardAuth{
        .result-panel .result-text {
            margin-left: 30px;
        }
        .list-wrap {
            margin: 80px 0 110px 0;
        }
    }
</style>