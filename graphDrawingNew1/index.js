"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const delaunayguibasstolfi_1 = require("delaunayguibasstolfi");
const graph_1 = __importDefault(require("./graph"));
const point_1 = __importDefault(require("./point"));
var graph = new graph_1.default();
var selectColor = "Green";
var vertexSize = 10;
var selectedVertex;
var backgroundImage;
var x_guide = 0;
var y_guide = 0;
const c = document.getElementById("myCanvas");
const ctx = c.getContext("2d");
c.addEventListener('mousemove', redraw);
c.addEventListener('click', clickCanvas);
const crDelaunay = document.getElementById("createDelaunay");
const cmDelaunay = document.getElementById("createDelaunay");
const sGuideLines = document.getElementById("submitGuideLines");
const clearGraph = document.getElementById("clearGraph");
crDelaunay.addEventListener("click", function () {
    selectedVertex = undefined;
    let arrVertex = new Array();
    let graphDelaunay = new graph_1.default();
    for (let point of graph.adjSet.keys()) {
        arrVertex.push(new delaunayguibasstolfi_1.Vertex(point.x, point.y));
    }
    arrVertex.sort(function (a, b) {
        if (a.x == b.x) {
            return a.y - b.y;
        }
        else {
            return a.x - b.x;
        }
    });
    let arrTriangle = delaunayguibasstolfi_1.delaunay(arrVertex);
    for (let triangle of arrTriangle) {
        let a = new point_1.default(triangle.a.x, triangle.a.y);
        let b = new point_1.default(triangle.b.x, triangle.b.y);
        let c = new point_1.default(triangle.c.x, triangle.c.y);
        let addA = true;
        let addB = true;
        let addC = true;
        for (let point of graphDelaunay.adjSet.keys()) {
            if (a.x == point.x && a.y == point.y) {
                a = point;
                addA = false;
            }
        }
        for (let point of graphDelaunay.adjSet.keys()) {
            if (b.x == point.x && b.y == point.y) {
                b = point;
                addB = false;
            }
        }
        for (let point of graphDelaunay.adjSet.keys()) {
            if (c.x == point.x && c.y == point.y) {
                c = point;
                addC = false;
            }
        }
        if (addA)
            graphDelaunay.addVertex(a);
        if (addB)
            graphDelaunay.addVertex(b);
        if (addC)
            graphDelaunay.addVertex(c);
        graphDelaunay.addEdge(a, b);
        graphDelaunay.addEdge(b, c);
        graphDelaunay.addEdge(a, c);
    }
    graph = graphDelaunay;
});
cmDelaunay.addEventListener("click", compareDelaunay);
sGuideLines.addEventListener("click", function () {
    let x_input = document.getElementById("x_guide");
    let y_input = document.getElementById("y_guide");
    x_guide = Number(x_input.value);
    y_guide = Number(y_input.value);
});
clearGraph.addEventListener("click", function () {
    graph = new graph_1.default();
});
function getMousePos(event) {
    let rect = c.getBoundingClientRect();
    let mousePos = new point_1.default(event.clientX - rect.left, event.clientY - rect.top);
    return mousePos;
}
function findGuideLinePosition(mousePos) {
    if (x_guide > 0) {
        let resolution_x = c.width / (x_guide + 1);
        mousePos.x = mousePos.x / resolution_x;
        mousePos.x = Math.round(mousePos.x);
        mousePos.x = mousePos.x * resolution_x;
    }
    if (y_guide > 0) {
        let resolution_y = c.width / (y_guide + 1);
        mousePos.y = mousePos.y / resolution_y;
        mousePos.y = Math.round(mousePos.y);
        mousePos.y = mousePos.y * resolution_y;
    }
    return mousePos;
}
function checkInside(v1, v2) {
    if (v1.x > v2.x - vertexSize &&
        v1.x < v2.x + vertexSize &&
        v1.y > v2.y - vertexSize &&
        v1.y < v2.y + vertexSize) {
        return true;
    }
    return false;
}
function redraw(event) {
    ctx.beginPath();
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = "black";
    ctx.lineWidth = 1;
    let mousePos = getMousePos(event);
    const message = "x: " + mousePos.x + " y: " + mousePos.y + " selected: " + selectedVertex;
    ctx.strokeStyle = "black";
    if (backgroundImage != null) {
        ctx.drawImage(backgroundImage, c.width / 2 - backgroundImage.width / 2, c.height / 2 - backgroundImage.height / 2, backgroundImage.width, backgroundImage.height);
    }
    for (let i = 0; i < x_guide; i++) {
        ctx.beginPath();
        ctx.moveTo(c.width / (x_guide + 1) * (i + 1), 0);
        ctx.lineTo(c.width / (x_guide + 1) * (i + 1), c.height);
        ctx.stroke();
    }
    for (let i = 0; i < y_guide; i++) {
        ctx.beginPath();
        ctx.moveTo(0, c.height / (y_guide + 1) * (i + 1));
        ctx.lineTo(c.width, c.height / (y_guide + 1) * (i + 1));
        ctx.stroke();
    }
    ctx.lineWidth = 3;
    for (const [vertex, adjVertex] of graph.adjSet) {
        for (const adjVertex of graph.adjSet.get(vertex)) {
            ctx.beginPath();
            ctx.strokeStyle = "red";
            ctx.moveTo(vertex.x, vertex.y);
            ctx.lineTo(adjVertex.x, adjVertex.y);
            ctx.stroke();
        }
    }
    for (const vertex of graph.adjSet.keys()) {
        ctx.fillStyle = "white";
        ctx.fillRect(vertex.x - (vertexSize + 1) / 2, vertex.y - (vertexSize + 1) / 2, vertexSize + 1, vertexSize + 1);
        ctx.fillStyle = "blue";
        ctx.fillRect(vertex.x - vertexSize / 2, vertex.y - vertexSize / 2, vertexSize, vertexSize);
    }
    ctx.fillStyle = selectColor;
    if (selectedVertex != null) {
        ctx.fillRect(selectedVertex.x - vertexSize / 2, selectedVertex.y - vertexSize / 2, vertexSize, vertexSize);
    }
    ctx.fillText(message, 0, c.height);
}
function clickVertex(event) {
    let mousePos = getMousePos(event);
    let insideOfVertex = false;
    let nextVertex;
    mousePos = findGuideLinePosition(mousePos);
    for (let vertex of graph.adjSet.keys()) {
        if (checkInside(vertex, mousePos)) {
            insideOfVertex = true;
            nextVertex = vertex;
        }
    }
    if (insideOfVertex && nextVertex == selectedVertex) {
        selectedVertex = null;
    }
    else if (insideOfVertex) {
        selectedVertex = nextVertex;
    }
    else {
        graph.addVertex(mousePos);
    }
}
function clickEdge(event) {
    if (selectedVertex == null) {
        clickVertex(event);
    }
    else {
        const mousePos = getMousePos(event);
        for (let vertex of graph.adjSet.keys()) {
            if (checkInside(vertex, mousePos)) {
                graph.addEdge(vertex, selectedVertex);
            }
        }
    }
}
function removeVertex(event) {
    const mousePos = getMousePos(event);
    let insideOfVertex = false;
    let nextVertex;
    for (let vertex of graph.adjSet.keys()) {
        if (checkInside(vertex, mousePos)) {
            insideOfVertex = true;
            nextVertex = vertex;
        }
    }
    if (insideOfVertex) {
        graph.removeVertex(nextVertex);
    }
    if (nextVertex == selectedVertex) {
        selectedVertex = null;
    }
}
function removeEdge(event) {
    if (selectedVertex == null) {
        clickVertex(event);
    }
    else {
        const mousePos = getMousePos(event);
        for (let vertex of graph.adjSet.keys()) {
            if (checkInside(vertex, mousePos)) {
                graph.removeEdge(vertex, selectedVertex);
            }
        }
    }
}
function clickCanvas(event) {
    if (event.shiftKey && event.ctrlKey) {
        removeEdge(event);
    }
    else if (event.ctrlKey) {
        removeVertex(event);
    }
    else if (event.shiftKey) {
        clickEdge(event);
    }
    else {
        clickVertex(event);
    }
    redraw(event);
}
function compareDelaunay() { }
