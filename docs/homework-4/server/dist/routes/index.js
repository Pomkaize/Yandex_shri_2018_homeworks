"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const status_1 = require("./status");
const api_1 = require("./api");
const router = express.Router();
const routes = function (router) {
    /* api handler*/
    router.use('/api', api_1.default);
    /* status handler */
    router.use('/status', status_1.default);
    return router;
};
exports.default = routes(router);
//# sourceMappingURL=index.js.map