/**
 * Created by Kai Salmen.
 */

"use strict";

var Polygon = (function () {

    var WURST = undefined;

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
        WURST = "Salami";
        this.width = 4096;
        this.height = 2160;
    };

    Polygon.prototype.printMe = function() {
        return "Width: " + this.width + " Height: " + this.height;
    };

    Polygon.prototype.getWURST = function() {
        return WURST;
    };

    Polygon.prototype.setWURST = function(name) {
        WURST = name;
    };

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

    polygonA.setWURST("Sommerwurst");
    console.log(polygonA.getWURST());
    console.log(polygonB.getWURST());

}
