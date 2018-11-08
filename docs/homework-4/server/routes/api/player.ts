import { db } from '../../models';
import { Request, Response } from "express";
import {Track} from "../../models/api/player";

export async function playerRoute(req:Request, res:Response) {

    const tracks = await db.models.api.player.getTrack();

    const currentTrackId:number|null = req.body.currentTrackId;

    if(currentTrackId) {
        delete tracks[currentTrackId];
    }
    const tracksArray: Track[] = Object.values(tracks);
    const trackId:number = getRandomInt(0 , tracksArray.length);
    const track = tracksArray[trackId];

    global.setTimeout(()=>res.json({status: 'ok', track: track}), 500);
}


function getRandomInt(min:number, max:number):number {
    return Math.floor(Math.random() * (max - min)) + min;
}