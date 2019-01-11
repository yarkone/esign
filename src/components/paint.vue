<template>
    <div class="mask" v-show="!post.isShow">
        <img alt="" class="signed-img" id="signImg">
        <div class="paint-panel">
            <div class="paint-title">手绘签名</div>
            <!-- <div class="paint-board" id="signature"></div> -->
            <canvas class="paint-board" id="signature"></canvas>
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
    // import jSignature from 'jSignature'
    import SignaturePad from 'signature_pad'
    // import hidpiCanvas from 'hidpiCanvas'
    
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
                $signature: null,
                ratio: '',
                imgSrc: ''
            }
		},
		mounted () {

            
            this.$signature = $("#signature");
            
            this.$signature.css({
                width: $(window).width() + 'px',
                height: this.$signature.outerHeight() + 'px'
            })
            this.resizeCanvas ();
            console.log(this.$signature.outerWidth(), this.$signature.outerHeight());
            
            new SignaturePad(this.$signature[0], {
                // minWidth: 2,
                // maxWidth: 2,
                penColor: "rgb(0, 0, 0)"
            })
            // this.initBoard();
            // console.log(this.$signature.jSignature('getData', 'native').length);//判断js画布是否空白
		},
        methods: {
            initBoard () {
                this.ratio = this.$signature.outerWidth() / this.$signature.outerHeight();
                this.$signature.jSignature({'sizeRatio':1,'width':"100%",'height':"100%",'lineWidth': 4});
                this.changeEvt();
            },
            changeEvt () {
                this.$signature.bind('change', (e) => {
                    console.log(e)
                })
            },
            resetBoard () {
                this.$signature.jSignature('reset');
            },
            empty () {
                this.resetBoard();
            },
            submit () {
                let data = this.$signature.jSignature('getData', "image");
                if($.isArray(data) && data.length === 2){
                    let imgStr = data.join(',');
                    let image = new Image();
                    image.src = "data:" + imgStr;
                    image.onload = () => {
                        let compressStream = this.compress(image, 60);
                        $("#signImg").attr("src", "data:image/png;base64," + compressStream).show();
                    };
                } else {
                    alert("签名失败，请稍后再试！");
                }
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
                !function(a){var b=function(){var a=document.createElement("canvas"),b=a.getContext("2d"),c=b.backingStorePixelRatio||b.webkitBackingStorePixelRatio||b.mozBackingStorePixelRatio||b.msBackingStorePixelRatio||b.oBackingStorePixelRatio||b.backingStorePixelRatio||1;return(window.devicePixelRatio||1)/c}(),c=function(a,b){for(var c in a)a.hasOwnProperty(c)&&b(a[c],c)},d={fillRect:"all",clearRect:"all",strokeRect:"all",moveTo:"all",lineTo:"all",arc:[0,1,2],arcTo:"all",bezierCurveTo:"all",isPointinPath:"all",isPointinStroke:"all",quadraticCurveTo:"all",rect:"all",translate:"all",createRadialGradient:"all",createLinearGradient:"all"};1!==b&&(c(d,function(c,d){a[d]=function(a){return function(){var d,e,f=Array.prototype.slice.call(arguments);if("all"===c)f=f.map(function(a){return a*b});else if(Array.isArray(c))for(d=0,e=c.length;e>d;d++)f[c[d]]*=b;return a.apply(this,f)}}(a[d])}),a.stroke=function(a){return function(){this.lineWidth*=b,a.apply(this,arguments),this.lineWidth/=b}}(a.stroke),a.fillText=function(a){return function(){var c=Array.prototype.slice.call(arguments);c[1]*=b,c[2]*=b,this.font=this.font.replace(/(\d+)(px|em|rem|pt)/g,function(a,c,d){return c*b+d}),a.apply(this,c),this.font=this.font.replace(/(\d+)(px|em|rem|pt)/g,function(a,c,d){return c/b+d})}}(a.fillText),a.strokeText=function(a){return function(){var c=Array.prototype.slice.call(arguments);c[1]*=b,c[2]*=b,this.font=this.font.replace(/(\d+)(px|em|rem|pt)/g,function(a,c,d){return c*b+d}),a.apply(this,c),this.font=this.font.replace(/(\d+)(px|em|rem|pt)/g,function(a,c,d){return c/b+d})}}(a.strokeText))}(CanvasRenderingContext2D.prototype),function(a){a.getContext=function(a){return function(b){var c,d,e=a.call(this,b);return"2d"===b&&(c=e.backingStorePixelRatio||e.webkitBackingStorePixelRatio||e.mozBackingStorePixelRatio||e.msBackingStorePixelRatio||e.oBackingStorePixelRatio||e.backingStorePixelRatio||1,d=(window.devicePixelRatio||1)/c,d>1&&(this.style.height=this.height+"px",this.style.width=this.width+"px",this.width*=d,this.height*=d)),e}}(a.getContext)}(HTMLCanvasElement.prototype);
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
                height: 470px;
                background: #fff;
            }
        }
    } 
</style>
