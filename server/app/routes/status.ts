import * as express from 'express'
import { get2Digit } from '../lib/helper';
const router = express.Router();

function statusRoute<T extends express.Router>(router: T):T {
    router.post('/', function (req: express.Request, res: express.Response, next: express.NextFunction) {
        /* calculate params from difference */
        const now: Date = new Date();
        const startTime: number = req.app.get('startTime');
        const workingTime:number = Number(now) - startTime;
        const seconds:number = Math.floor((workingTime / 1000) % 60);
        const minutes:number = Math.floor((workingTime / (1000 * 60)) % 60);
        const hours:number = Math.floor((workingTime / (1000 * 60 * 60)) % 60);

        const result:string = `${get2Digit(hours)}:${get2Digit(minutes)}:${get2Digit(seconds)}`;

        res.status(200).json({status: 'ok', runtime: result})
    });
    return router
}

export default statusRoute(router)
