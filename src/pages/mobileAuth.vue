<template>
    <div class="padding2020 mobileAuth mt20">
        <div class="white-box" v-show="!showCodePanel">
            <div class="title" style="text-align: center;">
                {{totalInfo && totalInfo.userInfo && totalInfo.userInfo.name}}手机号码
            </div>
            <div class="phone-number">
                {{mobileFormat(totalInfo && totalInfo.userInfo && totalInfo.userInfo.mobile)}}
            </div>
            <div class="button-wrap">
                <x-button type="warn" @click.native="sendCode">发送验证码</x-button>
            </div>
        </div>

        <div class="white-box code-verify" v-show="showCodePanel">
            <div class="title title-code">
                您正在使用手机尾号{{mobileSuffix(totalInfo && totalInfo.userInfo && totalInfo.userInfo.mobile)}}进行工行电子签约授权认证
            </div>
            <group>
                <x-input class="weui-vcode" placeholder="请输入" v-model="value" keyboard="number" :max="6" style="border-bottom: 1px solid #cf000d;padding-right: 0;padding-bottom: 5px;border-top: 1px solid #fff;">
                    <span slot="right" class="slot-button vux-1px-l">
                        <span @click="sendCode" :class="isDisabled ? '' : 'color-main'" v-html="buttonText"></span>
                    </span>
                </x-input>
            </group>
            <!-- <div class="code-panel">
                <div class="code-left">
                    <x-input v-model="value" keyboard="number" :max="11" style="border-bottom: 1px solid #cf000d;">1111</x-input>
                </div>
                <div class="code-right">
                    <x-button type="warn" mini>发送验证码</x-button>
                </div>
            </div> -->
            <div class="button-wrap">
                <x-button type="warn" :disabled="!value" @click.native="next">提交</x-button>
            </div>
        </div>
    </div>
</template>

<script>
    import { XButton, XInput, Group, Toast } from 'vux'
    import { setTimeout, setInterval, clearInterval } from 'timers';
    import { tool } from '../mixins/tool'
    
    export default {
        name: 'mobileAuth',
        components: {
            XButton,
            Group,
            XInput,
            Toast
        },
        data() { 
            return {
                totalInfo: null,
                value: '',
                isDisabled: false,
                buttonText: '重发（<span class="color-main">60s</span>）',
                showCodePanel: false
            }
        },
        mounted() {
            this.totalInfo = tool.getTotalInfo('totalInfo');
        },
        methods: {
            mobileSuffix (mobile) {
                return mobile ? mobile.substring(7,11) : '';
            },
            mobileFormat (mobile) {
                return mobile ? mobile.substring(0,4) + '****' + mobile.substring(7,11) : '';
            },
            showLoading (cb) {
                this.$vux.loading.show();

                let params = {
                    serviceId: 'S008',
                    orderNo: this.totalInfo.userInfo.bankOrderNo,
                    uniformAuthNum: this.totalInfo.userInfo.account,
                    userId: this.totalInfo.urlParams.userId,
                    userType: this.totalInfo.urlParams.userType,
                    dotNum: this.totalInfo.userInfo.dotCode,
                    areaCode: this.totalInfo.userInfo.areaCode,
                    authTaskId: this.totalInfo.authTaskId,
                    mobileNo: this.totalInfo.userInfo.mobile,
                    link: '',
                    sceneCode: this.totalInfo.contractInfo.sceneCode
                }

                this.$post('sms/sendMsg', params).then(res => {
                    console.log(res);
                    this.$vux.toast.show({
                        type: 'text',
                        text: '验证码已发送',
                        width: '10em',
                        position: 'bottom'
                    })
                    this.$vux.loading.hide()
                    if (cb && typeof cb == 'function') cb();
                }).catch(error => {
                    console.log(error);
                })
            },
            sendCode () {
                let count = 60;//验证码倒计时60s
                let timer = null;

                if(this.isDisabled) return false;
                this.showLoading(() => {
                    this.showCodePanel = true;
                    this.isDisabled = true;
                    this.buttonText = `重发（<span class="color-main">${count--}s</span>）`;

                    timer = setInterval(() => {
                        if(count == 0) {
                            this.isDisabled = false;
                            this.buttonText = '重新发送';
                            return clearInterval(timer);
                        }
                        this.buttonText = `重发（<span class="color-main">${count--}s</span>）`;
                    }, 1000);
                });
                
            },
            next () {
                // this.$router.push({
                //     name: 'bodyAuth'
                // })
                let params = {
                    serviceId: 'S016',
                    messageCode: this.value,
                    mobileNo: this.totalInfo.userInfo.mobile,
                    authTaskId: this.totalInfo.authTaskId,
                    orderNo: this.totalInfo.userInfo.bankOrderNo,
                }

                this.$post('sms/validateMsg', params).then(res => {
                    console.log(res);
                    tool.resetTotalInfo('mobileAuth');
                    this.$router.push({
                        name: tool.getNextAuthTypes()
                    });
                }).catch(error => {
                    console.log(error);
                })
                
            }
        }
    }
</script>

<style lang="less" scoped>
    @import '../style/defined.less';
    @import '../style/iconfont.less';
    @import '../style/mixin.less';
    @import '../style/public.less';
    @import '../style/layout.less';
    
    .mobileAuth {
        font-size: 34px;
        .title {
            margin-bottom: 30px;
            &.title-code {
                color: #6c6c6c;
                padding: 0 30px;
                font-size: 26px;
            }
        }
        .slot-button {
            display: inline-block;
            padding-left: 20px;
            padding-right: 5px;
            font-size: 30px;
        }
        .group {
            position: relative;
            &:before {
                content: " ";
                position: absolute;
                left: 0;
                top: 0;
                right: 0;
                height: 1PX;
                border-top: 1PX solid #fff;
                color: #fff;
                transform-origin: 0 0;
                transform: scaleY(0.5);
            }
        }
        .phone-number {
            margin-top: 15px;
            text-align: center;
            border-bottom: 2px solid @mainColor;
        }
        .button-wrap {
            margin-top: 100px;
        }
    }
    
</style>