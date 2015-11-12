/**
 * Created by Kai on 19.09.2015.
 */

"use strict";

class Polygon {

    constructor(height, width) {
        this.init();
        if (width != null) {
            this.width = width;
        }
        if (height != null) {
            this.height = height;
        }
    }

    init() {
        this.width = 3840;
        this.height = 2160;
    }

    printDimensions() {
        return "Width: " + this.width + " Height: " + this.height;
    }

    get WURST() {
        return "Salami";
    }
}

function run() {
    var polygonA = new Polygon();
    var polygonB = new Polygon(800, 600);
    var polygonC = new Polygon(null, null);

    console.log(polygonA.printDimensions());
    console.log(polygonB.printDimensions());
    console.log(polygonC.printDimensions());
}
