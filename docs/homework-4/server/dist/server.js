"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const routes_1 = require("./routes");
class Server {
    static bootstrap() {
        return new Server();
    }
    constructor() {
        /* create express js appplication */
        this.app = express();
        /* Configure application */
        this.config();
    }
    config() {
        /* parse json in requests */
        this.app.use(express.json());
        /* routes, global input point */
        this.app.use(routes_1.default);
        /* 404 */
        this.app.use(function (req, res, next) {
            res.status(404).end('<h1>Page not found</h1>');
        });
        /* server error */
        this.app.use(function (err, req, res, next) {
            res.status(500).end('Server error');
        });
    }
}
exports.Server = Server;
//# sourceMappingURL=server.js.map