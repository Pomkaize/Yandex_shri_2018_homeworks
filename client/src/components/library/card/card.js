"use strict";
if (globalHelper.checkTouchDevice()) {
    const touchElements = document.querySelector('.touch_elements');
    if (touchElements) {
        touchElements.style.display = 'flex';
    }
}
