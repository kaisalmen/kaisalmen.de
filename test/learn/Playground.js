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


var Helper = {
	/**
	 * Only evaluate input in case it really is boolean (true or false). Otherwise return defaultValue as forced boolean
	 * @param {Object} input If not true or false defaultValue is returned
	 * @param {boolean} defaultValue Will be forced to boolean if not boolean
	 * @returns {boolean}
	 */
	verifyBoolean: function( input, defaultValue ) {
		return ( input === true || input === false ) ? input : ( defaultValue === true );
	},
	/**
	 * If given input is null or undefined, false is returned otherwise true.
	 *
	 * @param input Anything
	 * @returns {boolean}
	 */
	isValid: function( input ) {
		return ( input !== null && input !== undefined );
	},
	/**
	 * If given input is null or undefined, the defaultValue is returned otherwise the given input.
	 *
	 * @param input Anything
	 * @param defaultValue Anything
	 * @returns {*}
	 */
	verifyInput: function( input, defaultValue ) {
		return ( input === null || input === undefined ) ? defaultValue : input;
	}
};

console.log( '\nverifyBooleanDefaultFalse');
console.log( 'undefined, false -> false: ' + Helper.verifyBoolean( undefined, false ));
console.log( 'null, false -> false: ' + Helper.verifyBoolean( null, false ));
console.log( 'false, false -> false: ' + Helper.verifyBoolean( false, false ));
console.log( 'true, false -> true: ' + Helper.verifyBoolean( true, false ));
console.log( '"FALSE", false -> false: ' + Helper.verifyBoolean( "FALSE", false ));
console.log( '"TRUE", false -> false: ' + Helper.verifyBoolean( "TRUE", false ));
console.log( 'new Object(), false -> false: ' + Helper.verifyBoolean( new Object(), false ));

console.log( '\nverifyBooleanDefaultTrue');
console.log( 'undefined, true -> true: ' + Helper.verifyBoolean( undefined, true ));
console.log( 'null, true -> true: ' + Helper.verifyBoolean( null, true ));
console.log( 'false, true -> false: ' + Helper.verifyBoolean( false, true ));
console.log( 'true, true -> true: ' + Helper.verifyBoolean( true, true ));
console.log( '"FALSE", true -> true: ' + Helper.verifyBoolean( "FALSE", true ));
console.log( '"TRUE", true -> true: ' + Helper.verifyBoolean( "TRUE", true ));
console.log( 'new Object(), true -> true: ' + Helper.verifyBoolean( new Object(), true ));

console.log( '\nverifyValid with defaultValue="Tester"');
console.log( 'undefined, "Tester" -> "Tester": ' + Helper.verifyInput( undefined, "Tester" ));
console.log( 'null, "Tester" -> "Tester": ' + Helper.verifyInput( null, "Tester" ));
console.log( '"Hello", "Tester" -> "Hello": ' + Helper.verifyInput( "Hello", "Tester" ));
console.log( 'new Object(), "Tester" -> [object Object]: ' + Helper.verifyInput( new Object(), "Tester" ));

console.log( '\nisValid: ');
console.log( 'undefined -> false: ' + Helper.isValid( undefined ));
console.log( 'null -> false: ' + Helper.isValid( null ));
console.log( '"Hello" -> true: ' + Helper.isValid( "Hello" ));
console.log( 'new Object() -> true: ' + Helper.isValid( new Object() ));

