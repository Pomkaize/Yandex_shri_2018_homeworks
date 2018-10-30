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
