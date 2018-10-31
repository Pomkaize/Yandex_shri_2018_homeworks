import * as express from 'express'
import { eventsRoute } from './events';
const router = express.Router();

function apiRouter<T extends express.Router>(router: T):T {
    router.post('/events', eventsRoute);
    return router
}

export default apiRouter(router);