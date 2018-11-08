/*!
* Clamp.js 0.5.1
*
* Copyright 2011-2013, Joseph Schmitt http://joe.sh
* Released under the WTFPL license
* http://sam.zoy.org/wtfpl/
*/
(function(){window.$clamp=function(c,d){function s(a,b){n.getComputedStyle||(n.getComputedStyle=function(a,b){this.el=a;this.getPropertyValue=function(b){var c=/(\-([a-z]){1})/g;"float"==b&&(b="styleFloat");c.test(b)&&(b=b.replace(c,function(a,b,c){return c.toUpperCase()}));return a.currentStyle&&a.currentStyle[b]?a.currentStyle[b]:null};return this});return n.getComputedStyle(a,null).getPropertyValue(b)}function t(a){a=a||c.clientHeight;var b=u(c);return Math.max(Math.floor(a/b),0)}function x(a){return u(c)*
    a}function u(a){var b=s(a,"line-height");"normal"==b&&(b=1.2*parseInt(s(a,"font-size")));return parseInt(b)}function l(a){if(a.lastChild.children&&0<a.lastChild.children.length)return l(Array.prototype.slice.call(a.children).pop());if(a.lastChild&&a.lastChild.nodeValue&&""!=a.lastChild.nodeValue&&a.lastChild.nodeValue!=b.truncationChar)return a.lastChild;a.lastChild.parentNode.removeChild(a.lastChild);return l(c)}function p(a,d){if(d){var e=a.nodeValue.replace(b.truncationChar,"");f||(h=0<k.length?
    k.shift():"",f=e.split(h));1<f.length?(q=f.pop(),r(a,f.join(h))):f=null;m&&(a.nodeValue=a.nodeValue.replace(b.truncationChar,""),c.innerHTML=a.nodeValue+" "+m.innerHTML+b.truncationChar);if(f){if(c.clientHeight<=d)if(0<=k.length&&""!=h)r(a,f.join(h)+h+q),f=null;else return c.innerHTML}else""==h&&(r(a,""),a=l(c),k=b.splitOnChars.slice(0),h=k[0],q=f=null);if(b.animate)setTimeout(function(){p(a,d)},!0===b.animate?10:b.animate);else return p(a,d)}}function r(a,c){a.nodeValue=c+b.truncationChar}d=d||{};
    var n=window,b={clamp:d.clamp||2,useNativeClamp:"undefined"!=typeof d.useNativeClamp?d.useNativeClamp:!0,splitOnChars:d.splitOnChars||[".","-","\u2013","\u2014"," "],animate:d.animate||!1,truncationChar:d.truncationChar||"\u2026",truncationHTML:d.truncationHTML},e=c.style,y=c.innerHTML,z="undefined"!=typeof c.style.webkitLineClamp,g=b.clamp,v=g.indexOf&&(-1<g.indexOf("px")||-1<g.indexOf("em")),m;b.truncationHTML&&(m=document.createElement("span"),m.innerHTML=b.truncationHTML);var k=b.splitOnChars.slice(0),
        h=k[0],f,q;"auto"==g?g=t():v&&(g=t(parseInt(g)));var w;z&&b.useNativeClamp?(e.overflow="hidden",e.textOverflow="ellipsis",e.webkitBoxOrient="vertical",e.display="-webkit-box",e.webkitLineClamp=g,v&&(e.height=b.clamp+"px")):(e=x(g),e<=c.clientHeight&&(w=p(l(c),e)));return{original:y,clamped:w}}})();
"use strict";
const globalHelper = (function Helper() {
    function getViewPortSizes() {
        const w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        const h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        return [w, h];
    }
    function clampTitles() {
        let titles = document.querySelectorAll('.card_header__title > h3');
        titles.forEach(function (title) {
            $clamp(title, { clamp: 2, useNativeClamp: true });
        });
    }
    function checkTouchDevice() {
        const prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
        const mq = function (query) {
            return window.matchMedia(query).matches;
        };
        if (('ontouchstart' in window)) {
            return true;
        }
        const query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
        return mq(query);
    }
    return {
        getViewPortSizes: getViewPortSizes,
        checkTouchDevice: checkTouchDevice,
        clampTitles: clampTitles,
    };
})();
globalHelper.clampTitles();

"use strict";
function toggleHeader() {
    if (globalHelper.getViewPortSizes()[0] < 630) {
        const menu = document.querySelectorAll('.menu_list_header')[0];
        if (menu.classList.contains('animation_slide_on')) {
            menu.classList.remove('animation_slide_on');
            menu.classList.add('animation_slide_off');
            setTimeout(function () {
                menu.classList.remove('animation_slide_off', 'menu_list_item_header--active');
            }, 300);
        }
        else {
            menu.classList.add('animation_slide_on', 'menu_list_item_header--active');
        }
    }
}
const menuContainer = document.querySelector('.header__container');
if (menuContainer) {
    menuContainer.addEventListener('click', toggleHeader);
}

"use strict";
class CameraController {
    constructor(element, url) {
        /* videoState */
        this.streamUrl = url;
        this.animationLength = 250;
        this.animationStart = false;
        this.video = element;
        this.videoWrapper = this.video.parentElement;
        if (!this.videoWrapper) {
            throw Error('Vide wrapper doesn`t exist');
        }
        this.cardContainer = this.videoWrapper.parentElement;
        this.cardsContainer = this.cardContainer.parentElement;
        if (!this.cardContainer || !this.cardsContainer || !this.videoWrapper) {
            throw Error('Bad params');
        }
        this.videoControllers = this.videoWrapper.lastElementChild;
        if (!this.videoControllers.firstElementChild || !this.videoControllers.lastElementChild) {
            throw Error('Bad videoControllers');
        }
        this.brightController = this.videoControllers.firstElementChild.children[0];
        this.contrastController = this.videoControllers.firstElementChild.children[1];
        this.soundLevelController = this.videoControllers.lastElementChild.children[0];
        this.backButtonController = this.videoControllers.lastElementChild.children[1];
        this.brightness = 100;
        this.contrast = 100;
        this.opened = false;
        this.containerSize = {
            calculated: false,
            generalContainer: {
                top: 0,
                left: 0,
                width: 0,
                height: 0
            },
            videoContainer: {
                top: 0,
                left: 0,
                width: 0,
                height: 0
            }
        };
        this.hlsSupported = Hls.isSupported();
        this.init();
    }
    init() {
        this.startStream(this.streamUrl);
        /* define directions for this.directionX and this.directionY */
        this.defineAnimationDirections();
        this.changeBrightness(this.brightness);
        if (this.video) {
            this.video.addEventListener('click', () => {
                if (this.opened) {
                    this.close();
                }
                else {
                    this.open();
                }
            });
            window.addEventListener("resize", this.onResize.bind(this), false);
        }
        if (this.brightController) {
            this.brightController.addEventListener('change', this.onBrightnessChange.bind(this));
        }
        if (this.contrastController) {
            this.contrastController.addEventListener('change', this.onContrastChange.bind(this));
        }
        if (this.backButtonController) {
            this.backButtonController.addEventListener('click', this.close.bind(this));
        }
    }
    initAudioAnalyser() {
        /* Audio context*/
        let AudioContext = window.AudioContext || window.webkitAudioContext;
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
        this.node.onaudioprocess = () => {
            this.analyser.getByteFrequencyData(this.bands);
        };
    }
    toggleVisualizateSound() {
        if (!this.timer) {
            this.timer = window.setInterval(() => {
                let avgLevel = this.getAverageFromArray(this.bands);
                if (!this.soundLevelController) {
                    throw Error();
                }
                else {
                    this.soundLevelController.style.height = `${avgLevel + 20}px`;
                    this.soundLevelController.innerHTML = String(this.getAverageFromArray(this.bands));
                }
            }, 100);
        }
        else {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
    getAverageFromArray(arr) {
        const sum = arr.reduce(function (a, b) { return a + b; });
        return sum > 0 ? Math.round(sum / arr.length) : 0;
    }
    startStream(url) {
        if (this.hlsSupported) {
            try {
                this.hls = new Hls();
                this.hls.loadSource(url);
                this.hls.attachMedia(this.video);
                this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    this.video.play();
                });
            }
            catch (e) {
                console.log(e);
            }
        }
        else if (this.video.canPlayType('application/vnd.apple.mpegurl')) {
            this.video.src = url;
            this.video.addEventListener('loadedmetadata', () => {
                this.video.play();
            });
        }
    }
    /* get true/false */
    changeQualityStream(toQualityMax) {
        if (this.hlsSupported) {
            try {
                let videoQualityLevels = Object.keys(this.hls.levels);
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
    }
    open() {
        if (!this.opened && !this.animationStart) {
            this.animationStart = true;
            /* set up translate */
            this.toggleTranslate();
            /* scale and translate css */
            this.setContainerTransform();
            /* add z-index class*/
            this.toggleOpenClassName();
            setTimeout(() => {
                this.opened = true;
                this.animationStart = false;
                /* delete transition */
                this.toggleTranslate();
                this.toggleCameraControllers();
                this.changeQualityStream(true);
                !this.source ? this.initAudioAnalyser() : null;
                this.toggleVisualizateSound();
            }, this.animationLength);
        }
    }
    close() {
        if (this.opened && !this.animationStart) {
            this.animationStart = true;
            this.videoWrapper.style.transform = null;
            /* set up translate */
            this.toggleTranslate();
            /* Camera controls*/
            this.toggleCameraControllers();
            /* clear visualization */
            this.toggleVisualizateSound();
            setTimeout(() => {
                /* set up z-index*/
                this.toggleOpenClassName();
                /* set up translate */
                this.toggleTranslate();
                /* up quality stream */
                this.changeQualityStream(false);
                this.opened = false;
                this.animationStart = false;
            }, this.animationLength);
        }
    }
    toggleCameraControllers() {
        if (this.videoControllers.classList.contains('camera_controllers--opened')) {
            this.videoControllers.classList.remove('camera_controllers--opened');
        }
        else {
            this.videoControllers.classList.add('camera_controllers--opened');
        }
    }
    /*delete for preventing slow changes when resizing window*/
    toggleTranslate() {
        if (this.videoWrapper.style.transition) {
            this.videoWrapper.style.transition = null;
        }
        else {
            this.videoWrapper.style.transition = `transform  ${this.animationLength / 1000}s ease-out`;
        }
    }
    toggleOpenClassName() {
        if (this.videoWrapper.classList.contains('opened')) {
            this.videoWrapper.classList.remove('opened');
        }
        else {
            this.videoWrapper.classList.add('opened');
        }
    }
    setContainerTransform() {
        let params = this._calculateTransformParams();
        this.videoWrapper.style.transform = 'scale(' + params.scale + ') translate(' + this.directionX * params.translateX + 'px,' + this.directionY * params.translateY + 'px)';
    }
    onResize() {
        if (this.opened) {
            this.setContainerTransform();
        }
    }
    onBrightnessChange(e) {
        let value = Number(e.target.value) * 2;
        this.changeBrightness(value);
    }
    changeBrightness(value) {
        this.brightness = value;
        this.video.style.filter = `brightness(${value}%) contrast(${this.contrast}%)`;
    }
    onContrastChange(e) {
        let value = Number(e.target.value) * 2;
        this.changeContrast(value);
    }
    changeContrast(value) {
        this.contrast = value;
        this.video.style.filter = `brightness(${this.brightness}%) contrast(${value}%)`;
    }
    defineAnimationDirections() {
        if (!this.containerSize.calculated) {
            this._calculateTransformParams();
        }
        const generalCenterX = this.containerSize.generalContainer.left + this.containerSize.generalContainer.width / 2;
        const generalCenterY = this.containerSize.generalContainer.top + this.containerSize.generalContainer.height / 2;
        const videoCenterX = this.containerSize.videoContainer.left + this.containerSize.videoContainer.width / 2;
        const videoCenterY = this.containerSize.videoContainer.top + this.containerSize.videoContainer.height / 2;
        this.directionX = videoCenterX > generalCenterX ? -1 : 1;
        this.directionY = videoCenterY > generalCenterY ? -1 : 1;
    }
    _calculateTransformParams() {
        let domRectVideo = this.cardContainer.getBoundingClientRect(), domRectContainer = this.cardsContainer.getBoundingClientRect();
        let videoContainer = {
            top: domRectVideo.top,
            left: domRectVideo.left,
            width: domRectVideo.width,
            height: domRectVideo.height
        };
        let generalContainer = {
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
        const scale = Math.ceil(generalContainer.width / videoContainer.width * 10) / 10;
        return {
            scale: scale,
            translateX: Math.ceil(videoContainer.width * (scale - 1) / 4 - Math.ceil((videoContainer.width * scale - generalContainer.width) / 2)),
            translateY: Math.ceil(videoContainer.height * (scale - 1) / 4 - Math.ceil((videoContainer.height * scale - generalContainer.height) / 2))
        };
    }
}
let cameras = document.querySelectorAll('.camera video');
let streams = [
    'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fsosed%2Fmaster.m3u8',
    'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fcat%2Fmaster.m3u8',
    'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fdog%2Fmaster.m3u8',
    'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fhall%2Fmaster.m3u8'
];
cameras.forEach((camera, index) => new CameraController(camera, streams[index]));

"use strict";
if (globalHelper.checkTouchDevice()) {
    const touchElements = document.querySelector('.touch_elements');
    if (touchElements) {
        touchElements.style.display = 'flex';
    }
}

"use strict";
const menuItems = document.querySelectorAll('.menu_list_item_header');
menuItems.forEach(function (menuItem) {
    menuItem.addEventListener('click', onMenuItemClick, true);
});
function onMenuItemClick(e) {
    let active = document.querySelectorAll('.menu_list_item_header--active')[0];
    active.classList.remove('menu_list_item_header--active');
    if (e.target.parentElement) {
        const parent = e.target.parentElement;
        if (parent) {
            parent.classList.add('menu_list_item_header--active');
        }
    }
    toggleHeader();
    e.stopPropagation();
}

"use strict";
class ImageTouchEvents {
    constructor(image, options) {
        this.image = image;
        if (!image.parentElement) {
            throw new Error("Can't find parent for image");
        }
        this.parent = image.parentElement;
        this.image.onload = () => {
            this.initListeners();
            this.initState();
            this.initOutput(options);
        };
    }
    initListeners() {
        this.image.addEventListener('pointerdown', (e) => {
            this.image.setPointerCapture(e.pointerId);
            this.addTouchPointer(e);
        });
        this.image.addEventListener('pointermove', (e) => {
            if (this.activePoints[e.pointerId]) {
                this.calculateTouchCore(e);
            }
        });
        this.image.addEventListener('pointercancel', (e) => this.removeTouchPointer(e));
        this.image.addEventListener('pointerup', (e) => this.removeTouchPointer(e));
    }
    /* this method init state params  */
    initState() {
        const initParams = this.image.getBoundingClientRect();
        const that = this;
        this.activePoints = {};
        this.options = {
            maxScrollX: initParams.right - initParams.left - that.parent.offsetWidth,
            maxScrollY: initParams.bottom - initParams.top - that.parent.offsetHeight,
            width: initParams.right - initParams.left,
            height: initParams.bottom - initParams.top,
            startX: 0,
            startY: 0,
            prevX: 0,
            prevY: 0,
            currentTouchAction: null,
            currentBgFilter: 100,
            zoomCurrent: 1,
            zoomMax: 2,
            zoomMin: 1
        };
    }
    setIfExist(selector) {
        let element = document.querySelector(selector);
        if (!element) {
            throw Error(`Can't find element by selector ${selector} `);
        }
        else {
            return element;
        }
    }
    initOutput(options) {
        const that = this;
        this.output = {
            zoom: this.setIfExist(options.zoom),
            bright: this.setIfExist(options.bright),
            vMove: this.setIfExist(options.vMove),
            hMove: this.setIfExist(options.hMove),
        };
        function setValueToContainer(container, delimiter) {
            return function (value) {
                container.innerHTML = `${Math.abs(Math.round(value / delimiter * 100))}%`;
            };
        }
        this.triggers = {
            zoomCurrent: setValueToContainer(that.output.zoom, 1),
            prevX: setValueToContainer(that.output.vMove, that.options.maxScrollX),
            prevY: setValueToContainer(that.output.hMove, that.options.maxScrollY),
            currentBgFilter: setValueToContainer(that.output.bright, 100),
        };
    }
    setOption(option, value) {
        this.options[option] = value;
        if (this.triggers[option] && value && typeof value !== "string") {
            this.triggers[option](value);
        }
    }
    getOption(option) {
        return this.options[option];
    }
    /* this method handle pointerup action */
    addTouchPointer(e) {
        let pointCount = Object.keys(this.activePoints).length;
        if (pointCount > 1) {
            return;
        }
        this.activePoints[e.pointerId] = {
            prevX: e.x,
            prevY: e.y,
            startX: e.x,
            startY: e.y,
            prevTs: Date.now(),
        };
    }
    ;
    removeTouchPointer(e) {
        this.setOption('currentTouchAction', null);
        delete this.activePoints[e.pointerId];
    }
    ;
    /* this method calculate core params  */
    calculateTouchCore(e) {
        if (!this.activePoints[e.pointerId]) {
            return;
        }
        const currentPoint = this.activePoints[e.pointerId];
        const that = this;
        /* throttling */
        const ts = Date.now(), run = ts - currentPoint.prevTs > 4;
        if (!run) {
            return;
        }
        const x = e.x;
        const y = e.y;
        const top = this.getOption('prevY');
        const left = this.getOption('prevX');
        const touchParams = {
            detX: x - currentPoint.prevX,
            detY: y - currentPoint.prevY,
            currentPoint: currentPoint,
            secondPoint: that.getSecondPoint(e.pointerId),
            newPoint: { prevY: y, prevX: x, prevTs: ts, startX: x, startY: y }
        };
        const updateState = () => {
            this.activePoints[e.pointerId] = touchParams.newPoint;
        };
        const newY = (top + touchParams.detY);
        const newX = (left + touchParams.detX);
        let action = this.actionResolver(touchParams);
        if (action === null) {
            return;
        }
        this.setOption('currentTouchAction', action);
        switch (action) {
            case 'swipe':
                {
                    this.handleSwipe(newX, newY, touchParams.detY);
                    updateState();
                }
                break;
            case 'pinch':
                {
                    this.handlePinch(touchParams.currentPoint, touchParams.newPoint, touchParams.secondPoint);
                    updateState();
                }
                break;
            case 'rotate': {
                this.handleRotate(touchParams.detX, touchParams.detY);
            }
            default: {
                return;
            }
        }
    }
    /* this method calculate ange between new and old points */
    calculateAngle(pA, pAn, pB) {
        let cosA, aV, bV;
        if (!(pA.prevX - pAn.prevX + pA.prevY - pA.prevY)) {
            return 1;
        }
        else {
            aV = {
                x: pA.prevX - pB.prevX,
                y: pA.prevY - pB.prevY
            };
            bV = {
                x: pAn.prevX - pB.prevX,
                y: pAn.prevY - pB.prevY
            };
            cosA = (aV.x * bV.x + aV.y * bV.y)
                / Math.sqrt(Math.pow(aV.x, 2) + Math.pow(aV.y, 2))
                / Math.sqrt(Math.pow(bV.x, 2) + Math.pow(bV.y, 2));
        }
        return Math.acos(cosA) * 180 / Math.PI;
    }
    ;
    /* this method define current action */
    actionResolver(options) {
        let currentAction = this.getOption('currentTouchAction');
        let touchCount = Object.keys(this.activePoints).length;
        /* when 2 finders on the device we will once define touch action */
        if (currentAction !== null) {
            return currentAction;
        }
        if (touchCount === 1) {
            this.setOption('currentTouchAction', 'swipe');
            currentAction = 'swipe';
            /* when 2 finders on the device we not updating x and y, to collect detX and detY to define angle*/
        }
        else if (touchCount === 2 && ((Math.abs(options.detX) + Math.abs(options.detY) > 30) && options.secondPoint)) {
            let angle = this.calculateAngle(options.currentPoint, options.newPoint, options.secondPoint);
            /* experimental value */
            if (Math.abs(angle) < 7) {
                this.setOption('currentTouchAction', 'pinch');
                currentAction = 'pinch';
            }
            else {
                this.setOption('currentTouchAction', 'rotate');
                currentAction = 'rotate';
            }
        }
        return currentAction;
    }
    getSecondPoint(firstPointId) {
        for (let pointId in this.activePoints) {
            if (this.activePoints.hasOwnProperty(pointId)) {
                if (Number(pointId) !== Number(firstPointId)) {
                    return this.activePoints[pointId];
                }
            }
        }
    }
    ;
    handleSwipe(newX, newY, detY) {
        /* horizontal parent block boundaries*/
        if (newX <= 0 && Math.abs(newX) <= this.getOption('maxScrollX')) {
            this.image.style.left = newX + 'px';
            this.setOption('prevX', newX);
        }
        /* vertical parent block boundaries*/
        if (((detY < 0 && Math.abs(newY) >= 0) || (detY > 0 && newY <= 0)) &&
            Math.abs(newY) <= this.getOption('maxScrollY')) {
            this.image.style.top = newY + 'px';
            this.setOption('prevY', newY);
        }
    }
    handlePinch(currentPoint, newPoint, secondPoint) {
        const fromVector = {
            x: currentPoint.prevX - secondPoint.prevX,
            y: currentPoint.prevY - secondPoint.prevY
        };
        const toVector = {
            x: newPoint.prevX - secondPoint.prevX,
            y: newPoint.prevY - secondPoint.prevY
        };
        const lengthFrom = Math.sqrt(Math.pow(fromVector.x, 2) + Math.pow(fromVector.y, 2));
        const lengthTo = Math.sqrt(Math.pow(toVector.x, 2) + Math.pow(toVector.y, 2));
        const trackDiff = lengthTo - lengthFrom;
        let zoom;
        if (trackDiff > 0) {
            zoom = Math.min(this.getOption('zoomMax'), this.getOption('zoomCurrent') + 4 / 100);
        }
        else {
            zoom = Math.max(this.getOption('zoomMin'), this.getOption('zoomCurrent') - 4 / 100);
        }
        this.setOption('zoomCurrent', zoom);
        this.image.style.zoom = `${zoom}%`;
    }
    handleRotate(detX, detY) {
        let angle = Math.atan(detX / detY) * 180 / Math.PI;
        let bgFilter;
        if (angle < 0) {
            bgFilter = Math.max(1, this.getOption('currentBgFilter') + angle / 15);
        }
        else {
            bgFilter = Math.min(100, this.getOption('currentBgFilter') + angle / 15);
        }
        this.setOption('currentBgFilter', bgFilter);
        this.image.style.filter = 'brightness(' + bgFilter + '%)';
    }
    ;
}
let image = document.querySelectorAll('#touch-image > img')[0];
let options = {
    bright: '#bright',
    zoom: '#zoom',
    vMove: '#vMove',
    hMove: '#hMove'
};
if (image) {
    new ImageTouchEvents(image, options);
}
