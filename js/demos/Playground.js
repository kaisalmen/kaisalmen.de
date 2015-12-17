/**
 * Created by Kai Salmen.
 */

"use strict";

var KSPG = {
    Polygon : (function () {

        // private const: equal for all prototypes; no direct access
        var WURST = "Salami";

        function Polygon(width, height) {
            width != null ? this.width = width: this.width = 3840;
            height != null ? this.height = height: this.height = 2160;
        }

        Polygon.prototype.printDimensions = function() {
            return "Width: " + this.width + " Height: " + this.height;
        };

        Polygon.prototype.getWURST = function() {
            return WURST;
        };

        return Polygon;
    })(),
    Point : (function () {

        function Point(x, y) {
            x != null ? this.x = x: this.x = 10;
            y != null ? this.y = y: this.y = 10;
        }

        Point.prototype.printCoordinates = function() {
            return "Position: X: " + this.x + " Y: " + this.y;
        };

        return Point;
    })()
};


function run() {
    var polygonA = new KSPG.Polygon();
    var polygonB = new KSPG.Polygon(800, 600);
    var polygonC = new KSPG.Polygon(null, null);

    console.log(polygonA.printDimensions());
    console.log(polygonB.printDimensions());
    console.log(polygonC.printDimensions());

    var pointA = new KSPG.Point();
    var pointB = new KSPG.Point(-200, 124);

    console.log(pointA.printCoordinates());
    console.log(pointB.printCoordinates());

    var shaderTools = new KSX.apps.tools.ShaderTools();
    var hexColorValue = "#FF00FF";
    var rgbColorValue = shaderTools.hexToRGB(hexColorValue, false);
    console.log(hexColorValue + " = " + rgbColorValue);
}