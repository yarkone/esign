<template>
    <div class="bodyAuth">
        <div class="layout">
            <div class="img-panel">
                <img class="img1" ref="pic" src="../assets/img/head.png" alt="">
                <img class="img2"  src="../assets/img/block.png" alt="">
            </div>
        </div>
        <div class="layout" v-show="nextText === '重新认证' ? true : false">
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
            <!-- <div class="submit-panel">
                <x-button type="warn"  @click.native="next">{{nextText}}</x-button>
            </div> -->
        </div>
    </div>
</template>

<script>
    import { XButton } from 'vux'
    import { tool } from '../mixins/tool'

    export default {
        name: 'bodyAuthResult',
        components: {
            XButton
        },
        data() { 
            return {
                totalInfo: null,
                nextText: '下一步',
            }
        },
        mounted() {
            this.totalInfo = tool.getTotalInfo('totalInfo');
            this.getBodyAuthResult(() => {
                this.next();
            });
        },
        methods: {
            getBodyAuthResult (cb) {
                var params = {
                    "post_type": 'get',
                    "post_url": 'https://api.megvii.com/faceid/lite/get_result',
                    "biz_id": this.totalInfo.biz_id || '',
                    "return_image": 4
                }
                
                this.$post('http://112.74.99.75:8092/valueAdded/facePlusPlusLiteGetTokenTransportation.html', params).then(res => {
                    if(res.data) {
                        if(res.data.status === 'OK') {
                            if(res.data.liveness_result && res.data.liveness_result.result === 'PASS') {
                                if(res.data.images && res.data.images.image_best) {
                                    this.$refs.pic.src = res.data.images.image_best;
                                    if(cb && typeof cb === 'function') {
                                        cb()
                                    }
                                }
                            } else {
                                this.bodyAuthError(res.data.error_message)
                            }
                        } else {
                            /**
                             *   NOT_STARTED：get_token 之后，并没有调用过 do 方法，还没有开始验证；
                             *   PROCESSING：正在进行 FaceID Lite 验证；
                             *   OK：完成了 FaceID Lite 验证（OK并不表示通过了实名验证，是流程正常结束）；
                             *   FAILED：验证流程未完成或出现异常；
                             *   CANCELLED：用户主动取消了验证流程；
                             *   TIMEOUT：流程超时。
                             */
                            let statusArr = {
                                NOT_STARTED: '【活体检测】还未开始验证',
                                PROCESSING: '【活体检测】正在进行 FaceID Lite 验证',
                                FAILED: '【活体检测】验证流程未完成或出现异常',
                                CANCELLED: '【活体检测】用户主动取消了验证流程',
                                TIMEOUT: '【活体检测】验证流程超时',
                            }
                            this.bodyAuthError(statusArr[res.data.status] || '【活体检测】验证失败');
                        }
                    }
                }).catch(error => {
                    this.bodyAuthError('活体检测失败')
                    console.log(error);
                })
            },
            bodyAuthError(msg) {
                this.nextText = '重新认证';
                this.$vux.alert.show({
                    title: '提示',
                    content: msg
                })
            },
            next () {
                if(this.nextText === '重新认证') {
                    this.$vux.toast.show({
                        text: '检测失败',
                        type: 'cancel',
                        onHide() {
                            this.$router.push({
                                name: 'bodyAuth'
                            })
                            
                        },
                    })
                } else {
                    let that = this;
                    this.$vux.toast.show({
                        text: '检测成功',
                        onHide() {
                            that.saveResult();
                        },
                    })
                }
            },
            saveResult() {
                let params = {
                    serviceId: 'S014',
                    orderNo: this.totalInfo.userInfo.bankOrderNo,
                    uniformAuthNum: this.totalInfo.userInfo.account,
                    userId: this.totalInfo.urlParams.userId,
                    userType: this.totalInfo.urlParams.userType,
                    dotNum: this.totalInfo.userInfo.dotCode,
                    areaCode: this.totalInfo.userInfo.areaCode,

                    authTaskId: this.totalInfo.authTaskId,
                    result: this.nextText === '重新认证' ? 0 : 1,
                    msg: this.nextText === '重新认证' ? '认证失败' : '认证成功',
                }
                this.$post('service', params).then(res => {
                    tool.resetTotalInfo();
                    this.$router.push({
                        name: tool.getNextAuthTypes(),
                    });
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