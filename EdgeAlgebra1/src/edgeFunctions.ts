import Edge from "./edge";

export function makeEdge(): Edge {
    let e = new Edge();
    e.oNext = e;
    return e;
}

export function splice(a: Edge, b: Edge): void {
    let alpha = a.oNext.rot,
        beta = b.oNext.rot;

    let swapA = a.oNext,
        swapBeta = beta.oNext,
        swapAlpha = alpha.oNext;

    a.oNext = b.oNext;
    b.oNext = swapA;
    alpha.oNext = swapBeta;
    beta.oNext = swapAlpha;
}

export function connect(a: Edge, b: Edge): Edge {
    let e = makeEdge();
    e.org = a.dest;
    e.dest = b.org;
    splice(e, a.lNext);
    splice(e.sym, b);
    return e;
}

export function deleteEdge(e: Edge) {
    splice(e, e.oPrev);
    splice(e.sym, e.sym.oPrev);
}

export function swap(e: Edge) {
    let a = e.oPrev;
    let b = e.sym.oPrev;
    splice(e, a);
    splice(e.sym, b);
    splice(e, a.lNext);
    splice(e.sym, b.lNext);
    e.org = a.dest;
    e.dest = b.dest;
}
