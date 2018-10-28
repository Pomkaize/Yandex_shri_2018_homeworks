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
const globalHelper = (function Helper() {

    function getViewPortSizes() {
        const w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        const h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        return [w,h]
    }

    function clampTitles() {
        let titles = document.querySelectorAll('.card_header__title > h3');
            titles.forEach(function (title) {
                $clamp(title, {clamp: 2, useNativeClamp: true});
            })

    }

    function checkTouchDevice() {
            const prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
            const mq = function(query) {
                return window.matchMedia(query).matches;
            }

            if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
                return true;
            }

            const query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
            return mq(query);
    }

    return {
        getViewPortSizes: getViewPortSizes,
        checkTouchDevice: checkTouchDevice,
        clampTitles: clampTitles,
    }
})();

globalHelper.clampTitles();






/*$('.header__container').on('click', toggleHeader);*/

const headerContainer = document.querySelectorAll('.header__container')[0].addEventListener('click', toggleHeader);

function toggleHeader() {
    if(globalHelper.getViewPortSizes()[0] < 630)
    {
        var menu = document.querySelectorAll('.menu_list_header')[0];
        if(menu.classList.contains('animation_slide_on')) {

            menu.classList.remove('animation_slide_on');
            menu.classList.add('animation_slide_off');
            setTimeout(function() {
                menu.classList.remove('animation_slide_off', 'menu_list_item_header--active')
            }, 300)
        }
        else {
            menu.classList.add('animation_slide_on', 'menu_list_item_header--active');
        }

    }
}
if(globalHelper.checkTouchDevice()) {
    const touchElements = document.querySelector('.touch_elements');
    touchElements.style.display = 'flex'
}
const menuItems = document.querySelectorAll('.menu_list_item_header');
      menuItems.forEach(function(menuItem) {
          menuItem.addEventListener('click', onMenuItemClick, true);
      });

function onMenuItemClick(e) {
    let active = document.querySelectorAll('.menu_list_item_header--active')[0];
    active.classList.remove('menu_list_item_header--active');
    e.target.parentElement.classList.add('menu_list_item_header--active');
    toggleHeader();
    e.stopPropagation();
}
class ImageTouchEvents {

  constructor(image, options) {
    this.image = image;
    this.parent = image.parentElement;

    this.image.onload = () => {
      this.initListeners();
      this.initState();
      this.initOutput(options)
    };
  }

  initListeners() {
    this.image.addEventListener('pointerdown', (e) => {
      this.image.setPointerCapture(e.pointerId);
      this.addTouchPointer(e)
    });

    this.image.addEventListener('pointermove', (e) => {
      if (this.activePoints[e.pointerId]) {
        this.calculateTouchCore(e);
      }
    });

    this.image.addEventListener('pointercancel', (e)=>this.removeTouchPointer(e));
    this.image.addEventListener('pointerup', (e)=>this.removeTouchPointer(e))
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

  initOutput(options) {

    const that = this;

    this.output = {
      zoom: document.querySelectorAll(options.zoom)[0],
      bright:  document.querySelectorAll(options.bright)[0],
      vMove:  document.querySelectorAll(options.vMove)[0],
      hMove:  document.querySelectorAll(options.hMove)[0],
    };

    function setValueToContainer(container, delimiter) {
      return function(value) {
        return container.innerHTML = `${Math.abs(Math.round(value/delimiter*100))}%`;
      };
    }

    this.triggers = {
      zoomCurrent: setValueToContainer(that.output.zoom, 1),
      prevX: setValueToContainer(that.output.vMove, that.options.maxScrollX),
      prevY: setValueToContainer(that.output.hMove, that.options.maxScrollY),
      currentBgFilter: setValueToContainer(that.output.bright, 100),
    }
  }


  setOption(option, value) {
    this.options[option] = value;
    if(this.triggers[option]) {
      this.triggers[option](value);
    }
  }

  getOption(option) {
    return this.options[option];
  }
  /* this method handle pointerup action */
  addTouchPointer(e) {

    let pointCount = Object.keys(this.activePoints).length;

    if(pointCount > 1) {
      return
    }
    this.activePoints[e.pointerId] = {
      prevX: e.x,
      prevY: e.y,
      startX: e.x,
      startY: e.y,
      prevTs: Date.now(),
    };
  };

  removeTouchPointer(e) {
    this.setOption('currentTouchAction' , null);
    delete this.activePoints[e.pointerId];
  };
  /* this method calculate core params  */
  calculateTouchCore(e) {
    if (!this.activePoints[e.pointerId]) {
      return;
    }

    const currentPoint = this.activePoints[e.pointerId];
    const that = this;

    /* throttling */
    const ts = Date.now(),
      run = ts - currentPoint.prevTs > 4;

    if(!run) {
      return;
    }

    const {x, y} = e;
    const top = this.getOption('prevY');
    const left = this.getOption('prevX');

    const touchParams = {
      detX: x - currentPoint.prevX,
      detY: y - currentPoint.prevY,
      currentPoint: currentPoint,
      secondPoint: that.getSecondPoint(e.pointerId),
      newPoint: { prevY: y, prevX: x, prevTs: ts }
    };

    const updateState = () => {
      this.activePoints[e.pointerId] = touchParams.newPoint;
    };

    const newY = (top + touchParams.detY);
    const newX = (left + touchParams.detX);


    let action = this.actionResolver(touchParams);

    if(action === null)
    {
      return;
    }

    this.setOption('currentTouchAction', action);

    switch (action) {
      case 'swipe' : { this.handleSwipe(newX, newY, touchParams.detY);
        updateState();}
        break;
      case 'pinch' : { this.handlePinch(touchParams.currentPoint, touchParams.newPoint,
        touchParams.secondPoint); updateState(); }
        break;
      case 'rotate' : { this.handleRotate(touchParams.detX, touchParams.detY) }
      default: {
        return;
      }
    }
  }
  /* this method calculate ange between new and old points */
  calculateAngle(pA, pAn, pB) {

    let cosA, aV, bV;

    if(!(pA.prevX - pAn.prevX + pA.prevY - pA.prevY))
    {
      return 1;

    } else {

      aV = {
        x: pA.prevX - pB.prevX,
        y: pA.prevY - pB.prevY
      };

      bV = {
        x: pAn.prevX - pB.prevX,
        y: pAn.prevY - pB.prevY
      };
      cosA = (aV.x * bV.x + aV.y * bV.y)
        /Math.sqrt(Math.pow(aV.x, 2) + Math.pow(aV.y, 2))
        /Math.sqrt(Math.pow(bV.x, 2) + Math.pow(bV.y, 2));
    }

    return Math.acos(cosA) * 180 / Math.PI;
  };
  /* this method define current action */
  actionResolver(options) {
    let currentAction = this.getOption('currentTouchAction');

    let touchCount = Object.keys(this.activePoints).length;
    /* when 2 finders on the device we will once define touch action */
    if(currentAction !== null)
    {
      return currentAction;
    }

    if(touchCount === 1) {
      this.setOption('currentTouchAction', 'swipe');
      currentAction = 'swipe'
      /* when 2 finders on the device we not updating x and y, to collect detX and detY to define angle*/
    } else if(touchCount === 2 && ((Math.abs(options.detX) + Math.abs(options.detY) > 30)) ) {

      let angle = this.calculateAngle(options.currentPoint, options.newPoint, options.secondPoint);
      /* experimental value */
      if(Math.abs(angle) < 7) {
        this.setOption('currentTouchAction', 'pinch');
        currentAction = 'pinch'
      } else {
        this.setOption('currentTouchAction', 'rotate');
        currentAction = 'rotate';
      }
    }

    return currentAction;
  }

  getSecondPoint(firstPointId) {
    for (let pointId in this.activePoints) {
      if(this.activePoints.hasOwnProperty(pointId)) {
        if(Number(pointId) !== Number(firstPointId))
        {
          return this.activePoints[pointId];
        }
      }
    }
  };

  handleSwipe(newX, newY, detY) {

    /* horizontal parent block boundaries*/
    if(newX <= 0 && Math.abs(newX) <= this.getOption('maxScrollX')) {
      this.image.style.left = newX + 'px';
      this.setOption('prevX', newX);
    }

    /* vertical parent block boundaries*/
    if(((detY < 0 && Math.abs(newY) >= 0) || (detY > 0 && newY <= 0) ) &&
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
    const lengthTo = Math.sqrt(Math.pow(toVector.x, 2) + Math.pow(toVector.y,2));

    const trackDiff = lengthTo - lengthFrom;
    let zoom;

    if(trackDiff > 0) {
      zoom = Math.min(this.getOption('zoomMax'), this.getOption('zoomCurrent') + 4/100);
    } else {
      zoom = Math.max(this.getOption('zoomMin'), this.getOption('zoomCurrent') - 4/100);
    }

    this.setOption('zoomCurrent', zoom);
    this.image.style.zoom = zoom
  }

  handleRotate(detX, detY) {

    let angle = Math.atan(detX/detY) * 180 / Math.PI;

    let bgFilter;
    if(angle < 0) {
      bgFilter = Math.max(1, this.getOption('currentBgFilter') + angle/15)
    } else {
      bgFilter = Math.min(100, this.getOption('currentBgFilter') + angle/15)
    }
    this.setOption('currentBgFilter', bgFilter);
    image.style.filter = 'brightness(' + bgFilter + '%)';
  };

}

let image = document.querySelectorAll('#touch-image > img')[0];

let options = {
  bright: '#bright',
  zoom: '#zoom',
  vMove: '#vMove',
  hMove: '#hMove'
};

new ImageTouchEvents(image, options);