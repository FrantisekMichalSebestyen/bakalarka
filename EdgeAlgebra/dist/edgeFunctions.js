"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const edge_1 = __importDefault(require("./edge"));
function makeEdge() {
    let e = new edge_1.default();
    e.oNext = e;
    return e;
}
exports.makeEdge = makeEdge;
function splice(a, b) {
    let alpha = a.oNext.rot, beta = b.oNext.rot;
    let swapA = a.oNext, swapBeta = beta.oNext, swapAlpha = alpha.oNext;
    a.oNext = b.oNext;
    b.oNext = swapA;
    alpha.oNext = swapBeta;
    beta.oNext = swapAlpha;
}
exports.splice = splice;
function connect(a, b) {
    let e = makeEdge();
    e.org = a.dest;
    e.dest = b.org;
    splice(e, a.lNext);
    splice(e.sym, b);
    return e;
}
exports.connect = connect;
function deleteEdge(e) {
    splice(e, e.oPrev);
    splice(e.sym, e.sym.oPrev);
}
exports.deleteEdge = deleteEdge;
function swap(e) {
    let a = e.oPrev;
    let b = e.sym.oPrev;
    splice(e, a);
    splice(e.sym, b);
    splice(e, a.lNext);
    splice(e.sym, b.lNext);
    e.org = a.dest;
    e.dest = b.dest;
}
exports.swap = swap;
