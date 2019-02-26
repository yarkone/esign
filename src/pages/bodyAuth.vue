<template>
    <div class="bodyAuth">
        <div class="layout">
            <div class="img-panel">
                <img src="../assets/img/head.png" alt="">
                <img src="../assets/img/block.png" alt="">
            </div>
            <div class="img-description">
                <p>体验人脸识别新科技</p>
                <p>创建面部密码，保证<span class="color-main">签约</span>安全</p>
            </div>
        </div>
        <div class="layout">
            <div class="submit-panel">
                <x-button type="warn" @click.native="next">刷脸验证</x-button>
            </div>
        </div>
    </div>
</template>

<script>
    import { XButton } from 'vux'
    import { tool } from '../mixins/tool'

    export default {
        name: 'bodyAuth',
        components: {
            XButton
        },
        data() { 
            return {
                totalInfo: null,
            }
        },
        mounted() {
            // alert('浏览器版本：' + window.navigator.userAgent)
            // var params = {
            //     account: '100000004',
            //     password: '96e79218965eb72c92a549dd5a330112',
            //     LoginAgent: 'WEB'
            // }
            // this.$fetch('/login/doLogin', params).then((response) => {
            //     alert(response)
            // })
            this.totalInfo = tool.getTotalInfo('totalInfo');

            var params = {"userId":"6995","userType":"0","orderNo":"vx001002001530694878552674304","uniformAuthNum":"360209841","dotNum":"0023","areaCode":"1804","serviceId":"S052","processDefKey":"icbchbxydemandcarloanprocessNobank","taskCode":"usertask5@ICBCHBXYDemandCarloanProcessNobank","authCount":"4","name":"张二","idCard":"511529198703010799","frontIdCard":"\/0180100000\/0180400000\/2019\/01\/04\/vx001002001530694878552674304\/20190104-1031-09340-60a8cbe0-7000-315c-c0e4-2360cec35798.jpg","backIdCard":"\/0180100000\/0180400000\/2019\/01\/04\/vx001002001530694878552674304\/20190104-1031-17482-072a6f40-9630-3b82-8bf1-18b965657672.jpg","authTypes":"bankCardAuth,mobileAuth,bodyAuth,faceContrastAuth"}

            this.$post('http://hrfax.imwork.net:16161/service/', params).then(res => {
                
            }).catch(error => {
                console.log(error);
            })
        },
        methods: {
            next () {
                var params = {
                    "post_type": 'post',
                    "post_url": 'https://api.megvii.com/faceid/lite/get_token',
                    "return_url": window.location.protocol + '//' + window.location.host + '/bodyAuthResult',
                    "notify_url": "http://112.74.99.75:8092/valueAdded/facePlusPlusLiteGetTokenNotifyUrl.html",
                    "biz_no": this.totalInfo.authTaskId ? this.totalInfo.authTaskId.toString() : '',
                    "comparison_type": "1",
                    "idcard_mode": "0",
                    "idcard_name": this.totalInfo.userInfo.name,
                    "idcard_number": this.totalInfo.userInfo.idCard,
                }
                
                this.$post('http://112.74.99.75:8092/valueAdded/facePlusPlusLiteGetTokenTransportation.html', params).then(res => {
                    if(res.data && res.data.token) {
                        if(res.data && res.data.biz_id) {
                            this.totalInfo.biz_id = res.data.biz_id;
                            sessionStorage.setItem('totalInfo', JSON.stringify(this.totalInfo));
                        }
                        console.log('https://api.megvii.com/faceid/lite/do?token=' + res.data.token)
                        window.location.href = 'https://api.megvii.com/faceid/lite/do?token=' + res.data.token;
                    } else {
                        this.$vux.alert.show({
                            title: '提示',
                            content: res.data.error_message
                        })
                    }
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
    
    .layout {
        background-color: #fff;
        margin-top: 20px;
        padding: 60px 0;
        .img-panel {
            margin: 0 auto;
            width: 430px;
            height: 430px;
            position: relative;
            img {
                position: absolute;
                width: 100%;
                height: 100%;
                left: 50%;
                transform: translate(-50%, 0);
            }
        }
    }
    .img-description {
        margin-top: 60px;
        p {
            text-align: center;
            font-size: 34px;
            line-height: 60px;
        }
    }
    .submit-panel {
        padding: 0 20px;
        margin-top: 20px;
    }
</style>