class Point {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return this.x + " " + this.y;
  }
}

class Graph {
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
    let vertexNumber = new Map<Point,number>();
    let edgeSet = new Set<string>();
    let i : number = 0;
    for (let vertex of this.adjSet.keys()) {
      graphString += vertex.toString() + "\n"
      vertexNumber.set(vertex,i);
      i+=1;
    }

    for (let [vertex, adjSet] of this.adjSet) {
      for (let adjVertex of adjSet) {
        if(!edgeSet.has(vertexNumber.get(vertex) + " " + vertexNumber.get(adjVertex))){
          graphString += vertexNumber.get(adjVertex) + " " + vertexNumber.get(vertex) + "\n";
          edgeSet.add(vertexNumber.get(adjVertex) + " " + vertexNumber.get(vertex));
        }
      }
    }

    return graphString;
  }
}

let graph = new Graph();
var selectColor = "Green";
var vertexSize = 10;
var selectedVertex: null | Point = null;
var backgroundImage: null | HTMLImageElement = null;
var mode: string = "graphMode";
var x_guide : number = 0;
var y_guide : number = 0;

const c: HTMLCanvasElement = <any>document.getElementById("myCanvas");
const ctx: CanvasRenderingContext2D = <any>c.getContext("2d");


function setGuidelines(){
  let x_input : HTMLInputElement = <HTMLInputElement> document.getElementById("x_guide");
  let y_input : HTMLInputElement = <HTMLInputElement> document.getElementById("y_guide");
  x_guide = Number(x_input.value);
  y_guide = Number(y_input.value);
}

function getMousePos(event: MouseEvent): Point {
  let rect: ClientRect = c.getBoundingClientRect();
  let mousePos = new Point(event.clientX - rect.left, event.clientY - rect.top);
  return mousePos;
}

function checkInside(v1: Point, v2: Point) {
  if (v1.x > v2.x - vertexSize &&
    v1.x < v2.x + vertexSize &&
    v1.y > v2.y - vertexSize &&
    v1.y < v2.y + vertexSize) {
    return true;
  }
}

function redraw(event: MouseEvent) {
  ctx.beginPath();
  ctx.clearRect(0, 0, c.width, c.height);
  const mousePos: Point = getMousePos(event);
  const message = "x: " + mousePos.x + " y: " + mousePos.y + " selected: " + selectedVertex;
  console.log(message);
  console.log(x_guide + "       HA LOOOOOOOOOO");
  for(let i = 0 ; i < x_guide; i++ ){
    ctx.beginPath();
    ctx.moveTo(c.width/(x_guide+1)*(i+1), 0);
    ctx.lineTo(c.width/(x_guide+1)*(i+1), c.height);
    ctx.stroke();
  }

  for(let i = 0; i < y_guide; i++){
    ctx.beginPath();
    ctx.moveTo(0, c.height/(y_guide+1)*(i+1));
    ctx.lineTo(c.width, c.height/(y_guide+1)*(i+1));
    ctx.stroke();
  }

  if (backgroundImage != null) {
    ctx.drawImage(backgroundImage, c.width/2- backgroundImage.width/2, c.height /2 - backgroundImage.height/2, backgroundImage.width, backgroundImage.height);
  }

  for (const [vertex, adjVertex] of graph.adjSet) {
    for (const adjVertex of graph.adjSet.get(vertex)) {
      ctx.beginPath();
      ctx.strokeStyle = "yellow";
      ctx.moveTo(vertex.x, vertex.y);
      ctx.lineTo(adjVertex.x, adjVertex.y);
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }


  for (const vertex of graph.adjSet.keys()) {
    ctx.fillStyle = "white";
    ctx.fillRect(vertex.x - (vertexSize + 1) / 2,
      vertex.y - (vertexSize + 1) / 2, vertexSize + 1, vertexSize + 1);

    ctx.fillStyle = "blue";
    ctx.fillRect(vertex.x - vertexSize / 2,
      vertex.y - vertexSize / 2, vertexSize, vertexSize);
  }

  ctx.fillStyle = selectColor;

  if (selectedVertex != null) {
    ctx.fillRect(selectedVertex.x - vertexSize / 2,
      selectedVertex.y - vertexSize / 2, vertexSize, vertexSize);
  }

  ctx.fillText(message, 0, c.height);
}

function clickVertex(event: MouseEvent) {
  const mousePos = getMousePos(event);
  let insideOfVertex: Boolean = false;
  let nextVertex;
  for (let vertex of graph.adjSet.keys()) {
    if (checkInside(vertex, mousePos)) {
      insideOfVertex = true;
      nextVertex = vertex
    }
  }
  if (insideOfVertex && nextVertex == selectedVertex) {
    selectedVertex = null;
  } else if (insideOfVertex) {
    selectedVertex = nextVertex;
  } else {
    graph.addVertex(mousePos);
  }
}

function clickEdge(event: MouseEvent) {
  if (selectedVertex == null) {
    clickVertex(event);
  } else {
    const mousePos = getMousePos(event);
    for (let vertex of graph.adjSet.keys()) {
      if (checkInside(vertex, mousePos)) {
        graph.addEdge(vertex, selectedVertex);
      }
    }
  }
}

function removeVertex(event: MouseEvent) {
  const mousePos = getMousePos(event);
  let insideOfVertex: Boolean = false;
  let nextVertex;
  for (let vertex of graph.adjSet.keys()) {
    if (checkInside(vertex, mousePos)) {
      insideOfVertex = true;
      nextVertex = vertex
    }
  }

  if (insideOfVertex) {
    graph.removeVertex(nextVertex);
  }
  if (nextVertex == selectedVertex) {
    selectedVertex = null;
  }
}

function removeEdge(event: MouseEvent) {
  if (selectedVertex == null) {
    clickVertex(event);
  } else {
    const mousePos = getMousePos(event);
    for (let vertex of graph.adjSet.keys()) {
      if (checkInside(vertex, mousePos)) {
        graph.removeEdge(vertex, selectedVertex);
      }
    }
  }
}


function clickCanvas(event: MouseEvent) {
  if (event.shiftKey && event.ctrlKey) {
    removeEdge(event);
  } else if (event.ctrlKey) {
    removeVertex(event);
  } else if (event.shiftKey) {
    clickEdge(event);
  } else {
    clickVertex(event);
  }
  redraw(event)
}

