/**
 * @author Kai Salmen / www.kaisalmen.de
 */

'use strict';

if ( KSX === undefined ) var KSX = {};

if ( KSX.globals === undefined ) KSX.globals = {};
if ( KSX.globals.basedir === undefined ) KSX.globals.basedir = '../../';
if ( KSX.globals.preChecksOk === undefined ) KSX.globals.preChecksOk = true;
if ( KSX.globals.polyfillWebComponents === undefined ) KSX.globals.polyfillWebComponents = false;
if ( KSX.globals.polyfillPromise === undefined ) KSX.globals.polyfillPromise = false;

if ( KSX.nav === undefined ) KSX.nav = {};

if ( KSX.core === undefined ) KSX.core = {};
if ( KSX.demos === undefined ) KSX.demos = {};
if ( KSX.instancing === undefined ) KSX.instancing = {};
if ( KSX.test === undefined ) KSX.test = {};
if ( KSX.shader === undefined ) KSX.shader = {};
if ( KSX.tools === undefined ) KSX.tools = {};


KSX.core.PlatformVerification = (function () {

	function PlatformVerification() {
	}

	PlatformVerification.prototype.checkWebGLCapability = function () {
		var success = true;
		try {
			var canvas = document.createElement('canvas');
			success = !!( window.WebGLRenderingContext && ( canvas.getContext('webgl') || canvas.getContext('experimental-webgl') ) );
		}
		catch (e) {
			success = false;
		}

		if ( !success ) {
			this.showDivNotSupported( 'WebGL is not or not fully supported by your browser or graphics card.' );
		}

		return success;
	};

	PlatformVerification.prototype.verifyHwInstancingSupport = function ( renderer, highlightError ) {
		var supported = true;

		var resInstancedArrays = renderer.extensions.get( 'ANGLE_instanced_arrays' );
		if ( resInstancedArrays === undefined || resInstancedArrays === null ) {
			supported = false;
			console.error( 'Sorry, your graphics card or browser does not support hardware instancing.' );
			if ( highlightError ) {
				this.showDivNotSupported('Sorry, your graphics card or browser does not support hardware instancing.');
			}
		}
		else {
			console.log( 'Superb, your graphics card and browser supports hardware instancing.' );
		}

		return supported;
	};

	PlatformVerification.prototype.verifyVertexShaderTextureAccess = function ( renderer, highlightError ) {
		var gl = renderer.getContext();
		var result = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
		var supported = true;

		if (result != 0) {
			console.log( 'Vertex shader is able to read textures.\nTechnical details:\ngl.MAX_VERTEX_TEXTURE_IMAGE_UNITS= ' + result );
		}
		else {
			supported = false;
			console.error( 'Vertex shader is unable to read textures.\nTechnical details:\ngl.MAX_VERTEX_TEXTURE_IMAGE_UNITS= ' + result );
			if ( highlightError ) {
				this.showDivNotSupported('Vertex shader is unable to read textures.<br>Technical details:<br>gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS= ' + result);
			}
		}

		return supported;
	};

	PlatformVerification.prototype.showDivNotSupported = function ( errorText, issueAlert ) {
		var divNotSupported = document.getElementById('DivNotSupported');

		if ( divNotSupported === undefined || divNotSupported === null ) {

			divNotSupported = document.createElement("div");
			divNotSupported.id = 'DivNotSupported';

			var body = document.body;
			body.insertBefore( divNotSupported, body.childNodes[0] );
			console.log( 'Div "DivNotSupported" was added to body' );
		}
		divNotSupported.style.display = "";
		divNotSupported.innerHTML = errorText;

		if ( issueAlert ) {
			alert( errorText );
		}
	};

	PlatformVerification.prototype.checkPolyfills = function () {
		var body = document.getElementsByTagName( 'body' )[0];

		if ( typeof Promise === 'undefined' || Promise.toString().indexOf( '[native code]' ) === -1 ) {

			KSX.globals.polyfillPromise = true;
			console.log( 'Native Promise is not available! Loading polyfill instead.' );
			var promisePolyfillScript = document.createElement( 'script' );
			promisePolyfillScript.type = 'text/javascript';
			promisePolyfillScript.src = KSX.globals.basedir + '/node_modules/es6-promise/dist/es6-promise.auto.min.js';
			body.appendChild( promisePolyfillScript );

		} else {

			console.log( 'Native Promise is available.' );

		}
		if ( 'registerElement' in document &&
			'import' in document.createElement( 'link' ) &&
			'content' in document.createElement( 'template' )) {

			console.log( 'Native WebComponents (registerElement, import and content) are available.' );

		} else {

			KSX.globals.polyfillWebComponents = true;
			console.log( 'Native support for WebComponent registerElement, import and content is not available! Loading polyfill instead.' );
			var webComponentPolyfillScript = document.createElement( 'script' );
			webComponentPolyfillScript.type = 'text/javascript';
			webComponentPolyfillScript.src = KSX.globals.basedir + '/node_modules/webcomponents.js/webcomponents-lite.min.js';
			body.appendChild( webComponentPolyfillScript );

			window.addEventListener( 'HTMLImportsLoaded', function ( e ) {
				console.log( 'WebComponentsPolyfill: Received: ' + e.type );

				if ( KSX.nav.intergrateMenu != null ) {

					KSX.nav.intergrateMenu();

				} else {

					alert( 'No menu integration found!' );

				}
			} );

			window.addEventListener( 'WebComponentsReady', function ( e ) {
				console.log( 'WebComponentsPolyfill: Received: ' + e.type );
			} );

		}
	};

	return PlatformVerification;

})();


var platformVerification = new KSX.core.PlatformVerification();
platformVerification.checkWebGLCapability();
platformVerification.checkPolyfills();
