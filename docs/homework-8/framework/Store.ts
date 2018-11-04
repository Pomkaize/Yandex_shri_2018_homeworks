import {iStoreHandler, StoreHandler, storeHandlers} from "./StoreHandler"
import {iMultipleDispatch, MultipleDispatch, multipleDispatchOptions} from "./MultipleDispatch";

export type view = (state: iState)=>void
export type done = (state: iState)=>iState

export interface iDispatch {
    action_type: string
    [key:string]: any
}

export interface iState {
    [key:string]:any
}
/* Хранилище состояния */
export class Store {

    private state: iState;
    protected views: view[];
    private readonly storeHandlers: storeHandlers;
    protected multipleDispatchQueue: MultipleDispatch[];
    private lastDispatchId: number;

    constructor(initialState: iState, storeHandlers: iStoreHandler[], views: view[]) {
        this.state = { ...initialState };
        this.views = views;
        this.lastDispatchId = 0;
        this.storeHandlers = {};
        storeHandlers.map((storeHandler)=>{
            this.storeHandlers[storeHandler.name] = new StoreHandler(storeHandler);
        });
        this.allocateState();
        this.multipleDispatchQueue = [];
        this.done = this.done.bind(this);
    }
    /* Метод, который ищет и запускает необходимый обработик */
    updateStore(dispatch:iDispatch):void {
        this.storeHandlers[dispatch.action_type].run(dispatch.data, this.state, this.done);
    }
    /* Единственный метод,который может изменить состояние */
   done(state: iState):iState {
        const newState: iState = { ...this.state, ...state };
        this.state = newState ;
        this.allocateState();
        return newState
    }
    /* диспатчер, обычный, для сихнорнных и асинхронных действий */
   dispatch(dispatch:iDispatch):void {
        this.updateStore(dispatch)
    }
    /* сложный диспатчер, содан для объединения сценариев, выполнения последовательности storeHandler */
    multipleDispatch(dispatches:iMultipleDispatch[]):void {
        const handlers: storeHandlers = {};

        dispatches.map((dispatch)=>{
            handlers[dispatch.action_type] =this.storeHandlers[dispatch.action_type]
        });

        const multipleDispatchOptions:multipleDispatchOptions = {
            state: this.state,
            dispatches,
            storeHandlers: handlers,
            id:this.getDispatchId(),
            done: this.done
        };

        const multipleDispatch = new MultipleDispatch(multipleDispatchOptions);
        this.multipleDispatchQueue.push(multipleDispatch)
    }
   /* Распространяем состояние по подписчикам */
   allocateState():void {
        this.views.map((view)=>{
            view(this.state);
        })
    }

    getDispatchId():number {
        return this.lastDispatchId++
    }
}
