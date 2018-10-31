import * as fs from 'fs';
import {Api, api} from "./api";

/* Тут специально делаю синхронно, потому что нет смысла от работы сервера, когда база данных не прогружена*/
export interface Models {
    api: Api;
}

function dbInit() {
    const models:string[] = fs.readdirSync(__dirname);
    const output: any = {};

/*    models.forEach(function(element:string):void {
        /!* current file *!/
        if (element !== 'index.js') {
            /!* get absolute path*!/
            let elementPath:string = path.resolve(__dirname, element);
            /!* configure db *!/
            output[element] = require(elementPath);
        }
    });*/

    return {
       /* models:output*/
        models: {
            api
        }
        /* other db features */
    }
}

/* Init database*/
export const db = dbInit();