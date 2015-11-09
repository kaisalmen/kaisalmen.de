/**
 * Created by Kai on 09.11.2015.
 */

"use strict";

var Polygon = (function () {

    function Polygon(width, height) {
        this.init();
        if (width !== undefined) {
            this.width = width;
        }
        if (height !== undefined) {
            this.height = height;
        }
    }

    Polygon.prototype.init = function() {
        this.width = 4096;
        this.height = 2160;
    }

    Polygon.prototype.printMe = function() {
        return "Width: " + this.width + " Height: " + this.height;
    }

    return Polygon;
})();

function run() {
    var polygonA = new Polygon(800, 600);
    var polygonB = new Polygon();
    console.log(polygonA.printMe());
    console.log(polygonB.printMe());
    console.log(polygonA.width);
    console.log(polygonA.height);
    console.log(polygonB.width);
    console.log(polygonB.height);
}
