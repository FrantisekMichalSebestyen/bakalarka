(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
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

},{"./graph":1,"./point":10,"delaunayguibasstolfi":7}],3:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const edgeFunctions_1 = require("./edgeFunctions");
const triangle_1 = __importDefault(require("./triangle"));
function inCircleTest(a, b, c, d) {
    let adx = (a.x - d.x), ady = (a.y - d.y), ad = Math.pow(adx, 2) + Math.pow(ady, 2), bdx = (b.x - d.x), bdy = (b.y - d.y), bd = Math.pow(bdx, 2) + Math.pow(bdy, 2), cdx = (c.x - d.x), cdy = (c.y - d.y), cd = Math.pow(cdx, 2) + Math.pow(cdy, 2);
    return (adx * (bdy * cd - bd * cdy)
        - ady * (bdx * cd - bd * cdx)
        + ad * (bdx * cdy - bdy * cdx)) > 0;
}
function ccw(a, b, c) {
    return (a.x * (b.y - c.y)
        - a.y * (b.x - c.x)
        + (b.x * c.y - b.y * c.x)) > 0;
}
function rightOf(x, e) {
    return ccw(x, e.dest, e.org);
}
function leftOf(x, e) {
    return ccw(x, e.org, e.dest);
}
function valid(e, basel) {
    return rightOf(e.dest, basel);
}
function delaunayEdges(s) {
    if (s.length == 2) {
        let a = edgeFunctions_1.makeEdge();
        a.org = s[0];
        a.dest = s[1];
        return [a, a.sym];
    }
    else if (s.length == 3) {
        let a = edgeFunctions_1.makeEdge(), b = edgeFunctions_1.makeEdge();
        a.org = s[0];
        b.org = s[1];
        a.dest = b.org;
        b.dest = s[2];
        edgeFunctions_1.splice(a.sym, b);
        if (ccw(a.org, a.dest, b.dest)) {
            let c = edgeFunctions_1.connect(b, a);
            return [a, b.sym];
        }
        else if (ccw(a.org, b.dest, a.dest)) {
            let c = edgeFunctions_1.connect(b, a);
            return [c.sym, c];
        }
        else {
            return [a, b.sym];
        }
    }
    else {
        let [ldo, ldi] = delaunayEdges(s.slice(0, s.length / 2)), [rdi, rdo] = delaunayEdges(s.slice(s.length / 2));
        do {
            if (leftOf(rdi.org, ldi)) {
                ldi = ldi.lNext;
            }
            else if (rightOf(ldi.org, rdi)) {
                rdi = rdi.rPrev;
            }
            else {
                break;
            }
        } while (true);
        let basel = edgeFunctions_1.connect(rdi.sym, ldi);
        if (ldi.org == ldo.org) {
            ldo = basel.sym;
        }
        if (rdi.org == rdo.org) {
            rdo = basel;
        }
        do {
            let lCand = basel.sym.oNext;
            if (valid(lCand, basel)) {
                while (inCircleTest(basel.dest, basel.org, lCand.dest, lCand.oNext.dest)) {
                    let t = lCand.oNext;
                    edgeFunctions_1.deleteEdge(lCand);
                    lCand = t;
                }
            }
            let rCand = basel.oPrev;
            if (valid(rCand, basel)) {
                while (inCircleTest(basel.dest, basel.org, rCand.dest, rCand.oPrev.dest)) {
                    let t = rCand.oPrev;
                    edgeFunctions_1.deleteEdge(rCand);
                    rCand = t;
                }
            }
            if (!valid(lCand, basel) && !valid(rCand, basel)) {
                break;
            }
            if (!valid(lCand, basel) || valid(rCand, basel) && inCircleTest(lCand.dest, lCand.org, rCand.org, rCand.dest)) {
                basel = edgeFunctions_1.connect(rCand, basel.sym);
            }
            else {
                basel = edgeFunctions_1.connect(basel.sym, lCand.sym);
            }
        } while (true);
        return [ldo, rdo];
    }
}
function delaunay(s) {
    let edgeSearch = new Array();
    let trianglePoint = new Array();
    let delaunayTriangles = new Array();
    let searchIndex = 0;
    let e = delaunayEdges(s)[0];
    while (leftOf(e.oNext.dest, e)) {
        e = e.oNext;
    }
    let next = e;
    do {
        edgeSearch.push(next.sym);
        next.vis = true;
        next = next.lNext;
    } while (next != e);
    while (searchIndex != edgeSearch.length) {
        e = edgeSearch[searchIndex];
        searchIndex++;
        if (!e.vis) {
            next = e;
            do {
                trianglePoint.push(next.org);
                if (!next.sym.vis) {
                    edgeSearch.push(next.sym);
                }
                next.vis = true;
                next = next.lNext;
                if (trianglePoint.length == 3) {
                    delaunayTriangles.push(new triangle_1.default(trianglePoint[0], trianglePoint[1], trianglePoint[2]));
                    trianglePoint.length = 0;
                }
            } while (next != e);
        }
    }
    return delaunayTriangles;
}
exports.default = delaunay;
;

},{"./edgeFunctions":6,"./triangle":8}],4:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const edgeError_1 = __importDefault(require("./edgeError"));
class Edge {
    constructor(org, oNext, rot) {
        this.visited = false;
        this.orgValue = org;
        this.oNextValue = oNext;
        this.rotValue = rot;
    }
    get org() { return edgeError_1.default(this.orgValue); }
    get dest() { return this.sym.org; }
    get rot() { return edgeError_1.default(this.rotValue); }
    get sym() { return this.rot.rot; }
    get rotSym() { return this.rot.sym; }
    get oNext() { return edgeError_1.default(this.oNextValue); }
    get lNext() { return this.rotSym.oNext.rot; }
    get dNext() { return this.sym.oNext.sym; }
    get rNext() { return this.rot.oNext.rotSym; }
    get oPrev() { return this.rot.oNext.rot; }
    get lPrev() { return this.oNext.sym; }
    get dPrev() { return this.rotSym.oNext.rotSym; }
    get rPrev() { return this.sym.oNext; }
    set org(org) { this.orgValue = org; }
    set oNext(oNext) { this.oNextValue = oNext; }
    set rot(rot) { this.rotValue = rot; }
    set dest(dest) {
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
    set vis(b) {
        this.visited = b;
    }
    get vis() {
        return this.visited;
    }
}
exports.default = Edge;

},{"./edgeError":5}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EdgeError {
}
function checkUndefined(arg) {
    if (arg === undefined) {
        throw new EdgeError();
    }
    return arg;
}
exports.default = checkUndefined;

},{}],6:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const edge_1 = __importDefault(require("./edge"));
function makeEdge() {
    let e = new edge_1.default();
    e.oNext = e;
    return e;
}
exports.makeEdge = makeEdge;
function splice(a, b) {
    let alpha = a.oNext.rot, beta = b.oNext.rot;
    let swapA = a.oNext, swapBeta = beta.oNext, swapAlpha = alpha.oNext;
    a.oNext = b.oNext;
    b.oNext = swapA;
    alpha.oNext = swapBeta;
    beta.oNext = swapAlpha;
}
exports.splice = splice;
function connect(a, b) {
    let e = makeEdge();
    e.org = a.dest;
    e.dest = b.org;
    splice(e, a.lNext);
    splice(e.sym, b);
    return e;
}
exports.connect = connect;
function deleteEdge(e) {
    splice(e, e.oPrev);
    splice(e.sym, e.sym.oPrev);
}
exports.deleteEdge = deleteEdge;
function swap(e) {
    let a = e.oPrev;
    let b = e.sym.oPrev;
    splice(e, a);
    splice(e.sym, b);
    splice(e, a.lNext);
    splice(e.sym, b.lNext);
    e.org = a.dest;
    e.dest = b.dest;
}
exports.swap = swap;

},{"./edge":4}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var delaunay_1 = require("./delaunay");
exports.delaunay = delaunay_1.default;
var vertex_1 = require("./vertex");
exports.Vertex = vertex_1.default;
var triangle_1 = require("./triangle");
exports.Triangle = triangle_1.default;

},{"./delaunay":3,"./triangle":8,"./vertex":9}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Triangle {
    constructor(a, b, c) {
        this.a = a;
        this.b = b;
        this.c = c;
    }
}
exports.default = Triangle;

},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Vertex {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
exports.default = Vertex;

},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    toString() {
        return this.x + " " + this.y;
    }
}
exports.default = Point;

},{}]},{},[2]);
