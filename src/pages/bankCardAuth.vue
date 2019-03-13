<template>
    <div class="padding2020">
        <div class="white-box">
            <div class="result-panel" v-show="isMounted && isPass">
                <i class="iconfont color-success i-success">&#xe784;</i>
                <span class="result-text">验证通过</span>
            </div>
            <div class="result-panel" v-show="isMounted && !isPass">
                <i class="iconfont color-fail i-success">&#xe706;</i>
                <span class="result-text">验证失败</span>
            </div>
            <div class="list-wrap">
                <div class="list-item vux-1px-b"><div class="list-item-left">姓名：</div><div class="list-item-right">{{totalInfo && totalInfo.userInfo && totalInfo.userInfo.name || ''}}</div></div>
                <div class="list-item vux-1px-b"><div class="list-item-left">身份证号：</div><div class="list-item-right">{{totalInfo && totalInfo.userInfo && totalInfo.userInfo.idCard || ''}}</div></div>
                <div class="list-item vux-1px-b"><div class="list-item-left">银行卡号：</div><div class="list-item-right">{{totalInfo && totalInfo.userInfo && totalInfo.userInfo.bankCardNo || ''}}</div></div>
                <div class="list-item vux-1px-b"><div class="list-item-left">银行卡预留手机号：</div><div class="list-item-right">{{totalInfo && totalInfo.userInfo && totalInfo.userInfo.mobile || ''}}</div></div>
            </div>
            <div class="rule-area" v-show="isMounted && !isPass">
                您提交的认证信息有误，请返回后重新核对验证信息。
            </div>
            <x-button type="warn" @click.native="next">{{isMounted && !isPass ? '返回' : '下一步'}}</x-button>
            <!-- <div style="height: 2000px;background: #ccc;margin-top: 15px;">1515</div> -->
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
    import { tool } from '../mixins/tool'

    export default {
        name: 'bankCardAuth',
        components: {
            XButton
        },
        data() {
            return {
                totalInfo: null,
                isPass: false,
                isMounted: false
            }
        },
        methods: {
            next () {
                if(this.isMounted && !this.isPass) {//失败返回
                    this.$router.goBack();
                } else {//成功跳转下一任务节点
                    tool.resetTotalInfo('bankCardAuth');
                    this.$router.push({
                        name: tool.getNextAuthTypes(),
                    });
                }
            }
        },
        beforeCreate() {
            
        },
        mounted() {console.log('bankCardAuth.vue')
            this.totalInfo = tool.getTotalInfo('totalInfo');

            let params = {
                serviceId: 'S009',
                orderNo: this.totalInfo.userInfo.bankOrderNo,
                uniformAuthNum: this.totalInfo.userInfo.account,
                userId: this.totalInfo.urlParams.userId,
                userType: this.totalInfo.urlParams.userType,
                dotNum: this.totalInfo.userInfo.dotCode,
                areaCode: this.totalInfo.userInfo.areaCode,

                name: this.totalInfo.userInfo.name,
                idCard: this.totalInfo.userInfo.idCard,
                authTaskId: this.totalInfo.authTaskId,
                reserveMobile: this.totalInfo.userInfo.mobile,
                cardNo: this.totalInfo.userInfo.bankCardNo
            }
            this.$nextTick(() => {
                    this.$parent._BScrollRefresh();
                });
            this.$post('bankCard/bankCardSign', params).then(res => {
                this.isMounted = true;
                if(res.data && res.data.busiCode == 0) {
                    this.isPass = true;
                } else {
                    this.isPass = false;
                }
                this.$nextTick(() => {
                    this.$parent._BScrollRefresh();
                });
            }).catch(error => {
                this.isPass = false;
                console.log(error);
            })
        }
    }
</script>

<style lang="less" scoped>
    @import '../style/defined.less';
    @import '../style/iconfont.less';
    @import '../style/mixin.less';
    @import '../style/public.less';
    @import '../style/layout.less';

    .result-panel .result-text {
        margin-left: 30px;
    }
    .list-wrap {
        margin: 80px 0 60px 0;
    }
    .rule-area {
        margin: 40px 0;
        font-size: 24px;
    }
</style>