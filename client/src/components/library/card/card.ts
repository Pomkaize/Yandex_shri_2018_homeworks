import {globalHelper} from "../../../global/scripts/globalHelper";

if(globalHelper.checkTouchDevice()) {
    const touchElements:HTMLElement|null = document.querySelector('.touch_elements');
    if(touchElements) {
        touchElements.style.display = 'flex'
    }
}