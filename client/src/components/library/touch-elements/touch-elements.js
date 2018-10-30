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
