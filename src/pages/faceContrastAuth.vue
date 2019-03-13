<template>
    <div class="faceContrastAuth">
        <div class="layout">
            <div class="img-panel">
                <img class="img1" :src="faceImg" ref="faceImg" alt="">
                <img class="img2" src="../assets/img/block.png" alt="">
            </div>
        </div>
        <div class="layout">
            <div class="submit-panel">
                <input name="video" type="file" class="input-image" ref="inputImage" accept="image/*" capture="camera" @change="inputChange">
                <x-button class="x-button" type="warn" :disabled="isPass">点击拍摄</x-button>
            </div>
        </div>
    </div>
</template>

<script>
    import { XButton } from 'vux'
    import { tool } from '../mixins/tool'
    import headImg from '../assets/img/head.png'

    export default {
        name: 'faceContrastAuth',
        components: {
            XButton
        },
        data() { 
            return {
                faceImg: headImg,
                isPass: false,
            }
        },
        mounted() {
            this.totalInfo = tool.getTotalInfo('totalInfo');
            this.$nextTick(() => {
                this.$parent._BScrollRefresh();
            });
        },
        methods: {
            inputChange() {
                let reader = new FileReader(),
                    file = this.$refs.inputImage.files[0];
                //先上传文件
                const formData = new FormData();
                formData.append('assurerNo', this.totalInfo.urlParams.assurerNo);
                formData.append('orderNo', this.totalInfo.userInfo.orderNo);
                formData.append('h5mark', true);
                formData.append('file', file);

                this.$post('upload/fileUpload', formData, {'post-type' : 'form-data'}).then((res) => {
                    this.isPass = true;
                    this.faceImg = this.$getApi(res.data && res.data.fileName, 'img');
                    this.compare(res.data ? res.data.fileName : '');
                   
                    // let that = this;
                    // reader.readAsDataURL(file);
                    // reader.onload = function(e) {
                    //     console.log(file.size)
                    //     //调用图片压缩方法：compress();this.$getApi(res.data && res.data.fileName, 'img')
                    //     that.compress(this.result, file.size/1024/1024, (dataUrl) => {
                    //         console.log(dataUrl)
                    //     });
                    // };
                    // console.log(file.size);
                    // let fileSize = Math.round(file.size/1024) ; //以kb为单位
                    // alert(fileSize)
                }).catch((error) => {
                    this.isPass = false;
                });
            },
            //调用人像比对接口
            compare(filePath) {
                let params = {
                    serviceId: 'S010',
                    orderNo: this.totalInfo.userInfo.bankOrderNo,
                    uniformAuthNum: this.totalInfo.userInfo.account,
                    userId: this.totalInfo.urlParams.userId,
                    userType: this.totalInfo.urlParams.userType,
                    dotNum: this.totalInfo.userInfo.dotCode,
                    areaCode: this.totalInfo.userInfo.areaCode,
                    authTaskId: this.totalInfo.authTaskId,
                    filePath: filePath,
                }

                this.$post('compare/personImageCompareSign', params).then(res => {
                    if(res.data && res.data.busiCode == 0) {
                        let that = this;
                        this.$vux.toast.show({
                            text: '对比成功',
                            onHide() {
                                that.isPass = true;
                                tool.resetTotalInfo('faceContrastAuth');
                                that.$router.push({
                                    name: tool.getNextAuthTypes(),
                                });
                            },
                        })
                    } else {
                        this.isPass = false;
                        this.$vux.alert.show({
                            title: '提示',
                            content: res.data.busiMsg || '人脸比对失败'
                        })
                    }
                }).catch(error => {
                    this.isPass = false;
                })
            },
            compress(res, fileSize, cb) { //res代表上传的图片，fileSize大小图片的大小
                let img = this.$refs.faceImg;

                img.setAttribute('crossOrigin', 'anonymous');

                img.onload = () => {
                    let cvs = document.createElement( 'canvas'),
                        ctx = cvs.getContext( '2d');
                    
                    cvs.width = img.width;
                    cvs.height = img.height;

                    ctx.clearRect(0, 0, cvs.width, cvs.height);
                    ctx.drawImage(img, 0, 0, img.width, img.height);

                    console.log(cvs.toDataURL( 'image/png', 1));
                    console.log(img.fileSize)
                }

                
            },
            compress1(res, fileSize, cb) { //res代表上传的图片，fileSize大小图片的大小
                let img = new Image(),
                    maxW = 640; //设置最大宽度
                img.setAttribute('crossOrigin', 'anonymous');
                img.src = res;
                img.onload = () => {
                    let cvs = document.createElement( 'canvas'),
                        ctx = cvs.getContext( '2d');

                    // if(img.width > maxW) {
                    //     img.height *= maxW / img.width;
                    //     img.width = maxW;
                    // }

                    cvs.width = img.width;
                    cvs.height = img.height;

                    ctx.clearRect(0, 0, cvs.width, cvs.height);
                    ctx.drawImage(img, 0, 0, img.width, img.height);

                    console.log(cvs.toDataURL( 'image/png', 1));
                    // console.log(cvs)
                    console.log(img.fileSize)

                    let compressRate = this.getCompressRate(80/1024, fileSize);
                    console.log(compressRate);

                    let dataUrl = cvs.toDataURL( 'image/png', compressRate);

                    cb ? cb(dataUrl) : null;//调用回调函数
                }

                
            },
            getCompressRate(allowMaxSize, fileSize){ //计算压缩比率，size单位为MB
                console.log(allowMaxSize, fileSize)
                let compressRate = 1;

                if(fileSize/allowMaxSize > 4){
                    compressRate = 0.5;
                } else if(fileSize/allowMaxSize >3){
                    compressRate = 0.6;
                } else if(fileSize/allowMaxSize >2){
                    compressRate = 0.7;
                } else if(fileSize > allowMaxSize){
                    compressRate = 0.8;
                } else{
                    compressRate = 0.9;
                }

                return compressRate;
            },
            //直接读成blob文件对象
            getImageBlob (url, cb) {debugger
                let xhr = new XMLHttpRequest();
                xhr.open('get', url, true);
                xhr.responseType = 'blob';
                xhr.onload = function () {
                    if (this.status == 200) {
                        console.log(this.response)
                        return URL.createObjectURL(this.response);

                        // imgResponse = this.response;
                        // //这里面可以直接通过URL的api将其转换，然后赋值给img.src
                        // //也可以使用下面的preView方法将其转换成base64之后再赋值
                        // img.src = URL.createObjectURL(this.response);
                    }
                };
                xhr.send();
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
            .img1 {
                position: absolute;
                height: 100%;
                left: 50%;
                transform: translate(-50%, 0);
            }
            .img2 {
                position: absolute;
                width: 100%;
                height: 100%;
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
        position: relative;
        padding: 0 20px;
        margin-top: 20px;
        .input-image {
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            right: 0;
            opacity: 0;
            width: 100%;
            height: 100%;
        }
        .x-button {
            cursor:pointer;
            pointer-events:none;
        }
    }
</style>