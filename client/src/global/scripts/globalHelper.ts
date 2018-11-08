
interface GlobalHelper {
    getViewPortSizes():[number, number];
    checkTouchDevice():boolean,
    clampTitles():void
}
declare function $clamp(text: Element, object: object):void


export const globalHelper:GlobalHelper = (function Helper() {

    function getViewPortSizes():[number, number] {
        const w:number = Math.max(document.documentElement!.clientWidth, window.innerWidth || 0);
        const h:number = Math.max(document.documentElement!.clientHeight, window.innerHeight || 0);
        return [w,h]
    }

    function clampTitles():void {
        let titles:NodeListOf<Element> = document.querySelectorAll('.card_header__title > h3');
        titles.forEach(function (title) {
            $clamp(title, {clamp: 2, useNativeClamp: true});
        })

    }

    function checkTouchDevice():boolean {
        const prefixes:Array<string> = ' -webkit- -moz- -o- -ms- '.split(' ');
        const mq = function(query:string):boolean {
            return window.matchMedia(query).matches;
        };

        if (('ontouchstart' in window)) {
            return true;
        }

        const query:string = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
        return mq(query);
    }

    return {
        getViewPortSizes: getViewPortSizes,
        checkTouchDevice: checkTouchDevice,
        clampTitles: clampTitles,
    }
})();

globalHelper.clampTitles();