"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const api_1 = require("./api/index");
function dbInit() {
    const models = fs.readdirSync(__dirname);
    const output = {};
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
            api: api_1.api
        }
        /* other db features */
    };
}
/* Init database*/
exports.db = dbInit();
//# sourceMappingURL=index.js.map