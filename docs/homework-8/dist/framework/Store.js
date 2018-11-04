"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StoreHandler_1 = require("./StoreHandler");
const MultipleDispatch_1 = require("./MultipleDispatch");
/* Хранилище состояния */
class Store {
    constructor(initialState, storeHandlers, views) {
        this.state = Object.assign({}, initialState);
        this.views = views;
        this.lastDispatchId = 0;
        this.storeHandlers = {};
        storeHandlers.map((storeHandler) => {
            this.storeHandlers[storeHandler.name] = new StoreHandler_1.StoreHandler(storeHandler);
        });
        this.allocateState();
        this.multipleDispatchQueue = [];
        this.done = this.done.bind(this);
    }
    /* Метод, который ищет и запускает необходимый обработик */
    updateStore(dispatch) {
        this.storeHandlers[dispatch.action_type].run(dispatch.data, this.state, this.done);
    }
    /* Единственный метод,который может изменить состояние */
    done(state) {
        const newState = Object.assign({}, this.state, state);
        this.state = newState;
        this.allocateState();
        return newState;
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
        const multipleDispatch = new MultipleDispatch_1.MultipleDispatch(multipleDispatchOptions);
        this.multipleDispatchQueue.push(multipleDispatch);
    }
    /* Распространяем состояние по подписчикам */
    allocateState() {
        this.views.map((view) => {
            view(this.state);
        });
    }
    getDispatchId() {
        return this.lastDispatchId++;
    }
}
exports.Store = Store;
//# sourceMappingURL=Store.js.map