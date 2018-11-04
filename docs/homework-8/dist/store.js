"use strict";
/* Хранилище состояния */
class Store {
    constructor(initialState, storeHandlers, views) {
        this.state = Object.assign({}, initialState);
        this.temporaryState = null;
        this.views = views;
        this.lastDispatchId = 0;
        this.storeHandlers = {};
        storeHandlers.map((storeHandler) => {
            this.storeHandlers[storeHandler.name] = new StoreHandler(storeHandler);
        });
        this.allocateState();
        this.multipleDispatchQueue = [];
        this.done = this.done.bind(this);
        this.temporaryDone = this.temporaryDone.bind(this);
    }
    /* Метод, который производить ищет и запускает необходимый обработик */
    updateStore(dispatch) {
        this.storeHandlers[dispatch.action_type].run(dispatch.data, this.state, this.done);
    }
    /* Единственный метод,который может изменить состояние */
    done(state) {
        this.state = Object.assign({}, this.state, state);
        this.allocateState();
    }
    temporaryDone(state) {
        if (!this.temporaryState) {
            this.temporaryState = Object.assign({}, this.state, state);
        }
        else {
            this.temporaryState = Object.assign({}, this.temporaryState, state);
        }
    }
    /* диспатчер, обычный, для сихнорнных и асинхронных действий */
    dispatch(dispatch) {
        this.updateStore(dispatch);
    }
    /* сложный диспатчер, содан для объединения сценариев, выполнения последовательности storeHandler */
    multipleDispatch(dispatches) {
        const handlers = {};
        dispatches.map((dispatch) => {
            handlers[dispatch.action_type] = this.storeHandlers[dispatch.action_type];
        });
        const multipleDispatchOptions = {
            state: this.state,
            dispatches,
            storeHandlers: handlers,
            id: this.getDispatchId(),
            done: this.done
        };
        const multipleDispatch = new MultipleDispatch(multipleDispatchOptions);
        this.multipleDispatchQueue.push(multipleDispatch);
    }
    allocateState() {
        this.views.map((view) => {
            view(this.state);
        });
    }
    getDispatchId() {
        return this.lastDispatchId++;
    }
}
class MultipleDispatch {
    constructor(options) {
        this.id = options.id;
        this.dispatches = options.dispatches;
        this.handlers = options.storeHandlers;
        this.syncQueue = [];
        this.asyncQueue = [];
        this.statePoints = {};
        this.operationId = 0;
        this.temporaryState = Object.assign({}, options.state);
        this.state = options.state;
        this.getOperationId = this.getOperationId.bind(this);
        this.doneSync = this.doneSync.bind(this);
        this.makeQueues();
        this.runQueues();
    }
    /* Формируем 2 очереди, зависимую от потока - синхронную и независимую от сосстояния - асинхронную */
    makeQueues() {
        this.dispatches.map((dispatch) => {
            const operationId = this.getOperationId();
            if (dispatch.waitBeforeDone || this.handlers[dispatch.action_type].isSync()) {
                this.syncQueue.push(withOperationId(dispatch, operationId));
            }
            else {
                this.asyncQueue.push(withOperationId(dispatch, operationId));
            }
        });
    }
    /* Запускаем очереди */
    runQueues() {
        this.asyncQueueRun();
        this.syncQueueRun();
    }
    doneSync(state) {
        this.state = Object.assign({}, this.state, state);
        this.statePoints[this.currentSyncDispatcher.operationId] = state;
        global.console.log(this.statePoints, 'state points multiply sync');
        /* Выбрасываем из общего стека исполнения, иначе будет вызвана до yield */
        global.setTimeout(() => this.syncGenerator.next(), 0);
    }
    syncQueueRun() {
        const that = this;
        const syncGenerator = function* () {
            let index = 0;
            while (index <= that.syncQueue.length - 1) {
                const currentDispatcher = that.syncQueue[index];
                that.currentSyncDispatcher = currentDispatcher;
                that.handlers[currentDispatcher.action_type].run(currentDispatcher.data, that.state, that.doneSync);
                yield index++;
            }
        };
        this.syncGenerator = syncGenerator();
        this.syncGenerator.next();
    }
    doneAsync(state, operationId) {
        this.statePoints[operationId] = Object.assign({}, this.state, state);
        global.console.log(this.statePoints, 'state points multiply async');
    }
    asyncQueueRun() {
        const that = this;
        this.asyncQueue.map((dispatcher) => {
            const currentAsyncDispatcher = dispatcher;
            let promise = new Promise((resolve, reject) => {
                that.handlers[dispatcher.action_type].run(dispatcher.data, that.state, resolve);
            });
            promise.then(state => that.doneAsync(state, currentAsyncDispatcher.operationId));
        });
    }
    getOperationId() {
        return this.operationId++;
    }
}
function withOperationId(object, operationId) {
    object.operationId = operationId;
    return object;
}
class StoreHandler {
    constructor(storeHandler) {
        this.handler = storeHandler.handler;
        this.sync = storeHandler.sync;
    }
    run(object, state, done) {
        this.handler(object, state, done);
    }
    isSync() {
        return this.sync;
    }
}
const enableButton = {
    name: 'ENABLE_BUTTON',
    sync: true,
    handler: (data, state, done) => {
        done({ open: !state.open });
    }
};
const addCounter = {
    name: 'ADD_COUNTER',
    sync: true,
    handler: (data, state, done) => {
        done({ test: '1234', counter: data });
    }
};
const addCounter2 = {
    name: 'ADD_COUNTER2',
    sync: false,
    handler: (data, state, done) => {
        setTimeout(() => done({ open: true, counter: data }), 1000);
    }
};
const addCounter3 = {
    name: 'ADD_COUNTER3',
    sync: false,
    handler: (data, state, done) => {
        setTimeout(() => done({ open: true, counter: data, async: 123 }), 100);
    }
};
const action = () => store.dispatch({
    action_type: 'ENABLE_BUTTON'
});
const action2 = () => store.dispatch({
    action_type: 'ADD_COUNTER',
    data: 451
});
const action3 = () => store.dispatch({
    action_type: 'ADD_COUNTER2',
    data: 123
});
const multipleAction = () => store.multipleDispatch([
    {
        action_type: 'ADD_COUNTER',
        data: 33,
        remember: false,
        waitBeforeDone: false
    },
    {
        action_type: 'ADD_COUNTER',
        data: 11,
        remember: false,
        waitBeforeDone: false
    },
    {
        action_type: 'ADD_COUNTER2',
        data: 123,
        remember: false,
        waitBeforeDone: false
    },
    {
        action_type: 'ADD_COUNTER3',
        data: 123,
        remember: false,
        waitBeforeDone: false
    }
]);
const store = new Store({ open: true, counter: 1 }, [enableButton, addCounter, addCounter2, addCounter3], [view1]);
function view1(state) {
    global.console.log(state);
}
/*action3();
action();
action2();*/
multipleAction();
//# sourceMappingURL=store.js.map