/**
 * @author Kai Salmen / www.kaisalmen.de
 */

'use strict';

var jsZipTest = new KSX.apps.tools.ZipTools( '../../resource/models/' );
var done = function() {
	var printContent = function( fileAsString ) {
		console.log( fileAsString );
	};
	var logLength = function( fileAsUint8Array ) {
		console.log( fileAsUint8Array.length );
	};
	jsZipTest.unpackAsString( 'PTV1.mtl', printContent );
	jsZipTest.unpackAsUint8Array( 'PTV1.obj', logLength );
};
jsZipTest.load( 'PTV1.zip', { success: done } );
