"use strict";
var menuItems = document.querySelectorAll('.menu_list_item_header');
menuItems.forEach(function (menuItem) {
    menuItem.addEventListener('click', onMenuItemClick, true);
});
function onMenuItemClick(e) {
    var active = document.querySelectorAll('.menu_list_item_header--active')[0];
    active.classList.remove('menu_list_item_header--active');
    e.target.parentElement.classList.add('menu_list_item_header--active');
    toggleHeader();
    e.stopPropagation();
}
