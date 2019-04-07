"use strict";
class Vertex {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
class Edge {
    constructor(org, oNext, rot) {
        this.orgValue = org;
        this.oNextValue = oNext;
        this.rotValue = rot;
    }
    get org() { return this.orgValue; }
    get dest() { return this.sym.org; }
    get rot() { return this.rotValue; }
    get sym() { return this.rot.rot; }
    get rotSym() { return this.rot.sym; }
    get oNext() { return this.oNextValue; }
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
}
function makeEdge() {
    let e = new Edge();
    e.oNext = e;
    return e;
}
function splice(a, b) {
    let alpha = a.oNext.rot, beta = b.oNext.rot;
    let swapA = a.oNext, swapBeta = beta.oNext, swapAlpha = alpha.oNext;
    a.oNext = b.oNext;
    b.oNext = swapA;
    alpha.oNext = swapBeta;
    beta.oNext = swapAlpha;
}
function connect(a, b) {
    let e = makeEdge();
    e.org = a.dest;
    e.dest = b.org;
    splice(e, a.lNext);
    splice(e.sym, b);
    return e;
}
function deleteEdge(e) {
    splice(e, e.oPrev);
    splice(e.sym, e.sym.oPrev);
}
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
function inCircleTest(a, b, c, d) {
    let adx = (a.x - d.x), ady = (a.y - d.y), ad = Math.pow(adx, 2) + Math.pow(ady, 2), bdx = (b.x - d.x), bdy = (b.y - d.y), bd = Math.pow(bdx, 2) + Math.pow(bdy, 2), cdx = (c.x - d.x), cdy = (c.y - d.y), cd = Math.pow(cdx, 2) + Math.pow(cdy, 2);
    return (adx * (bdy * cd - bd * cdy)
        - ady * (bdx * cd - bd * cdx)
        + ad * (bdx * cdy - bdy * cdx)) > 0;
}
function ccw(a, b, c) {
    return (a.x * (b.y - c.y)
        - a.y * (b.x - c.x)
        + (b.x * c.y - b.y * c.x) > 0);
}
function rightOf(x, e) {
    return ccw(x, e.dest, e.org);
}
function leftOf(x, e) {
    return ccw(x, e.org, e.dest);
}
function valid(e, basel) {
    return rightOf(e.dest, basel);
}
function delaunay(s) {
    if (s.length == 2) {
        let a = makeEdge();
        a.org = s.shift();
        a.dest = s.shift();
        return [a, a.sym];
    }
    else if (s.length == 3) {
        let a = makeEdge(), b = makeEdge();
        a.org = s.shift();
        a.dest = b.org = s.shift();
        b.dest = s.shift();
        splice(a.sym, b);
        if (ccw(a.org, a.dest, b.dest)) {
            let c = connect(b, a);
            return [a, b.sym];
        }
        else if (ccw(a.org, b.dest, a.dest)) {
            let c = connect(b, a);
            return [c.sym, c];
        }
        else {
            return [a, b.sym];
        }
    }
    else {
        let [ldo, ldi] = delaunay(s.slice(0, s.length / 2)), [rdi, rdo] = delaunay(s.slice(s.length / 2));
        do {
            if (leftOf(rdi.org, ldi)) {
                ldi = ldi.lNext;
            }
            else if (rightOf(ldi.org, rdi)) {
                rdi = rdi.rPrev;
            }
            else {
                break;
            }
        } while (true);
        let basel = connect(rdi.sym, ldi);
        if (ldi.org == ldo.org) {
            ldo = basel.sym;
        }
        if (rdi.org == rdo.org) {
            rdo = basel;
        }
        do {
            let lCand = basel.sym.oNext;
            if (valid(lCand, basel)) {
                while (inCircleTest(basel.dest, basel.org, lCand.dest, lCand.oNext.dest)) {
                    let t = lCand.oNext;
                    deleteEdge(lCand);
                    lCand = t;
                }
            }
            let rCand = basel.oPrev;
            if (valid(rCand, basel)) {
                while (inCircleTest(basel.dest, basel.org, rCand.dest, rCand.oPrev.dest)) {
                    let t = rCand.oPrev;
                    deleteEdge(rCand);
                    rCand = t;
                }
            }
            if (!valid(lCand, basel) && !valid(rCand, basel)) {
                break;
            }
            if (!valid(lCand, basel) || (valid(rCand, basel) && inCircleTest(lCand.dest, lCand.org, rCand.org, rCand.dest))) {
                basel = connect(rCand, basel.sym);
            }
            else {
                basel = connect(basel.sym, lCand.sym);
            }
        } while (true);
        return [ldo, rdo];
    }
}
function iterate(e) {
    let visited = new Set();
    let edgeBFS = new Array();
    let faces = new Array();
    while (leftOf(e.oNext.dest, e)) {
        e = e.oNext;
    }
    let next = e;
    do {
        edgeBFS.push(next.sym);
        visited.add(next);
        next = next.lNext;
    } while (next != e);
    do {
        e = edgeBFS.shift();
        if (!visited.has(e)) {
            next = e;
            do {
                faces.push(next.org);
                if (!visited.has(next.sym)) {
                    edgeBFS.push(next.sym);
                }
                visited.add(next);
                next = next.lNext;
            } while (next != e);
        }
    } while (edgeBFS.length != 0);
    return faces;
}
let testList = new Array();
testList = [new Vertex(-1.5, 0), new Vertex(1.5, 0), new Vertex(0, 1), new Vertex(0, 10)];
testList.sort(function (a, b) { return (a.x - b.x); });
let [first, last] = delaunay(testList);
let faces = iterate(first);
for (let vertex of faces) {
    console.log(vertex);
}
