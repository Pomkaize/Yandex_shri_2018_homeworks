import {Events, events} from "./events";
import {player} from "./player";

export interface Api {
    events: Events
}

function apiInit() {
    return {
        events: events,
        player: player
    }
}

export const api = apiInit();