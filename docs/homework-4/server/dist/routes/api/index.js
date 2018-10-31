"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const events_1 = require("./events");
const router = express.Router();
function apiRouter(router) {
    router.post('/events', events_1.eventsRoute);
    return router;
}
exports.default = apiRouter(router);
//# sourceMappingURL=index.js.map