/**
 * @author Kai Salmen / www.kaisalmen.de
 */

'use strict';

KSX.apps.tools.ZipTools = (function () {

	function ZipTools ( path ) {
		this.zip = new JSZip();

		this.xhrLoader = new THREE.XHRLoader();
		this.xhrLoader.setPath( path );
		this.xhrLoader.setResponseType( 'arraybuffer' );

		this.zipContent = null;
	}

	ZipTools.prototype.load = function( filename, callback ) {
		var scope = this;
		var loader = function( zipDataFromXHR ) {
			scope.zip.loadAsync( zipDataFromXHR )
			.then( function ( zip ) {
				scope.zipContent = zip;
				callback();
			});
		};

		this.xhrLoader.load( filename, loader );
	};

	ZipTools.prototype.unpackAsUint8Array = function( filename,  callback ) {

		if ( JSZip.support.uint8array ) {
			this.zipContent.file( filename ).async( 'uint8array' )
			.then(function ( dataAsUint8Array ) {
				callback( dataAsUint8Array );
			});
		}
		else {
			this.zipContent.file( filename ).async( 'base64' )
			.then(function ( data64 ) {
				callback( new TextEncoder("utf-8").encode( data64 ) );
			});
		}
	};

	ZipTools.prototype.unpackAsString = function( filename,  callback ) {
		this.zipContent.file( filename ).async( 'string' )
		.then(function ( dataAsString ) {
			callback( dataAsString );
		});
	};

	return ZipTools;
})();