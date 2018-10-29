"use strict";
var ImageTouchEvents = /** @class */ (function () {
    function ImageTouchEvents(image, options) {
        var _this = this;
        this.image = image;
        this.parent = image.parentElement;
        this.image.onload = function () {
            _this.initListeners();
            _this.initState();
            _this.initOutput(options);
        };
    }
    ImageTouchEvents.prototype.initListeners = function () {
        var _this = this;
        this.image.addEventListener('pointerdown', function (e) {
            _this.image.setPointerCapture(e.pointerId);
            _this.addTouchPointer(e);
        });
        this.image.addEventListener('pointermove', function (e) {
            if (_this.activePoints[e.pointerId]) {
                _this.calculateTouchCore(e);
            }
        });
        this.image.addEventListener('pointercancel', function (e) { return _this.removeTouchPointer(e); });
        this.image.addEventListener('pointerup', function (e) { return _this.removeTouchPointer(e); });
    };
    /* this method init state params  */
    ImageTouchEvents.prototype.initState = function () {
        var initParams = this.image.getBoundingClientRect();
        var that = this;
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
    };
    ImageTouchEvents.prototype.initOutput = function (options) {
        var that = this;
        this.output = {
            zoom: document.querySelectorAll(options.zoom)[0],
            bright: document.querySelectorAll(options.bright)[0],
            vMove: document.querySelectorAll(options.vMove)[0],
            hMove: document.querySelectorAll(options.hMove)[0],
        };
        function setValueToContainer(container, delimiter) {
            return function (value) {
                return container.innerHTML = Math.abs(Math.round(value / delimiter * 100)) + "%";
            };
        }
        this.triggers = {
            zoomCurrent: setValueToContainer(that.output.zoom, 1),
            prevX: setValueToContainer(that.output.vMove, that.options.maxScrollX),
            prevY: setValueToContainer(that.output.hMove, that.options.maxScrollY),
            currentBgFilter: setValueToContainer(that.output.bright, 100),
        };
    };
    ImageTouchEvents.prototype.setOption = function (option, value) {
        this.options[option] = value;
        if (this.triggers[option]) {
            this.triggers[option](value);
        }
    };
    ImageTouchEvents.prototype.getOption = function (option) {
        return this.options[option];
    };
    /* this method handle pointerup action */
    ImageTouchEvents.prototype.addTouchPointer = function (e) {
        var pointCount = Object.keys(this.activePoints).length;
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
    };
    ;
    ImageTouchEvents.prototype.removeTouchPointer = function (e) {
        this.setOption('currentTouchAction', null);
        delete this.activePoints[e.pointerId];
    };
    ;
    /* this method calculate core params  */
    ImageTouchEvents.prototype.calculateTouchCore = function (e) {
        var _this = this;
        if (!this.activePoints[e.pointerId]) {
            return;
        }
        var currentPoint = this.activePoints[e.pointerId];
        var that = this;
        /* throttling */
        var ts = Date.now(), run = ts - currentPoint.prevTs > 4;
        if (!run) {
            return;
        }
        var x = e.x, y = e.y;
        var top = this.getOption('prevY');
        var left = this.getOption('prevX');
        var touchParams = {
            detX: x - currentPoint.prevX,
            detY: y - currentPoint.prevY,
            currentPoint: currentPoint,
            secondPoint: that.getSecondPoint(e.pointerId),
            newPoint: { prevY: y, prevX: x, prevTs: ts }
        };
        var updateState = function () {
            _this.activePoints[e.pointerId] = touchParams.newPoint;
        };
        var newY = (top + touchParams.detY);
        var newX = (left + touchParams.detX);
        var action = this.actionResolver(touchParams);
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
    };
    /* this method calculate ange between new and old points */
    ImageTouchEvents.prototype.calculateAngle = function (pA, pAn, pB) {
        var cosA, aV, bV;
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
    };
    ;
    /* this method define current action */
    ImageTouchEvents.prototype.actionResolver = function (options) {
        var currentAction = this.getOption('currentTouchAction');
        var touchCount = Object.keys(this.activePoints).length;
        /* when 2 finders on the device we will once define touch action */
        if (currentAction !== null) {
            return currentAction;
        }
        if (touchCount === 1) {
            this.setOption('currentTouchAction', 'swipe');
            currentAction = 'swipe';
            /* when 2 finders on the device we not updating x and y, to collect detX and detY to define angle*/
        }
        else if (touchCount === 2 && ((Math.abs(options.detX) + Math.abs(options.detY) > 30))) {
            var angle = this.calculateAngle(options.currentPoint, options.newPoint, options.secondPoint);
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
    };
    ImageTouchEvents.prototype.getSecondPoint = function (firstPointId) {
        for (var pointId in this.activePoints) {
            if (this.activePoints.hasOwnProperty(pointId)) {
                if (Number(pointId) !== Number(firstPointId)) {
                    return this.activePoints[pointId];
                }
            }
        }
    };
    ;
    ImageTouchEvents.prototype.handleSwipe = function (newX, newY, detY) {
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
    };
    ImageTouchEvents.prototype.handlePinch = function (currentPoint, newPoint, secondPoint) {
        var fromVector = {
            x: currentPoint.prevX - secondPoint.prevX,
            y: currentPoint.prevY - secondPoint.prevY
        };
        var toVector = {
            x: newPoint.prevX - secondPoint.prevX,
            y: newPoint.prevY - secondPoint.prevY
        };
        var lengthFrom = Math.sqrt(Math.pow(fromVector.x, 2) + Math.pow(fromVector.y, 2));
        var lengthTo = Math.sqrt(Math.pow(toVector.x, 2) + Math.pow(toVector.y, 2));
        var trackDiff = lengthTo - lengthFrom;
        var zoom;
        if (trackDiff > 0) {
            zoom = Math.min(this.getOption('zoomMax'), this.getOption('zoomCurrent') + 4 / 100);
        }
        else {
            zoom = Math.max(this.getOption('zoomMin'), this.getOption('zoomCurrent') - 4 / 100);
        }
        this.setOption('zoomCurrent', zoom);
        this.image.style.zoom = zoom;
    };
    ImageTouchEvents.prototype.handleRotate = function (detX, detY) {
        var angle = Math.atan(detX / detY) * 180 / Math.PI;
        var bgFilter;
        if (angle < 0) {
            bgFilter = Math.max(1, this.getOption('currentBgFilter') + angle / 15);
        }
        else {
            bgFilter = Math.min(100, this.getOption('currentBgFilter') + angle / 15);
        }
        this.setOption('currentBgFilter', bgFilter);
        image.style.filter = 'brightness(' + bgFilter + '%)';
    };
    ;
    return ImageTouchEvents;
}());
var image = document.querySelectorAll('#touch-image > img')[0];
var options = {
    bright: '#bright',
    zoom: '#zoom',
    vMove: '#vMove',
    hMove: '#hMove'
};
if (image) {
    new ImageTouchEvents(image, options);
}
