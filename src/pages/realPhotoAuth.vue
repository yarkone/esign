<template>
    <div class="realPhotoAuth">
        <div class="layout">
            <div class="img-panel">
                <img src="../assets/img/head.png" alt="">
                <img src="../assets/img/block.png" alt="">
            </div>
            <!-- <div class="img-description">
                <p>体验人脸识别新科技</p>
                <p>创建面部密码，保证<span class="color-main">签约</span>安全</p>
            </div> -->
        </div>
        <div class="layout">
            <div class="submit-panel">
                <x-button type="warn" @click.native="next">点击拍摄</x-button>
            </div>
        </div>
    </div>
</template>

<script>
    import { XButton } from 'vux'

    export default {
        name: 'realPhotoAuth',
        components: {
            XButton
        },
        data() { 
            return {

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
        },
        methods: {
            next () {
                var params = {
                    // "api_key": "kE_xDxr21UUW2qOCqtJe4WLL_-LUB3SP",
                    // "api_secret": "ST4i7iAfzpuVjvsd0tp_TkMT7_qpvtDE",
                    "return_url": "http://hrfax.imwork.net:18887/bank/login.html",
                    "notify_url": "http://hrfax.imwork.net:18887/bank/login.html",
                    "biz_no": "863258996",
                    "comparison_type": "1",
                    "idcard_mode": "0",
                    "idcard_name": encodeURIComponent('金飞'),
                    "idcard_number": "331082198207035883"
                }
                this.$api.faceIDGetToken(params).then(res => {
                    alert(res)
                    // console.log(res)
                }).catch(error => {
                    console.log(error);
                    alert(error)
                })
            }
        }
    }
</script>

<style lang="less" scoped>
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
    }
    .img-description {
        margin-top: 130px;
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