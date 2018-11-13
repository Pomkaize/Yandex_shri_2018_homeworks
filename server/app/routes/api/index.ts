import * as express from 'express'
import { eventsRoute } from './events';
import {playerRoute} from "./player";
const router = express.Router();

function apiRouter<T extends express.Router>(router: T):T {
    router.post('/events', eventsRoute);
    router.post('/player', playerRoute);
    return router
}

export default apiRouter(router);