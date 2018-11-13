import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';
const readFile = util.promisify(fs.readFile);

export interface MyEvent {
    type: string,
    title: string,
    source: string,
    time: string,
    description: null|string,
    icon: string,
    size: string
}

export interface Events {
     get:(params?:object)=>Promise<Array<MyEvent>>
}

function eventsInit():Events {
    return {
        get: async function(){
            /* params - sorting, pagination, etc. */
            /* connecting to database, getting result */
            /* but now */
         let json =  await readFile(path.resolve(__dirname,'./events.json'), 'utf8');
         return JSON.parse(json).events;
        }
    }
}

export const events: Events = eventsInit();