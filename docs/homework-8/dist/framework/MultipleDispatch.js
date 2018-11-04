"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MultipleDispatch {
    constructor(options) {
        this.id = options.id;
        this.dispatches = options.dispatches;
        this.handlers = options.storeHandlers;
        this.syncQueue = [];
        this.asyncQueue = [];
        this.statePoints = {};
        this.lastSyncDispatchState = null;
        this.asyncQueueDone = true;
        this.operationId = 0;
        this.temporaryState = Object.assign({}, options.state);
        this.state = options.state;
        this.getOperationId = this.getOperationId.bind(this);
        this.done = options.done;
        this.doneSync = this.doneSync.bind(this);
        this.doneAsync = this.doneAsync.bind(this);
        this.makeQueues();
        this.runQueues();
    }
    /* Формируем 2 очереди, зависимую от потока - синхронную и независимую от сосстояния - асинхронную */
    makeQueues() {
        this.dispatches.map((dispatch) => {
            const operationId = this.getOperationId();
            if (this.handlers[dispatch.action_type].isSync()) {
                this.syncQueue.push(withOperationId(dispatch, operationId));
            }
            else {
                this.asyncQueue.push(withOperationId(dispatch, operationId));
                this.statePoints[operationId] = null;
            }
        });
    }
    /* Запускаем очереди */
    runQueues() {
        this.asyncQueueRun();
        this.syncQueueRun();
    }
    /* Метод, сигнализирующий о завершении синхронной операции*/
    doneSync(state) {
        const withAsyncAction = !!this.asyncQueue.length;
        const lastSyncAction = this.currentSyncDispatcher.operationId === this.syncQueue[this.syncQueue.length - 1].operationId;
        if (!withAsyncAction) {
            this.state = this.done(state);
        }
        else if (withAsyncAction && !lastSyncAction) {
            this.state = this.done(state);
        }
        else if (this.isAsyncQueueDone() && lastSyncAction) {
            this.done(this.concatenateAsyncAndSyncState(state));
        }
        else {
            this.lastSyncDispatchState = state;
        }
        this.statePoints[this.currentSyncDispatcher.operationId] = state;
        /* Выбрасываем из общего стека исполнения, иначе будет вызвана до yield */
        global.setTimeout(() => this.syncGenerator.next(), 0);
        return this.state;
    }
    /* Запускатель синхронной очереди */
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
    /* Метод сохраняет результат асинхронной операции и передает его основному хранилищу */
    doneAsync(state, operationId) {
        this.statePoints[operationId] = Object.assign({}, this.state, state);
        if (this.isAsyncQueueDone() && this.lastSyncDispatchState) {
            this.done(this.concatenateAsyncAndSyncState(this.lastSyncDispatchState));
        }
        else if (this.isAsyncQueueDone() && this.syncQueue.length === 0) {
            this.done(this.concatenateAsyncAndSyncState());
        }
    }
    /* Запускатель асинхронной очереди */
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
    /* Чекер, что асинхронные операции завершились */
    isAsyncQueueDone() {
        for (let operationId in this.statePoints) {
            if (this.statePoints[operationId] === null) {
                return false;
            }
        }
        return true;
    }
    /* Склеиваем слепки состояния от асинхронных операций в порядке их вызова */
    concatenateAsyncAndSyncState(syncState = {}) {
        for (let operationId in this.statePoints) {
            this.temporaryState = Object.assign({}, this.temporaryState, this.statePoints[operationId]);
        }
        return Object.assign({}, this.temporaryState, syncState);
    }
    getOperationId() {
        return this.operationId++;
    }
}
exports.MultipleDispatch = MultipleDispatch;
function withOperationId(object, operationId) {
    object.operationId = operationId;
    return object;
}
//# sourceMappingURL=MultipleDispatch.js.map