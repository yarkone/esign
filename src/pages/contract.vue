<template>
    <div class="contract">
        <div class="title title-contract-count">
            本次签约，需要签署<span class="color-fail">1</span>份协议，已签署<span class="color-fail">0</span>份
        </div>
        <div class="title title-pdf-name">绍兴个人信息查询授权书</div>
        <div class="pdf">
            <!-- <pdf :src="pdfurls"></pdf> -->
            <!-- <iframe :src="pdfurls" frameborder="0"></iframe> -->
        </div>
        <div class="submit" @click="submit">已阅读并签名</div>
        <paint :post="post"></paint>
    </div>
</template>

<script>
    import { XButton } from 'vux'
    import paint from '../components/paint'
    // import pdf from 'vue-pdf'
    // import pdfshower from 'vue-pdf-shower'
    // import pdfjs from 'pdfjs'

    export default {
        name: 'contract',
        
        components: {
            XButton,
            paint
            // pdf
        },
        data() { 
            return {
                post: {
                    isShow: true
                },
                pdfurls: 'http://hrfax.imwork.net:10082/0180100000/0180400000/2019/01/09/vx0180400000532667942488248320/00780000000000190109212014000QH0/temp.pdf',
                scale: 1.2
            }
        },
        mounted() {
            this.post.isShow = false;
        },
        methods: {
            submit () {
                this.post.isShow = true;
            },
            onErr(err) {
                console.log('Não foi possível exibir o pdf desejado');
                console.log('Erro：', err);
            }
        }
    }
</script>

<style lang="less" scoped>
    @import '../style/defined.less';

    .contract {
        height: 100%;
        .title {
            height: 100px;
            line-height: 100px;
            font-size: 28px;
            &.title-contract-count {
                padding-left: 20px;
                color: #7c7c7c;
                background-color: #fff;
                .color-fail {
                    font-size: 40px;
                }
            }
            &.title-pdf-name {
                height: 85px;
                line-height: 85px;
                text-align: center;
                color: #fff;
                background-color: #333;
            }
        }
        .submit {
            position: fixed;
            left: 0;
            right: 0;
            bottom: 0;
            height: 120px;
            line-height: 120px;
            font-size: 30px;
            background-color: @mainColor;
            color: #fff;
            text-align: center;
        }
        iframe {
            width: 100%;
            height: 1000px;
        }
    }
</style>