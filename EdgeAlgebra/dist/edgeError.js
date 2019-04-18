"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EdgeError {
}
function checkUndefined(arg) {
    if (arg === undefined) {
        throw new EdgeError();
    }
    return arg;
}
exports.default = checkUndefined;
