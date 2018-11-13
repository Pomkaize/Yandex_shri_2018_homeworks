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
const fs = require("fs");
const path = require("path");
const util = require("util");
const readFile = util.promisify(fs.readFile);
function playerInit() {
    return {
        getTrack: function () {
            return __awaiter(this, void 0, void 0, function* () {
                /* params - sorting, pagination, etc. */
                /* connecting to database, getting result */
                /* but now */
                const json = yield readFile(path.resolve(__dirname, './tracks.json'), 'utf8');
                return JSON.parse(json).tracks;
            });
        }
    };
}
exports.player = playerInit();
//# sourceMappingURL=player.js.map