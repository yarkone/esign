<template>
    <div class="contract">
        <div class="title title-contract-count">
            本次签约，需要签署<span class="color-fail">1</span>份协议，已签署<span class="color-fail">0</span>份
        </div>
        <div class="title title-pdf-name">绍兴个人信息查询授权书</div>
        <div class="pdf">
            <canvas v-for="n in totalPage" v-bind:key="n" :id="'the-canvas' + n" class="pdf-content"></canvas>
            <!-- <pdf :src="pdfurls"></pdf> -->
            <iframe :src="pdfurls" frameborder="0"></iframe>
        </div>
        <div class="submit" @click="submit">已阅读并签名</div>
        <paint :post="post"></paint>
    </div>
</template>

<script>
    import { XButton } from 'vux'
    import paint from '../components/paint'
    // import pdf from 'vue-pdf'
    // import pdfurls from '../assets/temp.pdf'
    // import pdfshower from 'vue-pdf-shower'
    // import pdfjs from 'pdfjs'

    import PDFJS from 'pdfjs-dist'
    import axios from 'axios'

    export default {
        name: 'contract',
        
        components: {
            XButton,
            paint
        },
        data() { 
            return {
                post: {
                    isShow: false
                },
                pdfurls: '../../static/pdfjs/web/viewer.html?file=' + encodeURIComponent('http://192.168.0.186:6262/convert/outStreamFromUrl?url=http://hrfax.imwork.net:10082/0180100000/0180400000/2019/01/21/vx0180400000536920539596328960/00780000000000190121161911000QH0/temp.pdf'),
                // pdfurls: '../../static/pdfjs/web/viewer.html?file=http://hrfax.imwork.net:10082//0180100000/0180400000/2019/01/19/vx001002001536198159001456640/00780000000000190119150523000QH0/temp.pdf',
                // pdfurls: 'http://hrfax.imwork.net:10082/0180100000/0180400000/2019/01/09/vx0180400000532667942488248320/00780000000000190109212014000QH0/temp.pdf',
                scale: 1.2,
                totalPage: 0
            }
        },
        mounted() {
            this.post.isShow = false;

            let that = this;
            // this.$fetch('http://192.168.0.186:6262/convert/outStreamFromUrl',
            //             {url: 'http://hrfax.imwork.net:10082//0180100000/0180400000/2019/01/19/vx001002001536198159001456640/00780000000000190119150523000QH0/temp.pdf'},
            //             {'Content-Type': 'text/plain;charset=x-user-defined'}).then(res => {
            //     console.log(res);
            //     PDFJS.getDocument({data: res}).then(function getPdfHelloWorld(pdf) {
            //         that.totalPage = pdf.numPages;//总页数
            //         //我是一次加载了所有页，网上一些是一页页加载的，因为我的pdf页数不多
            //         for(var i = 1;i <= that.totalPage;i++) {
            //             pdf.getPage(i).then(function getPageHelloWorld(page) {
            //                 var scale = 1;//缩放倍数，1表示原始大小
            //                 var viewport = page.getViewport(scale);
            //                 var canvas = document.getElementById('the-canvas' + page.pageNumber);
            //                 var context = canvas.getContext('2d');
            //                 canvas.height = viewport.height;
            //                 canvas.width = viewport.width;
            //                 var renderContext = {
            //                     canvasContext: context,
            //                     viewport: viewport
            //                 };
            //                 page.render(renderContext).promise.then(function(){
            //                     that.loadedPageCount ++;//加载一个+1，最后总数和totalPage一样了，表示pdf加载完了
            //                 });
            //             });
            //         }
            //     }).catch(function(e){
            //         alert('附件暂时无法移动端预览，请在PC端查看')
            //     });
            // }).catch(error => {
            //     console.log(error);
            // })
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
    @import '../style/iconfont.less';
    @import '../style/mixin.less';
    @import '../style/public.less';
    @import '../style/layout.less';

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