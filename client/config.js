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
          href: '/homework-3/'
        },
        {
          name: 'Устройства',
          href: '#'},
        {
          name: 'Сценарии',
          href: '#'},
        {
          name: 'Видеонаблюдение',
          href: '/homework-3/pages/videostreams.html'},
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
  cameras: [
    {
      id: 1,
      url:"http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fsosed%2Fmaster.m3u8"
    },
    {
      id: 2,
      url: 'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fcat%2Fmaster.m3u8',
    },
    {
      id: 3,
      url: 'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fdog%2Fmaster.m3u8',
    },
    {
      id: 4,
      url: 'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fhall%2Fmaster.m3u8'
    }
  ]
};


