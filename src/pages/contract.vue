<template>
    <div class="contract">
        <div class="contract-wrap" style="top: 46px;" ref="contractWrap">
            <div class="title title-contract-count" ref="titleContractCount">
                本次签约，需要签署<span class="color-fail">{{pdfInfo.total}}</span>份协议，已签署<span class="color-fail">{{pdfInfo.signed}}</span>份
            </div>
            <div class="title title-pdf-name" ref="titlePdfName">{{pdfInfo.notSignList.length ? pdfInfo.notSignList[currentIndex === pdfInfo.notSignList.length ? currentIndex - 1 : currentIndex].tempName : ''}}</div>
            <div class="pdf" ref="pdfPanel">
                <iframe :src="iframe_src" frameborder="0"></iframe>
            </div>
        </div>
        
        <div class="submit" @click="submit">{{submitText}}</div>
        <paint :post="post" ref="paint"></paint>
        <paint :post="post2" ref="paint2"></paint>
    </div>
</template>

<script>
    import { XButton, Alert } from 'vux'
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
                base64Files: {},
                markPic: {},
                currentIndex: 0,//当前签署的合同索引
                submitText: '已阅读并签名',//签名页的按钮
                canSign: true,//当前合同是否能签名
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
                this.setIframeHeight();
                this.loadPdf(pdf_url);
                this.getSignInfo(() => {
                    this.initPaint();
                });
            }).catch(error => {
                console.log(error);
            })
        },
        methods: {
            setIframeHeight() {
                let height = $(this.$refs.contractWrap).height() - $(this.$refs.titleContractCount).height() - $(this.$refs.titlePdfName).height();

                $(this.$refs.pdfPanel).height(height);
            },
            
            loadPdf(pdf_url) {
                let file = this.$getApi('convert/outStreamFromUrl?url=' + pdf_url, true);
                console.log(file)
                this.$nextTick(() => {
                    this.iframe_src = '../../static/pdfjs/web/viewer.html?file=' + encodeURIComponent(file);
                });
            },

            submit () {console.log(this.currentIndex)
                //最后一个合同签署完成直接提示“签署完成”
                if (this.currentIndex === this.pdfInfo.notSignList.length) {
                    return this.$vux.alert.show({
                                title: '提示',
                                content: `本次签约，需要签署${this.pdfInfo.notSignList.length}份协议，已签署${this.pdfInfo.notSignList.length}份`,
                                buttonText: '结束本次签约',
                            })
                }

                //点击底部按钮时，除了第一个合同其他合同需加载对应合同
                if(this.currentIndex > 0 && this.currentIndex < this.pdfInfo.notSignList.length && !this.canSign) {
                    let pdf_url = this.pdfInfo.notSignList.length ? this.$getApi(this.pdfInfo.notSignList[this.currentIndex].contractPdfUrl, 'img') : '';
                    this.loadPdf(pdf_url);
                    this.getSignInfo(() => {
                        this.initPaint();
                    });
                    this.submitText = '已阅读并签名';
                }
                if(this.canSign) {
                    if(this.post.isNeedHand == 1) {
                        this.post.isShow = true;
                    } else {
                        this.$refs.paint.signComplete();
                        this.post2.isShow = true;
                    }
                }
                //点击底部按钮时，除了第一个合同其他合同加载完对应合同时，将canSign置为true
                if(this.currentIndex > 0 && this.currentIndex < this.pdfInfo.notSignList.length) {
                    this.canSign = true;
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
            getSignInfo(cb) {
                let params = {
                    serviceId: 'S017',
                    orderNo: this.totalInfo.userInfo.bankOrderNo,
                    contractBatchNo: this.pdfInfo.notSignList.length && this.pdfInfo.notSignList[this.currentIndex].econtractBatchno
                }
                this.$post('service', params).then(res => {
                    console.log(res);
                    this.post = Object.assign(this.post, res.data);
                    if(cb && typeof cb === 'function') cb();
                }).catch(error => {
                    console.log(error);
                })
            },
            initPaint() {
                this.$refs.paint.initBoard();
                this.$refs.paint2.initBoard();
            },
            submitSign(key, compressStream, isNeedHand, isComplete) {
                const that = this;
                this.base64Files[key] = compressStream;

                //如果签名子组件传来的是无需手动摘抄，则说明是签名已完成
                if(!isNeedHand) {
                    console.log(this.base64Files);
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
                            that.markPic[i] = arguments.length ? arguments[temp] && arguments[temp].data && arguments[temp].data.fileName : {};
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
                            that.$refs.paint2.signComplete();
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
                                that.currentIndex++;
                                that.base64Files = {};
                                that.markPic = {};
                                that.submitText = '继续下一份签名';
                                that.loadPdf(that.$getApi(res.data, 'img'));
                                if(that.currentIndex < that.pdfInfo.notSignList.length) {
                                    that.canSign = false;
                                }                                
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
        padding-top: 185px;
        .contract-wrap {
            position: absolute;
            bottom: 100px;
            width: 100%;
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
                    top: 100px;
                    height: 85px;
                    line-height: 85px;
                    text-align: center;
                    color: #fff;
                    background-color: #333;
                }
            }
        }
        
        .pdf {
            overflow: scroll;
        }
        .submit {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            height: 100px;
            line-height: 100px;
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