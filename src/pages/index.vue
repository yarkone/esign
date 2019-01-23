<template>
    <div class="wrap">
        <x-header
            :left-options="{backText: '', preventGoBack: true}"
            @on-click-back="goBack"
            class="vux-1px-b"
            style="background-color: #fff;width:100%;position:fixed;left:0;top:0;z-index:100;"
        >{{title}}</x-header>
        <div class="container" style="padding-top: 46px;">
            <transition :name="transitionName">
                <router-view class="child-view"></router-view>
            </transition>
        </div>
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
    beforeRouteUpdate (to, from, next) {
      let isBack = this.$router.isBack
      if (isBack) {
        this.transitionName = 'slide-right'
      } else {
        this.transitionName = 'slide-left'
      }
      this.$router.isBack = false
      next()
    },
    methods: {
        haha() {
            
        },
        goBack() {
            let that = this;
            this.$vux.confirm.show({
                title: '提示',
                content: '您当前正在进行电子签约，请确定，是否退出？',
                onCancel () {},
                onConfirm () {
                    that.$router.goBack();
                }
            })
            
        },
        setSession (data) {
            this.totalInfo = Object.assign(this.totalInfo, data);

            // this.contractInfo = data && data.contractInfo;
            // this.downServer = JSON.parse(data && data.downServer);
            // this.userInfo = JSON.parse(data && data.userInfo);

            // sessionStorage.setItem('contractInfo', JSON.stringify(data.contractInfo));
            // sessionStorage.setItem('downServer', data.downServer);
            // sessionStorage.setItem('userInfo', data.userInfo);
        },
        goAuthTypes(type) {
            if(!type || !this.configMap[type]) {
                return;
            }
            this.$router.push({
                name: this.configMap[type].path,
                // query: this.totalInfo.urlParams
            })
            this.title = this.configMap[type].title
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
            let typesArr = this.totalInfo.contractInfo.authTypes.split(',');
            if(typesArr.length) { 
                // 获取身份证正反面
                this.$fetch('http://hrfax.imwork.net:18887/api/creditMaterials/getSfzPic', {orderNo: this.totalInfo.userInfo.bankOrderNo, userId: this.totalInfo.urlParams.userId, assurerNo: this.totalInfo.urlParams.assurerNo}).then(res => {
                    if(res.data && res.data.creditMaterials && res.data.creditMaterials.length) {
                        let arr_frontIdCard = res.data.creditMaterials.filter((it) => {
                            return it.materialsCode === 'sfzzm';
                        });
                        let arr_backIdCard = res.data.creditMaterials.filter((it) => {
                            return it.materialsCode === 'sfzfm';
                        });
                        if(arr_frontIdCard.length) this.totalInfo.userInfo.frontIdCard = arr_frontIdCard[0].materialsPic;
                        if(arr_backIdCard.length) this.totalInfo.userInfo.backIdCard = arr_backIdCard[0].materialsPic;

                        // let params = {
                        //     serviceId: 'S051',
                        //     orderNo: this.totalInfo.userInfo.bankOrderNo,
                        //     signTaskId: this.totalInfo.userInfo.signTaskId,

                        //     processDefKey: this.totalInfo.contractInfo.processDefKey,
                        //     taskCode: this.totalInfo.contractInfo.taskCode,
                        //     userId: this.totalInfo.urlParams.userId,
                        //     econtractBatchno: this.totalInfo.urlParams.econtractBatchno
                        // }

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
                        // 是否认证完接口
                        this.$post('auth/authRecordsNew', params).then(res => {
                            if(res.data && res.data.isComplete == 1) {
                                this.totalInfo.authTaskId = res.data.id;
                                sessionStorage.setItem('totalInfo', JSON.stringify(this.totalInfo));
                                this.goAuthTypes(typesArr[0]);
                            } else {
                                // this.$router.push({
                                //     name: 'contract'
                                // })
                                // this.title = '客户签名'
                            }
                            console.log(res);
                        }).catch(error => {
                            console.log(error);
                        })
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
        }
    },
    watch: {
        $route(to, from){
            this.title = to.meta.title;
        }
    },
    mounted () {
        
        // this.$router.push({
        //     name: 'bankCardAuth'
        // })
        // this.title = '银行卡认证'

        let urlParams = null;
        if(tool.getTotalInfo('totalInfo')) {
            urlParams = tool.getTotalInfo('totalInfo').urlParams;
            this.totalInfo = tool.getTotalInfo('totalInfo');
        } else {
            urlParams = querystring.parse(window.location.search);
            this.totalInfo = {
                urlParams: urlParams
            };
        }

        let params = {
            serviceId: 'S055',
            orderNo : urlParams.orderNo,
            assurerNo: urlParams.assurerNo,
            userId: urlParams.userId
        };

        this.$post('service', params).then(res => {console.log('总接口');
            this.setSession(res.data);
            this.signList(() => {
                this.checkAuthTypes();
            });
        }).catch(error => {
            console.log(error);
        })
        
        // this.$router.push({
        //     name: 'contract'
        // })
        // this.title = '客户签名'
    }

}
</script>

<style lang="less">
    @import '../style/defined.less';
    @import '../style/iconfont.less';
    @import '../style/mixin.less';
    @import '../style/public.less';
    @import '../style/layout.less';

    .container {
        height: 100%;
        overflow: scroll;
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        font-size: 36px;
        .child-view {
            position: absolute;
            width:100%;
            transition: all .3s cubic-bezier(.55,0,.1,1);
        }
        .slide-left-enter, .slide-right-leave-active {
            opacity: 0;
            -webkit-transform: translate(50px, 0);
            transform: translate(50px, 0);
        }
        .slide-left-leave-active, .slide-right-enter {
            opacity: 0;
            -webkit-transform: translate(-50px, 0);
            transform: translate(-50px, 0);
        }
    }
</style>