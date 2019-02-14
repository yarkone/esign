<template>
    <div class="contract">
        <div class="title title-contract-count" style="">
            本次签约，需要签署<span class="color-fail">{{pdfInfo.total}}</span>份协议，已签署<span class="color-fail">{{pdfInfo.signed}}</span>份
        </div>
        <div class="title title-pdf-name">绍兴个人信息查询授权书</div>
        <div class="pdf" ref="pdfPanel">
            <iframe :src="iframe_src" frameborder="0"></iframe>
        </div>
        <div class="submit" @click="submit">已阅读并签名</div>
        <paint :post="post" ref="paint"></paint>
        <paint :post="post2" ref="paint2"></paint>
    </div>
</template>

<script>
    import { XButton } from 'vux'
    import paint from '../components/paint'
    import { tool } from '../mixins/tool'
    import axios from 'axios'
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
                pdfInfo: {
                    total: 0,
                    signed: 0,
                    notSignList: [],
                },                
                post: {
                    isShow: false,
                },
                post2: {
                    isShow: false,
                    isNeedHand: 0,
                    isClientSign: true,
                    markList: ['clientSignImg'],
                },
                iframe_src: 'about:blank',
                pdfurls: '../../static/pdfjs/web/viewer.html?file=' + encodeURIComponent('http://192.168.0.186:6262/convert/outStreamFromUrl?url=http://hrfax.imwork.net:10082/0180100000/0180400000/2019/01/21/vx0180400000536920539596328960/00780000000000190121161911000QH0/temp.pdf'),
                // pdfurls: '../../static/pdfjs/web/viewer.html?file=http://hrfax.imwork.net:10082//0180100000/0180400000/2019/01/19/vx001002001536198159001456640/00780000000000190119150523000QH0/temp.pdf',
                // pdfurls: 'http://hrfax.imwork.net:10082/0180100000/0180400000/2019/01/09/vx0180400000532667942488248320/00780000000000190109212014000QH0/temp.pdf',
                scale: 1.2,
                totalPage: 0,
                base64Files: {},
                markPic: {},
                currentIndex: 0,//当前签署的合同索引
            }
        },
        mounted() {
            this.post.isShow = false;
            this.post2.isShow = false;
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
                this.pdfInfo = Object.assign(this.pdfInfo, res.data);
                let pdf_url = this.pdfInfo.notSignList.length ? this.$getApi(this.pdfInfo.notSignList[this.currentIndex].contractPdfUrl, 'img') : '';
                this.loadPdf(pdf_url);
            }).catch(error => {
                console.log(error);
            })
        },
        methods: {
            loadPdf(pdf_url) {
                let file = this.$getApi('convert/outStreamFromUrl?url=' + pdf_url, true);
                console.log(file)
                this.$nextTick(() => {
                    this.iframe_src = '../../static/pdfjs/web/viewer.html?file=' + encodeURIComponent(file);
                    this.getSignInfo();
                });
            },
            submit () {
                if(this.post.isNeedHand === 1) {
                    this.post.isShow = true;
                } else {
                    this.post2.isShow = true;
                }
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
                    contractBatchNo: this.pdfInfo.notSignList.length && this.pdfInfo.notSignList[this.currentIndex].econtractBatchno
                }
                this.$post('service', params).then(res => {
                    console.log(res);
                    this.post = Object.assign(this.post, res.data);
                    this.$refs.paint.initBoard();
                    this.$refs.paint2.initBoard();
                }).catch(error => {
                    console.log(error);
                })
            },
            submitSign(key, compressStream, isNeedHand, isComplete) {
                const that = this;
                this.base64Files[key] = compressStream;

                //如果签名子组件传来的是无需手动摘抄，则说明是签名已完成
                if(!isNeedHand) {
                    console.log(this.base64Files);
                    this.$refs.paint2.signComplete();
                    let arr = [];
                    for (let i in this.base64Files) {
                        let params = {
                            assurerNo: this.totalInfo.urlParams.assurerNo,
                            base64File: this.base64Files[i],
                            orderNo: this.totalInfo.userInfo.orderNo
                        }
                        arr.push(this.$post('upload/fileUploadBase64', params));
                        // this.$post('upload/fileUploadBase64', params).then(res => {
                        //     console.log(i);
                        //     this.markPic[i] = res.data && res.data.fileName;
                        // }).catch(error => {
                        //     console.log(error);
                        // })
                    }
                    axios.all(arr)
                    .then(axios.spread(function() {
                        // 两个请求现在都执行完成
                        console.log(arguments);
                        let temp = 0;
                        for (let i in that.base64Files) {
                            that.markPic[i] = arguments[temp].data && arguments[temp].data.fileName;
                            temp++;
                        }
                        console.log(that.markPic);
                        let data = {
                            serviceId: 'S018',
                            orderNo: that.totalInfo.userInfo.bankOrderNo,
                            uniformAuthNum: that.totalInfo.userInfo.account,
                            userId: that.totalInfo.urlParams.userId,
                            userType: that.totalInfo.urlParams.userType,
                            dotNum: that.totalInfo.userInfo.dotCode,
                            areaCode: that.totalInfo.userInfo.areaCode,

                            processDefKey: that.totalInfo.contractInfo.processDefKey,
                            taskCode: that.totalInfo.contractInfo.taskCode,
                            clientName: that.totalInfo.userInfo.name,
                            sceneCode: that.totalInfo.contractInfo.sceneCode,
                            idCard: that.totalInfo.userInfo.idCard,
                            reserveMobile: that.totalInfo.userInfo.mobile,
                            location: '杭州湾信息港',
                            reason: '',
                            markPic: that.markPic,
                            econtractBatchNo: that.pdfInfo.notSignList.length ? that.pdfInfo.notSignList[that.currentIndex].econtractBatchno : '',
                            jsonParam: that.totalInfo.contractInfo.contracts,
                            assurerNo: that.totalInfo.urlParams.assurerNo,
                        }
                        console.log(data);
                        that.$post('service', data).then(res => {
                            console.log(res);
                            that.$post('service', {
                                serviceId: 'U004',
                                orderNo: that.totalInfo.userInfo.bankOrderNo,
                                processDefKey: that.totalInfo.contractInfo.processDefKey,
                                taskCode: that.totalInfo.contractInfo.taskCode,
                                userType: that.totalInfo.urlParams.userType,
                                econtractBatchNo: that.pdfInfo.notSignList.length ? that.pdfInfo.notSignList[that.currentIndex].econtractBatchno : '',
                                assurerNo: that.totalInfo.urlParams.assurerNo,
                            }).then(res => {
                                console.log(res);
                                that.pdfInfo.signed++;
                                that.loadPdf(that.$getApi(res.data, 'img'));
                            }).catch(error => {
                                console.log(error);
                            })
                        }).catch(error => {
                            console.log(error);
                        })
                    }));
                } else {
                    if(isComplete) {
                        this.$refs.paint.signComplete();
                        this.post2.isShow = true;
                    }
                    // this.$refs.paint2.initBoard();
                }
                
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