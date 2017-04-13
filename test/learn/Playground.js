/**
 * @author Kai Salmen / www.kaisalmen.de
 */

'use strict';

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


function OOTest1( name ) {

	OOTest1.prototype.getName = function () {
		return this.name;
	};

	OOTest1.prototype.getHiddenName = function () {
		return hiddenName;
	};

	OOTest1.prototype.print = function () {
		console.log( this.name + ': Hello' );
	};

	this.name = name;
	var hiddenName = 'hiddenName1';
	this.print();
};

OOTest1.prototype = Object.create( OOTest1.prototype );
OOTest1.prototype.constructor = OOTest1;


function OOTest2( name ) {
	this.name = name;
	var hiddenName = 'hiddenName2';
	this.print();

	OOTest2.prototype.getHiddenName = function () {
		return hiddenName;
	};
};

OOTest2.prototype.getName = function () {
	return this.name;
};

OOTest2.prototype.print = function () {
	console.log( this.name + ': Hello' );
};

OOTest2.prototype = Object.create( OOTest2.prototype );
OOTest2.prototype.constructor = OOTest2;


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


var ooTest1 = new OOTest1( 'one' );
console.log( ooTest1.getName() );
console.log( ooTest1.getHiddenName() );



var ooTest2 = new OOTest2( 'two' );
console.log( ooTest2.getName() );
console.log( ooTest2.getHiddenName() );


// Boolean
console.log( Boolean( undefined ) );
console.log( Boolean( null ) );
console.log( Boolean( false ) );
console.log( Boolean( true ) );
console.log( Boolean( new Object() ) );