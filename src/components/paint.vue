<template>
    <div class="mask" v-show="post.isShow">
        <img alt="" class="signed-img" id="signImg">
        <div class="paint-panel">
            <div class="paint-title">手绘签名</div>
            <!-- <div class="paint-board" id="signature"></div> -->
            <!-- <canvas class="paint-board" id="signature"></canvas> -->
            <div class="paint-submit">
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
                signFlag: false,
                signaturePad: null,
                $signaturePad: null,
                ratio: '',
                imgSrc: ''
            }
		},
		mounted () {

            this.initBoard();
            
            // this.$signaturePad = $("#signature");
            
            // console.log($(window).width())
            // this.$signaturePad.css({
            //     width: $(window).width() + 'px',
            //     height: this.$signaturePad.outerHeight() + 'px'
            // })
            // this.resizeCanvas ();
            // console.log(this.$signaturePad.outerWidth(), this.$signaturePad.outerHeight());
            

            // this.signaturePad.on('touchmove', function(e) {
            //     console.log(e)
            // })

            
            
            // console.log(this.$signaturePad.jSignature('getData', 'native').length);//判断js画布是否空白
		},
        methods: {
            initBoard () {
                let screenWidth = $(window).width(),
                    canvasHeight = $('.paint-panel').outerHeight() - $('.paint-title').outerHeight() - $('.paint-submit').outerHeight();
                this.ratio = screenWidth / canvasHeight;
                this.$signaturePad = $('<canvas width="'+ screenWidth +'" height="'+ canvasHeight +'" class="paint-board" id="signature"></canvas>');
                $('.paint-title').after(this.$signaturePad);

                this.signaturePad = new signaturePad(this.$signaturePad[0], {
                    penColor: "rgb(0, 0, 0)",
                    // velocityFilterWeight: 0.1,//线条粗细，默认0.7
                    onBegin: (e)=> {
                        console.log(e);
                    },
                    onEnd: (e)=> {
                        console.log(e);
                    }
                })
            },
            changeEvt () {
                this.$signaturePad.bind('change', (e) => {
                    console.log(e)
                })
            },
            resetBoard () {
                this.signaturePad.clear();
            },
            empty () {
                this.resetBoard();
            },
            submit () {
                // console.log(this.$signaturePad)
                // $("#signImg").after(trimCanvas(this.$signaturePad.clone(true)[0]));

                // let canvas = document.createElement('canvas');
                // canvas.width = this.$signaturePad[0].width;
                // canvas.height = this.$signaturePad[0].height;
                // let ctx = canvas.getContext('2d');
                // ctx.drawImage(this.$signaturePad[0], 0, 0, this.$signaturePad[0].width, this.$signaturePad[0].height);
                // $("#signImg").after(trimCanvas(canvas));

                function cloneCanvas(oldCanvas) {

                    //create a new canvas
                    var newCanvas = document.createElement('canvas');
                    var context = newCanvas.getContext('2d');

                    //set dimensions
                    newCanvas.width = oldCanvas.width;
                    newCanvas.height = oldCanvas.height;

                    //apply the old canvas to the new one
                    context.drawImage(oldCanvas, 0, 0);

                    //return the new canvas
                    return newCanvas;
                }
                
                // trimCanvas($clone[0]);
                let $clone = $(cloneCanvas(this.$signaturePad[0]));
                $("#signImg").after($clone);
                // console.log($clone[0].toDataURL());
                new signaturePad($clone[0], {
                    penColor: "rgb(0, 0, 0)",
                    // velocityFilterWeight: 0.1,//线条粗细，默认0.7
                })
                // this.canvasRemoveBlanks($clone[0])
                this.canvasRemoveBlanks(this.$signaturePad[0])
                
                let image = new Image();
                image.src = this.signaturePad.toDataURL();
                image.onload = () => {
                    let compressStream = this.compress(image, image.height);
                    $("#signImg").attr("src", "data:image/png;base64," + compressStream).show();
                };

                // let image = new Image();
                // let src = image.src = canvasScale({width: this.ratio * 60, height: 60}, this.$signaturePad[0], 'png-src');
                // image.onload = () => {
                //     $("#signImg").attr("src", src).show();
                // };

                // html2canvas(document.body).then(function(canvas) {
                //     document.body.appendChild(canvas);
                // });
                // console.log(Canvas2Image.saveAsPNG(this.$signaturePad[0], this.ratio * 60, 60));
            },
            cancel () {
                this.resetBoard();
                this.post.isShow = false;
            },
            compress (image, height) {
                let cvs = document.createElement('canvas');
                //指定图片压缩大小可以自由设置 但务必保持签名布的宽高比 
                
                cvs.height = height;
                cvs.width = this.ratio * height;
                let ctx = cvs.getContext('2d');    
                ctx.drawImage(image, 0, 0, cvs.width, cvs.height); 
                let newImageData = cvs.toDataURL("image/png", 1); 
                let sendData = newImageData.replace("data:image/png;base64,",'');  
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
                // this.$signaturePad[0].width = this.$signaturePad[0].offsetWidth * ratio;
                // this.$signaturePad[0].height = this.$signaturePad[0].offsetHeight * ratio;
                // this.$signaturePad[0].getContext("2d").scale(ratio, ratio);
                // this.signaturePad.clear(); // otherwise isEmpty() might return incorrect value
            },
            canvasRemoveBlanks (canvas) {
                let _ctx = canvas.getContext('2d');
                let imgWidth = canvas.width;
                let imgHeight = canvas.height;
                let imageData = _ctx.getImageData(0, 0, imgWidth, imgHeight),
                data = imageData.data,
                getAlpha = function(x, y) {
                    return data[(imgWidth*y + x) * 4 + 3]
                },
                scanY = function (fromTop) {
                    let offset = fromTop ? 1 : -1;

                    // loop through each row
                    for(let y = fromTop ? 0 : imgHeight - 1; fromTop ? (y < imgHeight) : (y > -1); y += offset) {

                        // loop through each column
                        for(let x = 0; x < imgWidth; x++) {
                            if (getAlpha(x, y)) {
                                return y;                        
                            }      
                        }
                    }
                    return null; // all image is white
                },
                scanX = function (fromLeft) {
                    let offset = fromLeft? 1 : -1;

                    // loop through each column
                    for(let x = fromLeft ? 0 : imgWidth - 1; fromLeft ? (x < imgWidth) : (x > -1); x += offset) {

                        // loop through each row
                        for(let y = 0; y < imgHeight; y++) {
                            if (getAlpha(x, y)) {
                                return x;                        
                            }      
                        }
                    }
                    return null; // all image is white
                };

                let cropTop = scanY(true),
                cropBottom = scanY(false),
                cropLeft = scanX(true),
                cropRight = scanX(false);

                let relevantData = _ctx.getImageData(cropLeft, cropTop, cropRight-cropLeft, cropBottom-cropTop);
                canvas.width = cropRight-cropLeft;
                canvas.height = cropBottom-cropTop;
                _ctx.clearRect(0, 0, cropRight-cropLeft, cropBottom-cropTop);
                _ctx.putImageData(relevantData, 0, 0);
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
        z-index: 99999;
        .signed-img {
            position: absolute;
            bottom: 670px;
        }
        .paint-panel {
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 670px;

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
                // height: 470px;
                background: #fff;
            }
        }
    } 
</style>
