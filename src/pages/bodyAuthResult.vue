<template>
    <div class="bodyAuth">
        <div class="layout">
            <div class="img-panel">
                <img src="../assets/img/head.png" alt="">
                <img src="../assets/img/block.png" alt="">
            </div>
        </div>
        <div class="layout">
            <div class="fail-panel">
                <div class="fail-item">
                    <img class="img" src="../assets/img/img-1@2x.png" alt="">
                    <p>不要靠太近</p>
                </div>
                <div class="fail-item">
                    <img class="img" src="../assets/img/img-2@2x.png" alt="">
                    <p>不要靠太远</p>
                </div>
                <div class="fail-item">
                    <img class="img" src="../assets/img/img-3@2x.png" alt="">
                    <p>光线主暗</p>
                </div>
            </div>
            <div class="submit-panel">
                <x-button type="warn" @click.native="next">重新验证</x-button>
            </div>
        </div>
    </div>
</template>

<script>
    import { XButton } from 'vux'

    export default {
        name: 'bodyAuth',
        components: {
            XButton
        },
        data() { 
            return {

            }
        },
        mounted() {
        },
        methods: {
            next () {
                var params = {
                    // "return_url": "http://192.168.0.21:8028/bodyAuthResult",
                    "return_url": "http://carloan.hrfax.cn",
                    "notify_url": "http://112.74.99.75:8092/valueAdded/facePlusPlusLiteGetTokenNotifyUrl.html",
                    "biz_no": "863258996",
                    "comparison_type": "1",
                    "idcard_mode": "0",
                    "idcard_name": '金飞',
                    "idcard_number": "331082198207035883"
                }
                
                this.$post('http://112.74.99.75:8092/valueAdded/facePlusPlusLiteGetTokenTransportation.html', params).then(res => {
                    if(res.data && res.data.token) {
                        window.location.href = 'https://api.megvii.com/faceid/lite/do?token=' + res.data.token;
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
                width: 100%;
                height: 100%;
                position: absolute;
                left: 50%;
                margin-left: -215px;
            }
        }
        .fail-panel {
            display: flex;
            width: 100%;
            padding: 0 30px;
            .fail-item {
                flex: 1;
                text-align: center;
                .img {
                    width: 125px;
                }
            }
        }
    }
    .img-description {
        margin-top: 80px;
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