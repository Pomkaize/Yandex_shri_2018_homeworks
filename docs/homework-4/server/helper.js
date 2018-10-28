const fs = require('fs');

exports.get2Digit = function (object) {
    return ['0', object].join('').slice(-2)
};

/* use while init */
exports.getJson = function (path) {
    let json = fs.readFileSync(path);
    return JSON.parse(json);
};