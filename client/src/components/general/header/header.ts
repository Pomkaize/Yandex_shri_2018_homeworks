function toggleHeader(): void {
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