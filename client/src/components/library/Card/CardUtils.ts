import {globalHelper} from "../../../global/scripts/globalHelper";
/* На карточках включаем тач элементы */
if(globalHelper.checkTouchDevice()) {
    const touchElements:HTMLElement|null = document.querySelector('.touch_elements');
    if(touchElements) {
        touchElements.style.display = 'flex'
    }
}