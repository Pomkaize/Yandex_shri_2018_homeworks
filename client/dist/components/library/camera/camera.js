"use strict";
var CameraController = /** @class */ (function () {
    function CameraController(element, url) {
        /* videoState */
        this.streamUrl = url;
        this.animationLength = 250;
        this.animationStart = false;
        this.video = element;
        this.videoWrapper = this.video.parentElement;
        this.cardContainer = this.videoWrapper.parentElement;
        this.cardsContainer = this.cardContainer.parentElement;
        this.videoControllers = this.videoWrapper.lastElementChild;
        this.brightController = this.videoControllers.firstElementChild.children[0];
        this.contrastController = this.videoControllers.firstElementChild.children[1];
        this.soundLevelController = this.videoControllers.lastElementChild.children[0];
        this.backButtonController = this.videoControllers.lastElementChild.children[1];
        this.brightness = 100;
        this.contrast = 100;
        this.opened = false;
        this.directionX = null;
        this.directionY = null;
        this.containerSize = {
            calculated: false
        };
        this.hlsSupported = Hls.isSupported();
        this.init();
    }
    CameraController.prototype.init = function () {
        var _this = this;
        this.startStream(this.streamUrl);
        /* define directions for this.directionX and this.directionY */
        this.defineAnimationDirections();
        this.changeBrightness(this.brightness);
        if (this.video) {
            this.video.addEventListener('click', function () {
                if (_this.opened) {
                    _this.close();
                }
                else {
                    _this.open();
                }
            });
            window.addEventListener("resize", this.onResize.bind(this), false);
        }
        this.brightController.addEventListener('change', this.onBrightnessChange.bind(this));
        this.contrastController.addEventListener('change', this.onContrastChange.bind(this));
        this.backButtonController.addEventListener('click', this.close.bind(this));
    };
    CameraController.prototype.initAudioAnalyser = function () {
        var _this = this;
        /* Audio context*/
        var AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new AudioContext();
        this.node = this.audioCtx.createScriptProcessor(2048, 1, 1);
        /* Analyzer */
        this.analyser = this.audioCtx.createAnalyser();
        this.analyser.smoothingTimeConstant = 0.3;
        this.analyser.fftSize = 512;
        this.bands = new Uint8Array(this.analyser.frequencyBinCount);
        /* bindings */
        this.source = this.audioCtx.createMediaElementSource(this.video);
        this.source.connect(this.analyser);
        this.analyser.connect(this.node);
        this.node.connect(this.audioCtx.destination);
        this.source.connect(this.audioCtx.destination);
        /* writing sound data to array */
        this.node.onaudioprocess = function () {
            _this.analyser.getByteFrequencyData(_this.bands);
        };
    };
    CameraController.prototype.toggleVisualizateSound = function () {
        var _this = this;
        if (!this.timer) {
            this.timer = setInterval(function () {
                var avgLevel = _this.getAverageFromArray(_this.bands);
                _this.soundLevelController.style.height = avgLevel + 20 + "px";
                _this.soundLevelController.innerHTML = _this.getAverageFromArray(_this.bands);
            }, 100);
        }
        else {
            clearInterval(this.timer);
            this.timer = null;
        }
    };
    CameraController.prototype.getAverageFromArray = function (arr) {
        var sum = arr.reduce(function (a, b) { return a + b; });
        return sum > 0 ? Math.round(sum / arr.length) : 0;
    };
    CameraController.prototype.startStream = function (url) {
        var _this = this;
        if (this.hlsSupported) {
            try {
                this.hls = new Hls();
                this.hls.loadSource(url);
                this.hls.attachMedia(this.video);
                this.hls.on(Hls.Events.MANIFEST_PARSED, function () {
                    _this.video.play();
                });
            }
            catch (e) {
                console.log(e);
            }
        }
        else if (this.video.canPlayType('application/vnd.apple.mpegurl')) {
            this.video.src = url;
            this.video.addEventListener('loadedmetadata', function () {
                _this.video.play();
            });
        }
    };
    /* get true/false */
    CameraController.prototype.changeQualityStream = function (toQualityMax) {
        if (this.hlsSupported) {
            try {
                var videoQualityLevels = Object.keys(this.hls.levels);
                if (toQualityMax) {
                    this.hls.nextLevel = Number(videoQualityLevels[videoQualityLevels.length - 1]);
                }
                else {
                    this.hls.nextLevel = Number(videoQualityLevels[0]);
                }
            }
            catch (e) {
                console.log(e);
            }
        }
    };
    CameraController.prototype.open = function () {
        var _this = this;
        if (!this.opened && !this.animationStart) {
            this.animationStart = true;
            /* set up translate */
            this.toggleTranslate();
            /* scale and translate css */
            this.setContainerTransform();
            /* add z-index class*/
            this.toggleOpenClassName();
            setTimeout(function () {
                _this.opened = true;
                _this.animationStart = false;
                /* delete transition */
                _this.toggleTranslate();
                _this.toggleCameraControllers();
                _this.changeQualityStream(true);
                !_this.source ? _this.initAudioAnalyser() : null;
                _this.toggleVisualizateSound();
            }, this.animationLength);
        }
    };
    CameraController.prototype.close = function () {
        var _this = this;
        if (this.opened && !this.animationStart) {
            this.animationStart = true;
            this.videoWrapper.style.transform = null;
            /* set up translate */
            this.toggleTranslate();
            /* Camera controls*/
            this.toggleCameraControllers();
            /* clear visualization */
            this.toggleVisualizateSound();
            setTimeout(function () {
                /* set up z-index*/
                _this.toggleOpenClassName();
                /* set up translate */
                _this.toggleTranslate();
                /* up quality stream */
                _this.changeQualityStream(false);
                _this.opened = false;
                _this.animationStart = false;
            }, this.animationLength);
        }
    };
    CameraController.prototype.toggleCameraControllers = function () {
        if (this.videoControllers.classList.contains('camera_controllers--opened')) {
            this.videoControllers.classList.remove('camera_controllers--opened');
        }
        else {
            this.videoControllers.classList.add('camera_controllers--opened');
        }
    };
    /*delete for preventing slow changes when resizing window*/
    CameraController.prototype.toggleTranslate = function () {
        if (this.videoWrapper.style.transition) {
            this.videoWrapper.style.transition = null;
        }
        else {
            this.videoWrapper.style.transition = "transform  " + this.animationLength / 1000 + "s ease-out";
        }
    };
    CameraController.prototype.toggleOpenClassName = function () {
        if (this.videoWrapper.classList.contains('opened')) {
            this.videoWrapper.classList.remove('opened');
        }
        else {
            this.videoWrapper.classList.add('opened');
        }
    };
    CameraController.prototype.setContainerTransform = function () {
        var params = this._calculateTransformParams();
        this.videoWrapper.style.transform = 'scale(' + params.scale + ') translate(' + this.directionX * params.translateX + 'px,' + this.directionY * params.translateY + 'px)';
    };
    CameraController.prototype.onResize = function () {
        if (this.opened) {
            this.setContainerTransform();
        }
    };
    CameraController.prototype.onBrightnessChange = function (e) {
        var value = (e.target.value) * 2;
        this.changeBrightness(value);
    };
    CameraController.prototype.changeBrightness = function (value) {
        this.brightness = value;
        this.video.style.filter = "brightness(" + value + "%) contrast(" + this.contrast + "%)";
    };
    CameraController.prototype.onContrastChange = function (e) {
        var value = (e.target.value) * 2;
        this.changeContrast(value);
    };
    CameraController.prototype.changeContrast = function (value) {
        this.contrast = value;
        this.video.style.filter = "brightness(" + this.brightness + "%) contrast(" + value + "%)";
    };
    CameraController.prototype.defineAnimationDirections = function () {
        if (!this.containerSize.calculated) {
            this._calculateTransformParams();
        }
        var generalCenterX = this.containerSize.generalContainer.left + this.containerSize.generalContainer.width / 2;
        var generalCenterY = this.containerSize.generalContainer.top + this.containerSize.generalContainer.height / 2;
        var videoCenterX = this.containerSize.videoContainer.left + this.containerSize.videoContainer.width / 2;
        var videoCenterY = this.containerSize.videoContainer.top + this.containerSize.videoContainer.height / 2;
        this.directionX = videoCenterX > generalCenterX ? -1 : 1;
        this.directionY = videoCenterY > generalCenterY ? -1 : 1;
    };
    CameraController.prototype._calculateTransformParams = function () {
        var domRectVideo = this.cardContainer.getBoundingClientRect(), domRectContainer = this.cardsContainer.getBoundingClientRect();
        var videoContainer = {
            top: domRectVideo.top,
            left: domRectVideo.left,
            width: domRectVideo.width,
            height: domRectVideo.height
        };
        var generalContainer = {
            top: domRectContainer.top,
            left: domRectContainer.left,
            width: domRectContainer.width,
            height: domRectContainer.height
        };
        this.containerSize = {
            calculated: true,
            videoContainer: videoContainer,
            generalContainer: generalContainer
        };
        var scale = Math.ceil(generalContainer.width / videoContainer.width * 10) / 10;
        return {
            scale: scale,
            translateX: Math.ceil(videoContainer.width * (scale - 1) / 4 - Math.ceil((videoContainer.width * scale - generalContainer.width) / 2)),
            translateY: Math.ceil(videoContainer.height * (scale - 1) / 4 - Math.ceil((videoContainer.height * scale - generalContainer.height) / 2))
        };
    };
    return CameraController;
}());
var cameras = document.querySelectorAll('.camera video');
var streams = [
    'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fsosed%2Fmaster.m3u8',
    'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fcat%2Fmaster.m3u8',
    'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fdog%2Fmaster.m3u8',
    'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fhall%2Fmaster.m3u8'
];
cameras.forEach(function (camera, index) { return new CameraController(camera, streams[index]); });
