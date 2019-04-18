"use strict";
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    toString() {
        return this.x + " " + this.y;
    }
}
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
let graph = new Graph();
var selectColor = "Green";
var vertexSize = 10;
var selectedVertex = null;
var backgroundImage = null;
var x_guide = 0;
var y_guide = 0;
const c = document.getElementById("myCanvas");
const ctx = c.getContext("2d");
function setGuidelines() {
    let x_input = document.getElementById("x_guide");
    let y_input = document.getElementById("y_guide");
    x_guide = Number(x_input.value);
    y_guide = Number(y_input.value);
}
function getMousePos(event) {
    let rect = c.getBoundingClientRect();
    let mousePos = new Point(event.clientX - rect.left, event.clientY - rect.top);
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
}
function redraw(event) {
    ctx.beginPath();
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = "black";
    ctx.lineWidth = 1;
    let mousePos = getMousePos(event);
    const message = "x: " + mousePos.x + " y: " + mousePos.y + " selected: " + selectedVertex;
    console.log(message);
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
    console.log(mousePos.x + " " + mousePos.y);
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
function createDelaunay() {
}
function compareDelaunay() {
}
