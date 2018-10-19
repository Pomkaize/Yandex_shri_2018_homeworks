const fs = require('fs');

let rawdata = fs.readFileSync('events.json');
let events = JSON.parse(rawdata);

module.exports = {
    settings: {
      title: 'Яндекс дом',
      copyright: "© 2001-2018 ООО «Яндекс»",
      imagesFolder: '../images/compressed/'  // path in build folder
    },
    header: {
        menu: [
            {
                name: 'Сводка',
                href: '#'
            },
            {
                name: 'Устройства',
                href: '#'},
            {
                name: 'Сценарии',
                href: '#'},
        ],
    },
    tape: {
        title: 'Лента событий',
        cards: events.events
    },
    footer: {
        menu: [
            {
                name: 'Помощь',
                href: '#'
            },
            {
                name: 'Обратная связь',
                href: '#'
            },
            {
                name: 'Разработчикам',
                href: '#'
            },
            {
                name: 'Условия использования',
                href: 'https://wiki.yandex.ru/shri-2018-II/homework/Adaptivnaja-vjorstka/.files/license.pdf'
            }
        ]
    },
};


