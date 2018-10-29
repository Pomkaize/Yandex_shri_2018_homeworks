const menuItems:NodeListOf<HTMLElement> = document.querySelectorAll('.menu_list_item_header');
      menuItems.forEach(function(menuItem) {
          menuItem.addEventListener('click', onMenuItemClick, true);
      });

function onMenuItemClick(e:Event):void {
    let active:HTMLElement = document.querySelectorAll('.menu_list_item_header--active')[0] as HTMLElement;
    active.classList.remove('menu_list_item_header--active');
    if((e.target as HTMLElement).parentElement) {
        const parent = (e.target as HTMLElement).parentElement;
        if(parent) {
           parent.classList.add('menu_list_item_header--active');
        }
    }
    toggleHeader();
    e.stopPropagation();
}