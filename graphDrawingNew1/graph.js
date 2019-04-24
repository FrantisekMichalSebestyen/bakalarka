"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Graph {
    constructor() {
        this.adjSet = new Map();
    }
    addVertex(p) {
        this.adjSet.set(p, new Set());
    }
    addEdge(p1, p2) {
        this.adjSet.get(p1).add(p2);
        this.adjSet.get(p2).add(p1);
    }
    removeVertex(p) {
        this.adjSet.delete(p);
        for (let [vertex, adjVertex] of this.adjSet) {
            adjVertex.delete(p);
        }
    }
    removeEdge(p1, p2) {
        this.adjSet.get(p1).delete(p2);
        this.adjSet.get(p2).delete(p1);
    }
    toString() {
        let graphString = "";
        let vertexNumber = new Map();
        let edgeSet = new Set();
        let i = 0;
        for (let vertex of this.adjSet.keys()) {
            graphString += vertex.toString() + "\n";
            vertexNumber.set(vertex, i);
            i += 1;
        }
        for (let [vertex, adjSet] of this.adjSet) {
            for (let adjVertex of adjSet) {
                if (!edgeSet.has(vertexNumber.get(vertex) + " " + vertexNumber.get(adjVertex))) {
                    graphString += vertexNumber.get(adjVertex) + " " + vertexNumber.get(vertex) + "\n";
                    edgeSet.add(vertexNumber.get(adjVertex) + " " + vertexNumber.get(vertex));
                }
            }
        }
        return graphString;
    }
}
exports.default = Graph;
