/**
 * Created by Kai on 19.09.2015.
 */

"use strict";

class Polygon {
    constructor(height, width) {
        this.height = height;
        this.width = width;
    }

    printMe() {
        return "Width: " + this.width + " Height: " + this.height;
    }
}

function run() {
    var polygon = new Polygon(800, 600);
    console.log(polygon.printMe());
}
