import { Request, Response } from "express";
import {MyEvent} from "../../models/api/events";

interface Pagination {
    from: number,
    count: number
}

import { db } from '../../models/index';

export async function eventsRoute(req:Request, res:Response) {

    let events = await db.models.api.events.get();

    const allowedEventTypes:{ [key:string]:boolean } = {
        info: true,
        critical: true
    };

    /* types checks*/
    if(!req.body.type || !Array.isArray(req.body.type) || req.body.type.length === 0) {
        return res.status(400).json({ status: 'failed', message: `Bad types: \'${req.body.type}\'` })
    }

    const types:Array<string> = req.body.type;
    const pagination: Pagination = req.body.pagination || null;
    /* check allowed types */

    types.forEach(function(type) {
        if(!allowedEventTypes[type]) {
            return res.status(400).json({ status: 'failed', message: `Bad type: \'${type}\'` })
        }
    });

    /* pagination checks */
    if(pagination) {
        if(!pagination.from) {
            return res.status(400).json({ status: 'failed', message: `Required parameter \'from'
              \ is empty`})
        }
    }
    /* filtered by certain type and from certain position */
    let result = events.filter((event:MyEvent, index:number)=>{
        if(!pagination) {
            return types.includes(event.type)
        }

        return index >= pagination.from - 1 && types.includes(event.type)
    });

    /* check that we have needed count of results */
    if(pagination && pagination.count) {
        if(pagination.count > result.length) {
            return res.status(400).json({ status: 'failed', message: `Count ${pagination.count} is too much`})
        }
        result = result.slice(0, pagination.count)
    }

    return res.status(200).json({ status: 'ok', events: result })
}