<template>
    <div class="contract">
        <div class="title title-contract-count" style="">
            本次签约，需要签署<span class="color-fail">{{total}}</span>份协议，已签署<span class="color-fail">{{signed}}</span>份
        </div>
        <div class="title title-pdf-name">绍兴个人信息查询授权书</div>
        <div class="pdf" id="pdfPanel">
            <iframe :src="iframe_src" frameborder="0"></iframe>
        </div>
        <div class="submit" @click="submit">已阅读并签名</div>
        <paint :post="post"></paint>
    </div>
</template>

<script>
    import { XButton } from 'vux'
    import paint from '../components/paint'
    import { tool } from '../mixins/tool'
    // import pdf from 'vue-pdf'
    // import pdfurls from '../assets/temp.pdf'
    // import pdfshower from 'vue-pdf-shower'
    // import pdfjs from 'pdfjs'

    import PDFJS from 'pdfjs-dist'

    export default {
        name: 'contract',
        
        components: {
            XButton,
            paint
        },
        data() { 
            return {
                totalInfo: null,
                total: 0,
                signed: 0,
                notSignList: [],
                post: {
                    isShow: false
                },
                iframe_src: 'about:blank',
                pdfurls: '../../static/pdfjs/web/viewer.html?file=' + encodeURIComponent('http://192.168.0.186:6262/convert/outStreamFromUrl?url=http://hrfax.imwork.net:10082/0180100000/0180400000/2019/01/21/vx0180400000536920539596328960/00780000000000190121161911000QH0/temp.pdf'),
                // pdfurls: '../../static/pdfjs/web/viewer.html?file=http://hrfax.imwork.net:10082//0180100000/0180400000/2019/01/19/vx001002001536198159001456640/00780000000000190119150523000QH0/temp.pdf',
                // pdfurls: 'http://hrfax.imwork.net:10082/0180100000/0180400000/2019/01/09/vx0180400000532667942488248320/00780000000000190109212014000QH0/temp.pdf',
                scale: 1.2,
                totalPage: 0
            }
        },
        mounted() {
            this.post.isShow = false;
            this.totalInfo = tool.getTotalInfo('totalInfo');

            let params = {
                serviceId: 'U003',
                orderNo: this.totalInfo.userInfo.bankOrderNo,
                processDefKey: this.totalInfo.contractInfo.processDefKey,
                taskCode: this.totalInfo.contractInfo.taskCode,
                operator: this.totalInfo.urlParams.userId,
                userType: this.totalInfo.urlParams.userType
            }

            this.$post('signUser/readPdf', params).then(res => {
                console.log(res);
                this.total = res.data && res.data.total;
                this.signed = res.data && res.data.signed;
                this.notSignList = res.data && res.data.notSignList;
                
                this.loadPdf();
            }).catch(error => {
                console.log(error);
            })
        },
        methods: {
            loadPdf() {
                let $pdf = $('#pdfPanel'),
                    pdf_url = this.notSignList && this.notSignList.length ? this.$getApi(this.notSignList[0].contractPdfUrl, 'img') : '',
                    file = this.$getApi('convert/outStreamFromUrl?url=' + pdf_url, true);
                this.iframe_src = '../../static/pdfjs/web/viewer.html?file=' + encodeURIComponent(file);
                //     console.log(iframe_src);
                // $pdf.html('<iframe src="'+ iframe_src +'" frameborder="0"></iframe>')

                this.getSignInfo()
            },
            submit () {
                this.post.isShow = true;
            },
            doUploadSignImg() {
                let params = {
                    orderNo: this.totalInfo.userInfo.bankOrderNo,
                    assurerNo: this.totalInfo.urlParams.assurerNo
                }
                this.$post('service', params).then(res => {
                    console.log(res);
                    
                }).catch(error => {
                    console.log(error);
                })
            },
            getSignInfo() {
                let params = {
                    serviceId: 'S017',
                    orderNo: this.totalInfo.userInfo.bankOrderNo,
                    contractBatchNo: this.notSignList.length && this.notSignList[0].econtractBatchno
                }
                this.$post('service', params).then(res => {
                    console.log(res);
                    
                }).catch(error => {
                    console.log(error);
                })
            },
            submitSign() {
                let params = {
                    serviceId: 'S017',
                    orderNo: this.totalInfo.userInfo.bankOrderNo,
                    contractBatchNo: this.notSignList.length && this.notSignList[0].econtractBatchno
                }
                this.$post('service', params).then(res => {
                    console.log(res);
                    
                }).catch(error => {
                    console.log(error);
                })
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
            // position: fixed;
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