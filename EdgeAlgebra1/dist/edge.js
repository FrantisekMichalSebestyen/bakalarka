"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const edgeError_1 = __importDefault(require("./edgeError"));
class Edge {
    constructor(org, oNext, rot) {
        this.visited = false;
        this.orgValue = org;
        this.oNextValue = oNext;
        this.rotValue = rot;
    }
    get org() { return edgeError_1.default(this.orgValue); }
    get dest() { return this.sym.org; }
    get rot() { return edgeError_1.default(this.rotValue); }
    get sym() { return this.rot.rot; }
    get rotSym() { return this.rot.sym; }
    get oNext() { return edgeError_1.default(this.oNextValue); }
    get lNext() { return this.rotSym.oNext.rot; }
    get dNext() { return this.sym.oNext.sym; }
    get rNext() { return this.rot.oNext.rotSym; }
    get oPrev() { return this.rot.oNext.rot; }
    get lPrev() { return this.oNext.sym; }
    get dPrev() { return this.rotSym.oNext.rotSym; }
    get rPrev() { return this.sym.oNext; }
    set org(org) { this.orgValue = org; }
    set oNext(oNext) { this.oNextValue = oNext; }
    set rot(rot) { this.rotValue = rot; }
    set dest(dest) {
        let e1 = new Edge();
        let e2 = new Edge(dest);
        let e3 = new Edge();
        e2.oNext = e2;
        e1.oNext = e3;
        e3.oNext = e1;
        this.rot = e1;
        e1.rot = e2;
        e2.rot = e3;
        e3.rot = this;
    }
    set vis(b) {
        this.visited = b;
    }
    get vis() {
        return this.visited;
    }
}
exports.default = Edge;
