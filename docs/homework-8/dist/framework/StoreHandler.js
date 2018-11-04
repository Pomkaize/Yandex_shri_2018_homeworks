"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.StoreHandler = StoreHandler;
//# sourceMappingURL=StoreHandler.js.map