"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../../models");
function eventsRoute(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let events = yield models_1.db.models.api.events.get();
        const allowedEventTypes = {
            info: true,
            critical: true
        };
        /* types checks*/
        if (!req.body.type || !Array.isArray(req.body.type) || req.body.type.length === 0) {
            return res.status(400).json({ status: 'failed', message: `Bad types: \'${req.body.type}\'` });
        }
        const types = req.body.type;
        const pagination = req.body.pagination || null;
        /* check allowed types */
        types.forEach(function (type) {
            if (!allowedEventTypes[type]) {
                return res.status(400).json({ status: 'failed', message: `Bad type: \'${type}\'` });
            }
        });
        /* pagination checks */
        if (pagination) {
            if (!pagination.from) {
                return res.status(400).json({ status: 'failed', message: `Required parameter \'from'
              \ is empty` });
            }
        }
        /* filtered by certain type and from certain position */
        let result = events.filter((event, index) => {
            if (!pagination) {
                return types.includes(event.type);
            }
            return index >= pagination.from - 1 && types.includes(event.type);
        });
        /* check that we have needed count of results */
        if (pagination && pagination.count) {
            if (pagination.count > result.length) {
                return res.status(400).json({ status: 'failed', message: `Count ${pagination.count} is too much` });
            }
            result = result.slice(0, pagination.count);
        }
        return res.status(200).json({ status: 'ok', events: result });
    });
}
exports.eventsRoute = eventsRoute;
//# sourceMappingURL=events.js.map