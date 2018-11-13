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
const models_1 = require("../../models/index");
function playerRoute(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const tracks = yield models_1.db.models.api.player.getTrack();
        const currentTrackId = req.body.currentTrackId;
        if (currentTrackId) {
            delete tracks[currentTrackId];
        }
        const tracksArray = Object.values(tracks);
        const trackId = getRandomInt(0, tracksArray.length);
        const track = tracksArray[trackId];
        global.setTimeout(() => res.json({ status: 'ok', track: track }), 500);
    });
}
exports.playerRoute = playerRoute;
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
//# sourceMappingURL=player.js.map