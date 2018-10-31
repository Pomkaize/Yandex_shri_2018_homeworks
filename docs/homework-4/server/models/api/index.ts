import {Events, events} from "./events";

export interface Api {
    events: Events
}

function apiInit() {
    return {
        events: events
    }
}

export const api = apiInit();