import {iStoreHandler} from "./framework/StoreHandler";
import {iState, Store} from "./framework/Store";

const enableButton:iStoreHandler = {
    name: 'ENABLE_BUTTON',
    sync: false,
    handler: (data, state, done)=> {
        done({button: 'button'})
    }
};

const addCounter: iStoreHandler = {
    name: 'ADD_COUNTER',
    sync: true,
    handler: (data, state, done) => {
        done({test: '1234', counter: data})
    }
};

const addCounter2: iStoreHandler = {
    name: 'ADD_COUNTER2',
    sync: true,
    handler: (data, state, done) => {
        global.setTimeout(()=>done({open: true, counter: data }), 2500)
    }
};
const addCounter3: iStoreHandler = {
    name: 'ADD_COUNTER3',
    sync: true,
    handler: (data, state, done) => {
        global.setTimeout(()=>done({open: false, counter: data, async:123 }), 2500)
    }
};

const action = () => store.dispatch({
    action_type: 'ENABLE_BUTTON'
});

const multipleAction = () => store.multipleDispatch([
    {
        action_type: 'ADD_COUNTER',
        data: 33,
    },
    {
        action_type: 'ADD_COUNTER',
        data: 11,
    },
    {
        action_type: 'ADD_COUNTER2',
        data: 999,
    },
    {
        action_type: 'ADD_COUNTER3',
        data: 123
    }
]);

const store = new Store({ open: true, counter:1 }, [enableButton, addCounter, addCounter2, addCounter3], [view1]);

function view1 (state:iState) {
    global.console.log(state)
}

multipleAction();

/*
action();*/
