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
        },
        methods: {
            next () {
                var params = {
                    "post_type": 'post',
                    "post_url": 'https://api.megvii.com/faceid/lite/get_token',
                    "return_url": window.location.protocol + '//' + window.location.host + '/bodyAuthResult',
                    "notify_url": this.$getApi('valueAdded/facePlusPlusLiteGetTokenNotifyUrl.html', 'wind'),
                    "biz_no": this.totalInfo.authTaskId ? this.totalInfo.authTaskId.toString() : '',
                    "comparison_type": "1",
                    "idcard_mode": "0",
                    "idcard_name": this.totalInfo.userInfo.name,
                    "idcard_number": this.totalInfo.userInfo.idCard,
                    "scene_id": 'esign',//在控制台配置的对应使用场景的scene_id，用以自定义验证流程中的视觉元素。
                    "liveness_preferences": 'video_strict',//表示针对上传的视频进行相对严格的活体检测，此设置会提高安全性，但在一定程度上影响通过率【活体认证读4个数字才对】
                }
                
                this.$post(this.$getApi('valueAdded/facePlusPlusLiteGetTokenTransportation.html', 'wind'), params).then(res => {
                    if(res.data && res.data.token) {
                        if(res.data && res.data.biz_id) {
                            this.totalInfo.biz_id = res.data.biz_id;
                            localStorage.setItem('totalInfo', JSON.stringify(this.totalInfo));
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