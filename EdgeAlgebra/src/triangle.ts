import Vertex from "./vertex";

export default class Triangle {
    a: Vertex;
    b: Vertex;
    c: Vertex;

    constructor(a: Vertex, b: Vertex, c: Vertex) {
        this.a = a;
        this.b = b;
        this.c = c;
    }
}