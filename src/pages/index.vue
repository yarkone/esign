<template>
    <div class="wrap">
        <!-- <div class="layout layout-img">
            <div class="img-panel">
                <img class="img" src="../assets/img/start_male.png" alt="">
                <img class="img_border" src="../assets/img/block.png" alt="">
            </div>
        </div>
        <div class="layout">
            <div class="submit-panel">
                <x-button type="warn" @click.native="start">开始电子签约</x-button>
            </div>
        </div> -->
    </div>
</template>

<script>
import { XButton, XHeader, querystring } from 'vux'
import { tool } from '../mixins/tool'

export default {
    name: 'container',
    components: {
        XButton,
        XHeader
    },
    data() { 
        return {
            totalInfo: null,
            title: '电子签约',
            transitionName: 'slide-left',
            configMap: {
                bankCardAuth: {
                    path: 'bankCardAuth',
                    title: '银行卡认证'
                },
                mobileAuth: {
                    path: 'mobileAuth',
                    title: '短信认证'
                },
                bodyAuth: {
                    path: 'bodyAuth',
                    title: '活体检测'
                },
                realPhotoAuth: {
                    path: 'realPhotoAuth',
                    title: '人脸对比'
                }
            },
            urlParams: null,
            config: 'bankCardAuth,mobileAuth,bodyAuth,realPhotoAuth'
        }
    },
    methods: {
        backConfirm() {
            let that = this;
            this.$vux.confirm.show({
                title: '提示',
                content: '您当前正在进行电子签约，请确定，是否退出？',
                onCancel () {},
                onConfirm () {
                    //Todo  跳转到sdk对接方页面
                    that.$router.goBack();
                }
            })
        },
        start() {
            let urlParams = null;
            // if(tool.getTotalInfo('totalInfo')) {
            //     urlParams = tool.getTotalInfo('totalInfo').urlParams;
            //     this.totalInfo = tool.getTotalInfo('totalInfo');
            // } else {
                urlParams = querystring.parse(window.location.search);
                this.totalInfo = {
                    urlParams: urlParams
                };
            // }

            let params = {
                serviceId: 'S055',
                orderNo : urlParams.orderNo,
                assurerNo: urlParams.assurerNo,
                userId: urlParams.userId,
                userType: urlParams.userType
            };

            this.$post('service', params).then(res => {
                if(res.data.status == 1) {
                    let that = this;
                    return this.$vux.alert.show({
                        title: '提示',
                        content: '合同已签署完成！',
                        onHide () {
                            that.$router.goBack();
                        },
                    })
                }
                this.totalInfo = Object.assign(this.totalInfo, res.data);
                this.signList(() => {
                    this.checkAuthTypes();
                });
            }).catch(error => {
                console.log(error);
            })
        },
        authTypesHandle (authTypeStr) {//authTypes处理
            if(authTypeStr) {
                this.totalInfo.authTypes = authTypeStr;
                this.totalInfo.authTypesArr = authTypeStr.split(',');
                this.totalInfo.authTypesArr.unshift('');
                this.totalInfo.authTypesArr.push('contract');
                if(this.totalInfo.authTypesArr.indexOf('bodyAuth') != -1) {
                    this.totalInfo.authTypesArr.splice(this.totalInfo.authTypesArr.indexOf('bodyAuth') + 1, 0, 'bodyAuth');
                }
            } else {
                this.totalInfo.authTypesArr = ['', 'contract'];
            }
        },
        signList(cb) {
            let params = {
                serviceId: 'S050',
                orderNo: this.totalInfo.userInfo.bankOrderNo,
                bankCode: this.totalInfo.userInfo.bankCode,

                sceneCode: this.totalInfo.contractInfo.sceneCode,
                processDefKey: this.totalInfo.contractInfo.processDefKey,
                taskCode: this.totalInfo.contractInfo.taskCode,

                dotNum: this.totalInfo.userInfo.dotCode,
                areaCode: this.totalInfo.userInfo.areaCode,
                uniformAuthNum: this.totalInfo.userInfo.account,
                location: '杭州湾信息港',
                signMethod: 1,
                userId: this.totalInfo.urlParams.userId,
                userType: this.totalInfo.urlParams.userType,
                paramJson: this.totalInfo.contractInfo.contracts
                
            }
            this.$post('service', params).then(res => {
                console.log(res);
                if(res.data && res.data.contractTasks && res.data.contractTasks.length && res.data.contractTasks[0].taskList.length) {
                    this.totalInfo.userInfo = Object.assign(this.totalInfo.userInfo, res.data.contractTasks[0].taskList[0]);
                    if(cb && typeof cb === 'function') cb();
                } else {
                    this.$vux.alert.show({
                        title: '提示',
                        content: '暂无需要签署的合同！'
                    })
                }
            }).catch(error => {
                console.log(error);
            })
        },
        checkAuthTypes() {
            this.getSfzPic(() => {
                let params = {
                    serviceId: 'S051',
                    orderNo: this.totalInfo.userInfo.bankOrderNo,
                    userId: this.totalInfo.urlParams.userId,
                    processDefKey: this.totalInfo.contractInfo.processDefKey,
                    taskCode: this.totalInfo.contractInfo.taskCode,
                }
                // 查询可用环节的认证方式
                this.$post('service', params).then(res => {
                    let authTypeStr = res.data || '';
                    let typesArr = authTypeStr ? authTypeStr.split(',') : [];
                    let params = {
                        serviceId: 'S052',
                        orderNo: this.totalInfo.userInfo.bankOrderNo,
                        uniformAuthNum: this.totalInfo.userInfo.account,
                        userId: this.totalInfo.urlParams.userId,
                        userType: this.totalInfo.urlParams.userType,
                        dotNum: this.totalInfo.userInfo.dotCode,
                        areaCode: this.totalInfo.userInfo.areaCode,

                        processDefKey: this.totalInfo.contractInfo.processDefKey,
                        taskCode: this.totalInfo.contractInfo.taskCode,
                        authCount: typesArr.length,
                        frontIdCard: this.totalInfo.userInfo.frontIdCard,
                        backIdCard: this.totalInfo.userInfo.backIdCard,
                        name: this.totalInfo.userInfo.name,
                        idCard: this.totalInfo.userInfo.idCard,
                        authTypes: this.totalInfo.contractInfo.authTypes
                    }
                    this.authTypesHandle(authTypeStr);
                    // 是否认证完接口
                    this.$post('auth/authRecordsNew', params).then(res => {
                        if(res.data && res.data.isComplete == 1) {
                            this.totalInfo.authTaskId = res.data.id;
                            sessionStorage.setItem('totalInfo', JSON.stringify(this.totalInfo));
                            this.$router.push({
                                name: tool.getNextAuthTypes()
                            });
                        } else {
                            sessionStorage.setItem('totalInfo', JSON.stringify(this.totalInfo));
                            this.$router.push({
                                name: 'contract'
                            })
                        }
                    }).catch(error => {
                        console.log(error);
                    })
                }).catch(error => {
                    console.log(error);
                });
            });
        },
        getSfzPic(cb) {
            this.$fetch(this.$getApi('creditMaterials/getSfzPic', 'estage'),
                {
                    orderNo: this.totalInfo.userInfo.bankOrderNo,
                    userId: this.totalInfo.urlParams.userId,
                    assurerNo: this.totalInfo.urlParams.assurerNo
                }).then(res => {
                if(res.data && res.data.creditMaterials && res.data.creditMaterials.length) {
                    let arr_frontIdCard = res.data.creditMaterials.filter((it) => {
                        return it.materialsCode === 'sfzzm';
                    });
                    let arr_backIdCard = res.data.creditMaterials.filter((it) => {
                        return it.materialsCode === 'sfzfm';
                    });
                    if(arr_frontIdCard.length) this.totalInfo.userInfo.frontIdCard = arr_frontIdCard[0].materialsPic;
                    if(arr_backIdCard.length) this.totalInfo.userInfo.backIdCard = arr_backIdCard[0].materialsPic;

                    if(cb && typeof cb === 'function') cb();
                } else {
                    this.$vux.alert.show({
                        title: '提示',
                        content: '无法获取身份证正反面！'
                    })
                }                    
            }).catch(error => {
                console.log(error);
            })
        }
    },
    mounted () {
        
        // this.$router.push({
        //     name: 'bankCardAuth'
        // })
        // this.title = '银行卡认证'

        
        
        // this.$router.push({
        //     name: 'contract'
        // })
        // this.title = '客户签名'

        this.start();
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
        &.layout-img {
            padding: 120px 0;
        }
        .img-panel {
            margin: 0 auto;
            width: 200px;
            height: 200px;
            position: relative;
            img {
                width: 100%;
                height: 100%;
                position: absolute;
                left: 50%;
                margin-left: -100px;
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