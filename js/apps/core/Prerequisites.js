/**
 * @author Kai Salmen / www.kaisalmen.de
 */

'use strict';

if ( browserVersions === undefined) {
	var browserVersions = null;
}

var KSX = {
	apps: {
		core: {
			prerequisites: {

			}
		},
		tools: {
			loaders: {

			}
		},
		demos: {

		}
	},
	globals: {
		basedir: '../../',
		preChecksOk: true
	}
};

KSX.apps.core.prerequisites.BrowserSupport = (function () {

	function BrowserSupport( userVersions ) {
		this.platformVerification = new KSX.apps.core.prerequisites.PlatformVerification();

		this.versions = {
			chrome: {
				name: 'Google Chrome',
				supported: true,
				minVersion: { all: '38.0' },
				mobileSupported: true,
				mobileMinVersion: { all: '38.0' },
				mobileWarning: null
			},
			opera: {
				name: 'Opera',
				supported: true,
				minVersion: { all: '25.0' },
				mobileSupported: true,
				mobileMinVersion: { all: '25.0' },
				mobileWarning: null
			},
			firefox: {
				name: 'Firefox',
				supported: true,
				minVersion: { all: '38.0' },
				mobileSupported: true,
				mobileMinVersion: { all: '38.0', iosdevice: '1.0' },
				mobileWarning: null
			},
			msie: {
				name: 'Microsoft Internet Explorer',
				supported: false,
				minVersion: { all: '11.0' },
				mobileSupported: false,
				mobileMinVersion: { all: '11.0' },
				mobileWarning: null
			},
			msedge: {
				name: 'Microsoft Edge',
				supported: true,
				minVersion: { all: '12.0' },
				mobileSupported: true,
				mobileMinVersion: { all: '12.0' },
				mobileWarning: null
			},
			safari: {
				name: 'Apple Safari',
				supported: true,
				minVersion: { all: '9.0' },
				mobileSupported: true,
				mobileMinVersion: { all: '9.0' },
				mobileWarning: null
			}
		};

		if ( userVersions !== null ) {
			checkSingleBrowserSupport( this.versions.chrome, userVersions.chrome );
			checkSingleBrowserSupport( this.versions.opera, userVersions.opera );
			checkSingleBrowserSupport( this.versions.firefox, userVersions.firefox );
			checkSingleBrowserSupport( this.versions.msie, userVersions.msie );
			checkSingleBrowserSupport( this.versions.msedge, userVersions.msedge );
			checkSingleBrowserSupport( this.versions.safari, userVersions.safari );
		}
		console.log( this.printSupportedBrowsers( true ) );
		console.log( this.printSupportedBrowsers( false ) );
	}

	var checkSingleBrowserSupport = function (browserPredefined, browserUser) {
		if (browserUser !== undefined) {
			var potentialValue;

			for (var predefined in browserPredefined) {
				potentialValue = browserUser[predefined];

				if (potentialValue !== undefined) {
					browserPredefined[predefined] = potentialValue;
				}
				else {
					browserUser[predefined] = browserPredefined[predefined];
				}
			}
		}
	};

	BrowserSupport.prototype.verifySupport = function ( selectedBrowser ) {
		var haveGo = false;
		var msg = null;

		var verifyVersion = function ( allowedVersions ) {
			var versionCheck = false;

			for ( var name in allowedVersions ) {
				if ( name !== 'all' && bowser.hasOwnProperty( name ) ) {

					versionCheck = parseFloat( bowser.version ) >= parseFloat( allowedVersions[name] );
					if ( versionCheck ) {
						break;
					}
				}
			}
			if ( ! versionCheck && allowedVersions.hasOwnProperty( 'all' ) ) {
				versionCheck = parseFloat( bowser.version ) >= parseFloat( allowedVersions[ 'all' ] );
			}

			return versionCheck;
		};

		if ( ! bowser.mobile ) {

			if ( selectedBrowser.supported && verifyVersion( selectedBrowser.minVersion ) ) {

				haveGo = true;
				msg = 'Detected ' + selectedBrowser.name + ' ' + bowser.version + '!';

			}
			else {

				msg = selectedBrowser.name + ' ' + bowser.version + ' is not supported!\n' + this.printSupportedBrowsers( bowser.mobile );

			}
		}
		else {

			if ( selectedBrowser.mobileSupported && verifyVersion( selectedBrowser.mobileMinVersion ) ) {

				haveGo = true;
				msg = 'Detected mobile version of ' + selectedBrowser.name + ' ' + bowser.version + '!';

				if ( selectedBrowser.mobileWarning !== null ) {

					alert( selectedBrowser.mobileWarning );

				}
			}
			else {

				msg = 'Mobile version of ' + selectedBrowser.name + ' ' + bowser.version + ' is not supported!\n' + this.printSupportedBrowsers( bowser.mobile );

			}
		}

		console.log(msg);
		if ( ! haveGo ) {

			msg = selectedBrowser.name + ' is generally not supported!\n' + this.printSupportedBrowsers( bowser.mobile );
			if ( msg != null ) {
				this.platformVerification.showDivNotSupported( msg );
			}

		}

		return haveGo;
	};

	BrowserSupport.prototype.checkSupport = function () {
		var haveGo = false;
		if ( bowser.chrome ) {
			haveGo = this.verifySupport( this.versions.chrome );
		}
		else if ( bowser.opera ) {
			haveGo = this.verifySupport( this.versions.opera );
		}
		else if ( bowser.firefox ) {
			haveGo = this.verifySupport( this.versions.firefox );
		}
		else if ( bowser.msie ) {
			haveGo = this.verifySupport( this.versions.msie );
		}
		else if ( bowser.msedge ) {
			haveGo = this.verifySupport( this.versions.msedge );
		}
		else if ( bowser.safari ) {
			haveGo = this.verifySupport( this.versions.safari );
		}
		else {
			alert( 'This browser is not tested.' + bowser.name + ' ' + bowser.version + '. Application may not work properly!' );
			haveGo = true;
		}

		KSX.globals.preChecksOk = haveGo;
		return haveGo;
	};

	BrowserSupport.prototype.printSupportedBrowsers = function ( haveMobile ) {
		var supportedBrowsers = (haveMobile ? 'Supported mobile browsers' : 'Supported browsers')+ ' with minimum versions are:\n';

		var listVersions = function ( allowedVersions ) {
			var output = '(';

			for ( var name in allowedVersions ) {
				output += name + ': ' + allowedVersions[name] + '; ';
			}
			output = output.substring( 0, output.length - 2 );
			output += ')';

			return output;
		};

		for ( var version in this.versions ) {
			var browserDesc = this.versions[ version ];

			if ( haveMobile ) {

				if ( browserDesc.mobileSupported ) {
					supportedBrowsers += browserDesc.name + ' ' + listVersions( browserDesc.mobileMinVersion ) + ', ';
				}

			}
			else {

				if ( browserDesc.supported ) {
					supportedBrowsers += browserDesc.name + ' ' + listVersions( browserDesc.minVersion ) + ', ';
				}

			}
		}
		supportedBrowsers = supportedBrowsers.trim();
		supportedBrowsers = supportedBrowsers.substr( 0, supportedBrowsers.length - 1 );
		return supportedBrowsers;
	};

	return BrowserSupport;

})();

KSX.apps.core.prerequisites.PlatformVerification = (function () {

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
			body.insertBefore( divNotSupported, body.childNodes[body.childNodes.length] );
			console.log( 'Div "DivNotSupported" was added to body' );
		}
		divNotSupported.style.display = "";
		divNotSupported.innerHTML = errorText;

		if ( issueAlert ) {
			alert( errorText );
		}
	};

	return PlatformVerification;

})();

var webGLCap = new KSX.apps.core.prerequisites.PlatformVerification();
webGLCap.checkWebGLCapability();

var browserSupport = new KSX.apps.core.prerequisites.BrowserSupport( browserVersions );
browserSupport.checkSupport();
