"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const helper_1 = require("../lib/helper");
const router = express.Router();
function statusRoute(router) {
    router.post('/', function (req, res, next) {
        /* calculate params from difference */
        const now = new Date();
        const startTime = req.app.get('startTime');
        const workingTime = Number(now) - startTime;
        const seconds = Math.floor((workingTime / 1000) % 60);
        const minutes = Math.floor((workingTime / (1000 * 60)) % 60);
        const hours = Math.floor((workingTime / (1000 * 60 * 60)) % 60);
        const result = `${helper_1.get2Digit(hours)}:${helper_1.get2Digit(minutes)}:${helper_1.get2Digit(seconds)}`;
        res.status(200).json({ status: 'ok', runtime: result });
    });
    return router;
}
exports.default = statusRoute(router);
//# sourceMappingURL=status.js.map