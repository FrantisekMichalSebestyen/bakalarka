import Point from "./point"
export default class Graph {
    adjSet: Map<Point, Set<Point>>;
    constructor() {
      this.adjSet = new Map();
    }
  
    addVertex(p: Point): void {
      this.adjSet.set(p, new Set<Point>());
    }
  
    addEdge(p1: Point, p2: Point): void {
      this.adjSet.get(p1).add(p2);
      this.adjSet.get(p2).add(p1);
    }
  
    removeVertex(p: Point): void {
      this.adjSet.delete(p);
      for (let [vertex, adjVertex] of this.adjSet) {
        adjVertex.delete(p);
      }
    }
  
    removeEdge(p1: Point, p2: Point): void {
      this.adjSet.get(p1).delete(p2);
      this.adjSet.get(p2).delete(p1);
    }
  
    toString() {
      let graphString: string = "";
      let vertexNumber = new Map<Point, number>();
      let edgeSet = new Set<string>();
      let i: number = 0;
      for (let vertex of this.adjSet.keys()) {
        graphString += vertex.toString() + "\n"
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

    toStringMap() {
        let stringMap = new Map<String, String>();
        for(let vertex of this.adjSet.keys()){
            stringMap.set(vertex.toString(), "");
            for(let adjVertex of this.adjSet.get(vertex)){
                stringMap.set(vertex.toString(), stringMap.get(vertex.toString()) + " " + adjVertex.toString());
            }
        }  
        return stringMap;  
    }

  }
  