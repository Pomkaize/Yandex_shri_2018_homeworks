import {done, iState} from "./Store";

export interface iStoreHandler {
    name: string,
    sync: boolean,
    handler: (object: iState, state: iState, done:done)=>void
}

export type storeHandlers = {[key:string]: StoreHandler}

export class StoreHandler {
    private readonly handler: (object: iState, state: iState, done: done) => void;
    private readonly sync: boolean;
    constructor(storeHandler: iStoreHandler) {
        this.handler = storeHandler.handler;
        this.sync = storeHandler.sync;
    }

    run(object: iState, state: iState, done: done) {
        this.handler(object,state,done);
    }

    isSync() {
        return this.sync
    }

}