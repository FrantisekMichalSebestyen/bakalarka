import Edge from "./edge";
import Vertex from "./vertex";
import { makeEdge, splice, connect, deleteEdge } from "./edgeFunctions";
import Triangle from "./triangle";

function inCircleTest(a: Vertex, b: Vertex, c: Vertex, d: Vertex): Boolean {
    let adx = (a.x - d.x), ady = (a.y - d.y), ad = Math.pow(adx, 2) + Math.pow(ady, 2),
        bdx = (b.x - d.x), bdy = (b.y - d.y), bd = Math.pow(bdx, 2) + Math.pow(bdy, 2),
        cdx = (c.x - d.x), cdy = (c.y - d.y), cd = Math.pow(cdx, 2) + Math.pow(cdy, 2);

    return (adx * (bdy * cd - bd * cdy)
        - ady * (bdx * cd - bd * cdx)
        + ad * (bdx * cdy - bdy * cdx)
    ) > 0;
}


function ccw(a: Vertex, b: Vertex, c: Vertex) {
    return (a.x * (b.y - c.y)
        - a.y * (b.x - c.x)
        + (b.x * c.y - b.y * c.x) > 0);
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

function delaunayEdges(s: Array<Vertex>): [Edge, Edge] {

    if (s.length == 2) {

        let a = makeEdge();
        a.org = s[0];
        a.dest = s[1];
        return [a, a.sym];

    } else if (s.length == 3) {

        let a = makeEdge(),
            b = makeEdge();


        a.org = s[0];
        a.dest = b.org = s[1];
        b.dest = s[2];

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

        let [ldo, ldi] = delaunayEdges(s.slice(0, s.length / 2)),
            [rdi, rdo] = delaunayEdges(s.slice(s.length / 2));

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

export default function delaunay(s: Array<Vertex>): Array<Triangle> {
    let visited = new Set<Edge>();
    let edgeSearch = new Array<Edge>();
    let trianglePoint = new Array<Vertex>();
    let delaunayTriangles: Array<Triangle> = new Array();


    let e = delaunayEdges(s)[0];

    
    while (leftOf(e.oNext.dest, e)) {
        e = e.oNext;
    }

    let next = e;

    do {
        edgeSearch.push(next.sym);
        visited.add(next);
        next = next.lNext;
    } while (next != e);

    do {
        e = edgeSearch[0];
        edgeSearch.shift();

        if (!visited.has(e)) {
            next = e;
            do {
                trianglePoint.push(next.org);
                if (!visited.has(next.sym)) {
                    edgeSearch.push(next.sym);
                }

                visited.add(next)
                next = next.lNext;

                if (trianglePoint.length == 3) {
                    delaunayTriangles.push(new Triangle(trianglePoint[0], trianglePoint[1], trianglePoint[2]));
                    trianglePoint.length = 0;
                }
            } while (next != e);
        }
    } while (edgeSearch.length != 0);

    return delaunayTriangles;


};


