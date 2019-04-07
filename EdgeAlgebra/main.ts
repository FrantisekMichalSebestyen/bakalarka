class Vertex {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

class Edge {
    private orgValue: Vertex | undefined;
    private oNextValue: Edge | undefined;
    private rotValue: Edge | undefined;

    constructor(org?: Vertex, oNext?: Edge, rot?: Edge) {
        this.orgValue = org;
        this.oNextValue = oNext;
        this.rotValue = rot;
    }

    get org(): Vertex | undefined { return <Vertex>this.orgValue; }
    get dest(): Vertex | undefined { return this.sym.org; }

    get rot(): Edge | undefined { return this.rotValue; }
    get sym(): Edge | undefined { return this.rot.rot; }
    get rotSym(): Edge | undefined { return this.rot.sym; }

    get oNext(): Edge | undefined { return this.oNextValue; }
    get lNext(): Edge | undefined { return this.rotSym.oNext.rot; }
    get dNext(): Edge | undefined { return this.sym.oNext.sym; }
    get rNext(): Edge | undefined { return this.rot.oNext.rotSym; }

    get oPrev(): Edge | undefined { return this.rot.oNext.rot; }
    get lPrev(): Edge | undefined { return this.oNext.sym; }
    get dPrev(): Edge | undefined { return this.rotSym.oNext.rotSym; }
    get rPrev(): Edge | undefined { return this.sym.oNext; }

    set org(org: Vertex | undefined) { this.orgValue = org; }
    set oNext(oNext: Edge | undefined) { this.oNextValue = oNext; }
    set rot(rot: Edge | undefined) { this.rotValue = rot; }

    set dest(dest: Vertex | undefined) {
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

function makeEdge(): Edge {
    let e = new Edge();
    e.oNext = e;
    return e;
}



function splice(a: Edge, b: Edge): void {
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

function connect(a: Edge, b: Edge): Edge {
    let e = makeEdge();
    e.org = a.dest;
    e.dest = b.org;
    splice(e, a.lNext);
    splice(e.sym, b);
    return e;
}

function deleteEdge(e: Edge) {
    splice(e, e.oPrev);
    splice(e.sym, e.sym.oPrev);
}

function swap(e: Edge) {
    let a = e.oPrev;
    let b = e.sym.oPrev;
    splice(e, a);
    splice(e.sym, b);
    splice(e, a.lNext);
    splice(e.sym, b.lNext);
    e.org = a.dest;
    e.dest = b.dest;
}

function inCircleTest(a: Vertex, b: Vertex, c: Vertex, d: Vertex): Boolean {
    let adx = (a.x - d.x), ady = (a.y - d.y), ad = Math.pow(adx, 2) + Math.pow(ady, 2),
        bdx = (b.x - d.x), bdy = (b.y - d.y), bd = Math.pow(bdx, 2) + Math.pow(bdy, 2),
        cdx = (c.x - d.x), cdy = (c.y - d.y), cd = Math.pow(cdx, 2) + Math.pow(cdy, 2);

    return (adx * (bdy * cd - bd * cdy)
        - ady * (bdx * cd - bd * cdx)
        + ad * (bdx * cdy - bdy * cdx)) > 0;
}


function ccw(a: Vertex, b: Vertex, c: Vertex) {
    return (a.x * (b.y - c.y)
        - a.y * (b.x - c.x)
        + (b.x * c.y - b.y * c.x)>0);
}

function rightOf(x: Vertex, e: Edge) {
    return ccw(x, e.dest, e.org);
}

function leftOf(x: Vertex, e: Edge) {
    return ccw(x, e.org, e.dest);
}

function valid(e: Edge, basel: Edge) {
    return rightOf(e.dest, basel);
}




function delaunay(s: Array<Vertex>): [Edge, Edge] {

    if (s.length == 2) {

        let a = makeEdge();
        a.org = s.shift();
        a.dest = s.shift();
        return [a, a.sym];

    } else if (s.length == 3) {

        let a = makeEdge(),
            b = makeEdge();


        a.org = s.shift();
        a.dest = b.org = s.shift();
        b.dest = s.shift();

        splice(a.sym, b);



        if (ccw(a.org, a.dest, b.dest)) {
            let c = connect(b, a);
            return [a, b.sym];
        } else if (ccw(a.org, b.dest, a.dest)) {
            let c = connect(b, a);
            return [c.sym, c];
        } else {
            return [a, b.sym];
        }

    } else {

        let [ldo, ldi] = delaunay(s.slice(0, s.length / 2)),
            [rdi, rdo] = delaunay(s.slice(s.length / 2));

        do {
            if (leftOf(rdi.org, ldi)) {
                ldi = ldi.lNext;
            } else if (rightOf(ldi.org, rdi)) {
                rdi = rdi.rPrev;
            } else {
                break;
            }
        } while (true);

        let basel = connect(rdi.sym, ldi);

        if (ldi.org == ldo.org) { ldo = basel.sym; }
        if (rdi.org == rdo.org) { rdo = basel; }

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

            if (!valid(lCand, basel) && !valid(rCand, basel)) { break; }

            if (!valid(lCand, basel) || (valid(rCand, basel) && inCircleTest(lCand.dest, lCand.org, rCand.org, rCand.dest))) {
                basel = connect(rCand, basel.sym);
            } else {
                basel = connect(basel.sym, lCand.sym);
            }
        } while (true);

        return [ldo, rdo];
    }
}

function iterate(e: Edge): Array<Vertex> {
    let visited = new Set<Edge>();
    let edgeBFS = new Array<Edge>();
    let faces = new Array<Vertex>();

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

                visited.add(next)
                next = next.lNext;
            } while (next != e);
        }
    } while (edgeBFS.length != 0);
    return faces;
}



let testList = new Array<Vertex>();
testList = [new Vertex(-1.5, 0), new Vertex(1.5, 0), new Vertex(0, 1), new Vertex(0, 10)];

testList.sort(function (a: Vertex, b: Vertex) { return (a.x - b.x); });

let [first, last] = delaunay(testList);
let faces: Vertex[] = iterate(first);

for (let vertex of faces) {
    console.log(vertex);
}


