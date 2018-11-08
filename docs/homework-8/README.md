## Восьмое задание. Архитектура

### Интеракцивный элемент в проекте - музыкальный плеер, работает с внутренним сервером
#### Запуск
Сервер
1) в директории ./docs/homework-4/ npm run start <br/>
И можно смотреть [Демо](https://pomkaize.github.io/shri-homework/homework-8(client)/index.html)<br/>
Или запустить клиент локлаьно
2) в директории ./client npm run watch1 <br/>
Чекаем на http://localhost:3000/
Исходный [код](https://github.com/Pomkaize/shri-homework/tree/master/client/src/framework) фреймворка<br/>
Исходный [код](https://github.com/Pomkaize/shri-homework/blob/master/client/src/components/library/player/player.ts) плеера <br/>
Структура папок страдает, поправлю :)

Добавил взаимодействие с сервером по JSON, чтобы получить информацию о новом треке, отрисовал результаты с прелоадером

### Описание flux-фреймворка
#### Фреймворк состоит из 3 частей,
1. Store.ts - содержит логику работы с хранилищем состояния
2. StoreHandler.ts - содержит класс обработчика хранилища
3. MultipleDispatch.ts - сахарок, позволяющий создавать сложные экшены, основанные на базовых

#### Создание объекта store
```js
const store = new Store(initialState, storeHandlers, views)
```
**initialState** - объект начальных параметров<br/>
**storeHandlers** - массив обработчиков хранилища, о том как писать обработчики ниже<br/>
**views** - массив функции представления, будут вызваны после каждого успешного обновления хранилища, о том как их
писать ниже

#### Создание обработчиков хранилища storeHandler (аналог Reducer в Redux)
```js
const storeHandler = {
    name: string,
    sync: boolean,
    handler: (data, state, done)=> {
        done(newState)
    }
}
```
**name** - название, идендификатор обработчика<br/>
**sync** - параметр, используемый при вызове меотда store.multipleDispatch() , определяет в какой
очереди будет исполнена функция, сихнронной или асинхронной<br/>
**handler** - функция обработчик хранилища, может быть как синхронной, так и асинхронной, работает от аргументов:<br/>
**data** - параметры, пришедшие от action<br/>
**state** - текущее состояние<br/>
**done** - функция, которая должна быть вызвана с новой частью хранилища, например done({open:true}), измнит поле open в
  хранилище на true

#### Создание view
```js
function myCustomButton(state) {
    button.innerHTML = state.text
}
```

#### Создание action
```js
const action = () => store.dispatch({
    action_type: string
    data: any
});
```
После вызова action, в хранилище будет найдет обработчик с именем, переданным в поле action_type, и будет исполнен.

#### Пример использования
```js

const SUBMIT_FORM = 'SUBMIT_FORM'
const form = document.getElementById('#form');

// Обаботчик для хранилища
const submitFormHandler = {
    name: SUBMIT_FORM,
    sync: true,
    handler: (data, state, done) => {
        done({form:{value: data.value, sended: true}})
    }
};

// View
const viewForm = (state) => {
    ....
}

// Начальное состояние
const initialState = {
    form: {
        sended: false,
        value: null
    }
}

// Хранилище
const store = new Store(initialState, [submitFormHandler], [viewForm])

// Action
const onSubmit = (value)=>store.dispatch({
    action_type: SUBMIT_FORM,
    data: { value: value }
})

// Вешаем обработчика на DOM элемент
form.onsubmit = onSubmit

```

#### Описание метода store.multipleDispatch
Не всегда action бывают простыми, например, мы хотим создать такой action, который бы сначала изменил что-то
синхронно, потом выполнил что-то в асинхронном режиме и закончил синхронной операцией. Это классический пример при
работе с запросами, мы вызываем какой-нибудь прелоадер, отправляем запрос на сервер и, когда последний
пришел, убираем этот прелоадер. Для реализации таких задач и был дописан этот метод.
Пояснение за поле **sync** в обработчиках: если **sync: true**, тогда, например, 10 подряд идущих обработчиков будут
обработаны
строго друг за другом, не будет пропусков, даже если там асинхронные функции (написано на
генераторе). Если **sync: false**, значит такой обработчик будет вызван асинхронно, результат его работы запомнен, а
потом
склеен с другими асинхронными результатами и последним сихнронным action. Это важно. Ниже я приведу пример, где уместна
и не уместна такая логика.

#### Классический пример взаимодействия по сети
```js
const preloaderToggleHandler = {
    name: 'PRELOADER_TOGGLE',
    sync: true,
    handler: (data, state, done) => {
        done({preloader: !state.preloader})
    }
};

const getImageHandler = {
    name: 'GET_IMAGE',
    sync: true,
    handler:  (data, state, done) => {
        fetch(...).then(result=>done(result))
    }
}
// Собственно сам сложный action
const getImage = () => store.dispatch([
    {
        action_type: 'PRELOADER_TOGGLE'
    },
    {
        action_type: 'GET_IMAGE'
    },
    {
        action_type: 'PRELOADER_TOGGLE'
    }
])
```
#### Пояснение где необходимо применять sync:true
Допустим у нас интернет магазин, написан обработчик для получения конкретного продукта по его id и обработчик для
получения фотографий по полю product_image_id. Мы не можем получить фотографии, пока поле product_image_id не
придет в первом запросе, необходимо все запросы отсылать синхронно, так так следующий зависит от результатов
предыдущего
#### Пояснение где необходимо применять sync:false
Допустим у нас все тот же интернет магазин, написан обработчик для получения конкретного продукта и обработчик для
получения текущего курса валют, эти данные не связаны и скорее всего записаны с хранилище в разных полях, нет
необходимости ждать, пока запросы будут друг-друга пинать,
поэтому мы запускаем их асинхронно, и запоминаем результат выполнения, потом склеим и отдадим с последним синхронным
```js
const preloaderToggleHandler = {
    name: 'PRELOADER_TOGGLE',
    sync: true,
    handler: (data, state, done) => {
        done({preloader: !state.preloader})
    }
};

const getProductHandler = {
    name: 'GET_PRODUCT',
    sync: false,
    handler:  (data, state, done) => {
        fetch(...).then(result=>done(result))
    }
}

const getExchangeRatesHandler = {
    name: 'GET_EXCHANGE_RATES',
    sync: false,
    handler:  (data, state, done) => {
        fetch(...).then(result=>done(result))
    }
}
// Собственно сам сложный action
const getData = () => store.dispatch([
    {
        action_type: 'PRELOADER_TOGGLE'
    },
    {
        action_type: 'GET_PRODUCT'
    },
    {
        action_type: 'GET_EXCHANGE_RATES'
    },
    {
        action_type: 'PRELOADER_TOGGLE'
    }
])
```