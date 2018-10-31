import * as express from 'express';
import statusRoute from './status';
import apiRouter from './api';
const router = express.Router();

const routes = function<T extends express.Router>(router:T):T {
    /* api handler*/
    router.use('/api', apiRouter);

    /* status handler */
    router.use('/status', statusRoute);

    return router
};

export default routes(router)