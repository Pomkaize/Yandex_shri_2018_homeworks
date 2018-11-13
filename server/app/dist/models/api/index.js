"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("./events");
const player_1 = require("./player");
function apiInit() {
    return {
        events: events_1.events,
        player: player_1.player
    };
}
exports.api = apiInit();
//# sourceMappingURL=index.js.map