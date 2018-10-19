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





