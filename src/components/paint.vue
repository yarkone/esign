<template>
    <div class="mask" v-show="post.isShow">
        <div class="paint-panel" ref="paintPanel">
            <div class="paint-content-hand" v-show="post.isNeedHand">{{post.contentHand || ''}}</div>
            <div class="paint-title" ref="paintTitle">{{post.isNeedHand ? '手绘摘抄内容' : '手绘签名'}}</div>
            <div class="paint-board clearfix" ref="paintBoard" :style="{width: screenWidth * (post.markList && post.markList.length || 1) + 'px'}">
                <div class="canvas-wrap" :style="{width: screenWidth + 'px'}" v-for="(item, index) in post.markList" :key="index">
                    <div class="canvas-tips" v-if="post.isNeedHand">{{'（' + (index + 1) + '）请签署“' + (item ? item.substring(0, item.length - 1) : '') + '”'}}</div>
                    <canvas :width="screenWidth" :height="canvasHeight" class="canvas" ref="item"></canvas>
                    <x-icon @click="prev" type="ios-arrow-left" class="icon-left" size="30" v-show="post.isNeedHand && index !== 0"></x-icon>
                    <x-icon @click="next" type="ios-arrow-right" class="icon-right" size="30" v-show="post.isNeedHand && index !== post.markList.length - 1"></x-icon>
                </div>
            </div>
            <div class="paint-submit" ref="paintSubmit">
                <div class="button button-empty" @click="empty">清空</div>
                <div class="button button-submit" @click="submit">提交</div>
                <div class="button button-cancel" @click="cancel">取消</div>
            </div>
        </div>
    </div>
</template>

<script>
    import $ from 'jquery'
    import { ajax } from 'jquery'
    // import jSignature from 'jSignature'
    import signaturePad from 'signature_pad'
    import hidpiCanvas from 'hidpiCanvas'
    import trimCanvas from 'trim-canvas'
    
    export default {
        name: 'paint',
        props: {
            post: {
                type: Object
            }
        },
        data () {
			return {
                signaturePad: [],
                signaturePadEl: [],
                screenWidth: 0,
                canvasHeight: 0,
                ratio: '',
                imgSrc: '',
                idx: 0,
            }
		},
		mounted () {
            this.removeBlanks();
        },
        methods: {
            initBoard () {
                this.screenWidth = $(window).width();
                this.canvasHeight = $(this.$refs.paintPanel).outerHeight() - $(this.$refs.paintTitle).outerHeight() - $(this.$refs.paintSubmit).outerHeight();
                
                for(let i = 0; i < this.post.markList.length; i++) {
                    this.$nextTick(() => {
                        this.signaturePadEl.push(this.$refs.item[i]);
                        this.signaturePad.push(new signaturePad(this.signaturePadEl[i], {
                            penColor: "rgb(0, 0, 0)",
                            // velocityFilterWeight: 0.1,//线条粗细，默认0.7
                        }));
                    });
                }
            },
            changeEvt () {
                this.signaturePadEl.bind('change', (e) => {
                    console.log(e)
                })
            },
            resetBoard (isAll) {
                if(isAll) {
                    this.signaturePad.forEach((item, index) => {
                        this.signaturePad[index].clear();
                    });
                } else {
                    this.signaturePad[this.idx].clear();
                }
            },
            empty () {
                this.resetBoard();
            },
            submit () {
                //判断所有签名是否全部完成
                for(let i = 0; i < this.signaturePadEl.length; i++) {
                    if(this.isCanvasBlank(this.signaturePadEl[i])) {
                        this.$vux.toast.show({
                            type: 'text',
                            text: this.post.isNeedHand ? `请绘制第${i + 1}签字内容` : '您还没有绘制签名',
                            width: '16em',
                            position: 'center',
                        });
                        if(this.post.isNeedHand) {
                            this.idx = i;
                            $(this.$refs.paintBoard).animate({
                                left: -this.idx * this.screenWidth + 'px'
                            });
                        }
                        return false;
                    }
                }

                for(let i = 0; i < this.signaturePadEl.length; i++) {
                    let $clone = this.trimBlankCanvas(this.signaturePad[i].getTrimPos());
                    this.ratio = $clone.width / $clone.height;
                    let image = new Image();
                    let _toDataURL = $clone.toDataURL()
                    image.src = _toDataURL;
                    image.onload = () => {
                        let compressStream = '';
                        let config_height, config_width;
                        config_height = config_width = this.post.isNeedHand ? 40 : 60;//摘要最大高、宽度40px。手绘最大高、宽度60px
                        if($clone.height < config_height) {
                            if($clone.width < config_width) {
                                compressStream = _toDataURL.replace('data:image/png;base64,','');
                            } else {
                                compressStream = this.compress(image, 'width', config_width);
                            }
                        } else {
                            compressStream = this.compress(image, 'height', config_height);
                        }
                        console.log('data:image/png;base64,' + compressStream, i);
                        let isComplete = i === this.signaturePadEl.length - 1 ? true : false;
                        this.$parent.submitSign(this.post.markList[i], compressStream, this.post.isNeedHand, isComplete);
                    }
                }
            },
            signComplete () {
                this.resetBoard(true);
                this.idx = 0;
                this.signaturePad = [];
                this.signaturePadEl = [];
                $(this.$refs.paintBoard).animate({
                    left: -this.idx * this.screenWidth + 'px'
                })
                this.post.isShow = false;
            },
            cancel () {
                this.resetBoard();
                this.idx = 0;
                this.post.isShow = false;
            },
            //上一张canvas
            prev () {
                if(this.idx === 0) {
                    return false;
                }
                this.idx--;
                $(this.$refs.paintBoard).animate({
                    left: -this.idx * this.screenWidth + 'px'
                })
            },
            //下一张canvas
            next () {
                if(this.idx === this.post.markList.length - 1) {
                    return false;
                }
                this.idx++;
                $(this.$refs.paintBoard).animate({
                    left: -this.idx * this.screenWidth + 'px'
                })
            },
            isCanvasBlank (canvas) {
                let blank = document.createElement('canvas');//系统获取一个空canvas对象
                blank.width = canvas.width;
                blank.height = canvas.height;
                return canvas.toDataURL() === blank.toDataURL();//比较值相等则为空
            },
            compress (image, type, configValue) {
                let cvs = document.createElement('canvas');
                let ctx = cvs.getContext('2d');
                let _width, _height;
                //指定图片压缩大小可以自由设置 但务必保持签名布的宽高比 
                if(type === 'height') {
                    _height = configValue;
                    _width = this.ratio * configValue;
                } else {
                    _width = configValue;
                    _height = 2;
                }
                console.log(_width, _height, this.ratio);
                cvs.width = _width;
                cvs.height = _height;
                ctx.drawImage(image, 0, 0, cvs.width, cvs.height); 
                let newImageData = cvs.toDataURL("image/png", 1); 
                let sendData = newImageData.replace('data:image/png;base64,','');
                return sendData;
            },
            /**
             * 旋转图片
             */
            roate (image) {
                var height = image.height;
                var width = image.width;
                var halfH = height/2;
                var halfW = width/2;
                var cvs = document.createElement('canvas');
                cvs.width = height;    
                cvs.height = width;     
                var ctx = cvs.getContext("2d")
                ctx.translate(halfW, halfH);
                ctx.rotate(0);
                ctx.drawImage(image, halfH-width,-halfW);
                return cvs.toDataURL("image/png",1);
            },
            resizeCanvas () {
                // var ratio =  Math.max(window.devicePixelRatio || 1, 1);
                // this.signaturePadEl[0].width = this.signaturePadEl[0].offsetWidth * ratio;
                // this.signaturePadEl[0].height = this.signaturePadEl[0].offsetHeight * ratio;
                // this.signaturePadEl[0].getContext("2d").scale(ratio, ratio);
                // this.signaturePad.clear(); // otherwise isEmpty() might return incorrect value
            },
            trimBlankCanvas (opts) {
                //create a new canvas
                let newCanvas = document.createElement('canvas');
                let context = newCanvas.getContext('2d');

                //set dimensions
                newCanvas.width = opts.cropRight - opts.cropLeft;
                newCanvas.height = opts.cropBottom - opts.cropTop;
                newCanvas.style = '';

                //apply the old canvas to the new one
                // context.drawImage(oldCanvas, 0, 0);
                context.putImageData(opts.relevantData, 0, 0);

                //return the new canvas
                return newCanvas;
            },
            removeBlanks () {
                signaturePad.prototype.getTrimPos = function () {
                    var imgWidth = this._ctx.canvas.width;
                    var imgHeight = this._ctx.canvas.height;
                    var imageData = this._ctx.getImageData(0, 0, imgWidth, imgHeight),
                    data = imageData.data,
                    getAlpha = function(x, y) {
                        return data[(imgWidth*y + x) * 4 + 3]
                    },
                    scanY = function (fromTop) {
                        var offset = fromTop ? 1 : -1;

                        // loop through each row
                        for(var y = fromTop ? 0 : imgHeight - 1; fromTop ? (y < imgHeight) : (y > -1); y += offset) {

                            // loop through each column
                            for(var x = 0; x < imgWidth; x++) {
                                if (getAlpha(x, y)) {
                                    return y;                        
                                }      
                            }
                        }
                        return null; // all image is white
                    },
                    scanX = function (fromLeft) {
                        var offset = fromLeft? 1 : -1;

                        // loop through each column
                        for(var x = fromLeft ? 0 : imgWidth - 1; fromLeft ? (x < imgWidth) : (x > -1); x += offset) {

                            // loop through each row
                            for(var y = 0; y < imgHeight; y++) {
                                if (getAlpha(x, y)) {
                                    return x;                        
                                }      
                            }
                        }
                        return null; // all image is white
                    };

                    var cropTop = scanY(true),
                    cropBottom = scanY(false),
                    cropLeft = scanX(true),
                    cropRight = scanX(false);
                    // console.log(cropTop, cropBottom, cropLeft, cropRight);
                    var relevantData = this._ctx.getImageData(cropLeft, cropTop, cropRight-cropLeft, cropBottom-cropTop);
                    // this._ctx.canvas.width = cropRight-cropLeft;
                    // this._ctx.canvas.height = cropBottom-cropTop;
                    // this._ctx.clearRect(0, 0, cropRight-cropLeft, cropBottom-cropTop);
                    // this._ctx.putImageData(relevantData, 0, 0);
                    return {
                        relevantData: relevantData,
                        cropTop: cropTop,
                        cropBottom: cropBottom,
                        cropLeft: cropLeft,
                        cropRight: cropRight
                    }
                };
            }
        }
    }
</script>

<style lang="less">
	@import "../style/defined";
    @import '../style/public';

    .mask {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.4);
        z-index: 1;
        .signed-img {
            position: absolute;
            bottom: 670px;
        }
        .paint-panel {
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 670px;

            .paint-content-hand {
                background: #fff;
                width: 100%;
                padding: 40px;
                line-height: 46px;
                position: absolute;
                bottom: 670px;
            }
            .paint-title, .paint-submit {
                width: 100%;
                height: 100px;
                line-height: 100px;
            }
            .paint-title {
                background: #80b159;
                color: #fff;
                font-size: 32px;
                text-align: center;
            }
            .paint-submit {
                position: absolute;
                bottom: 0;
                background: #333333;
                text-align: center;
                z-index: 1;
                .button {
                    display: inline-block;
                    margin-top: 20px;
                    padding: 0 48px;
                    height: 60px;
                    line-height: 60px;
                    background: #999999;
                    color: #fff;
                    text-align: center;
                    &.button-submit {
                        margin: 0 40px;
                    }
                }
            }
            .paint-board {
                position: absolute;
                top: 100px;
                left: 0;
                right: 0;
                bottom: 100px;
                background: #fff;
                z-index: 0;
                .canvas-wrap {
                    float: left;
                    position: relative;
                    height: 100%;
                    .icon-left {
                        position: absolute;
                        left: 38px;
                        top: 50%;
                        // margin-top: -22px;
                        transform: translate(0, -50%);
                        fill: #8a8a8a;
                        z-index: 1;
                    }
                    .icon-right {
                        position: absolute;
                        right: 38px;
                        top: 50%;
                        // margin-top: -22px;
                        transform: translate(0, -50%);
                        fill: #8a8a8a;
                        z-index: 1;
                    }
                    .canvas-tips {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        z-index: 0;
                        font-size: 35px;
                        color: #8a8a8a;
                    }
                    .canvas {
                        position: absolute;
                        top: 0;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        z-index: 0;                        
                    }
                }
            }
        }
    } 
</style>
