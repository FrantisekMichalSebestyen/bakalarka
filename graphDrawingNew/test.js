"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const delaunayguibasstolfi_1 = require("delaunayguibasstolfi");
let arr = [new delaunayguibasstolfi_1.Vertex(-1.5, 0), new delaunayguibasstolfi_1.Vertex(0, 1), new delaunayguibasstolfi_1.Vertex(0, 10), new delaunayguibasstolfi_1.Vertex(1.5, 0)];
let x = delaunayguibasstolfi_1.delaunay(arr);
for (let triangle of x) {
    console.log(triangle.a + " " + triangle.b + " " + triangle.c);
}
