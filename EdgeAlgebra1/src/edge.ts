import Vertex from "./vertex";
import checkUndefined from "./edgeError";

export default class Edge {
    private orgValue: Vertex | undefined;
    private oNextValue: Edge | undefined;
    private rotValue: Edge | undefined;
    private visited: Boolean = false;

    constructor(org?: Vertex, oNext?: Edge, rot?: Edge) {
        this.orgValue = org;
        this.oNextValue = oNext;
        this.rotValue = rot;
    }

    get org(): Vertex { return checkUndefined(this.orgValue); }
    get dest(): Vertex { return this.sym.org; }

    get rot(): Edge { return checkUndefined(this.rotValue); }
    get sym(): Edge { return this.rot.rot; }
    get rotSym(): Edge { return this.rot.sym; }

    get oNext(): Edge { return checkUndefined(this.oNextValue); }
    get lNext(): Edge { return this.rotSym.oNext.rot; }
    get dNext(): Edge { return this.sym.oNext.sym; }
    get rNext(): Edge { return this.rot.oNext.rotSym; }

    get oPrev(): Edge { return this.rot.oNext.rot; }
    get lPrev(): Edge { return this.oNext.sym; }
    get dPrev(): Edge { return this.rotSym.oNext.rotSym; }
    get rPrev(): Edge { return this.sym.oNext; }

    set org(org: Vertex) { this.orgValue = org; }
    set oNext(oNext: Edge) { this.oNextValue = oNext; }
    set rot(rot: Edge) { this.rotValue = rot; }

    set dest(dest: Vertex) {
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

    set vis(b:Boolean){
        this.visited = b;
    }

    get vis(){
        return this.visited;
    }
}
