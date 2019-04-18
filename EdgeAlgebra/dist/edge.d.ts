import Vertex from "./vertex";
export default class Edge {
    private orgValue;
    private oNextValue;
    private rotValue;
    constructor(org?: Vertex, oNext?: Edge, rot?: Edge);
    org: Vertex;
    dest: Vertex;
    rot: Edge;
    readonly sym: Edge;
    readonly rotSym: Edge;
    oNext: Edge;
    readonly lNext: Edge;
    readonly dNext: Edge;
    readonly rNext: Edge;
    readonly oPrev: Edge;
    readonly lPrev: Edge;
    readonly dPrev: Edge;
    readonly rPrev: Edge;
}
