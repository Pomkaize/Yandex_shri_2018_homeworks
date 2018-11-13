import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';
const readFile = util.promisify(fs.readFile);

export interface Track {
    trackId: number,
    trackName: string,
    bandName: string,
    image: string,
    length: number
}

type Tracks = { [key: string] : Track }

export interface Player {
    getTrack:()=>Promise<Tracks>
}

function playerInit():Player {
    return {
        getTrack: async function() {
            /* params - sorting, pagination, etc. */
            /* connecting to database, getting result */
            /* but now */
            const json =  await readFile(path.resolve(__dirname,'./tracks.json'), 'utf8');
            return JSON.parse(json).tracks;
        }
    }
}

export const player: Player = playerInit();