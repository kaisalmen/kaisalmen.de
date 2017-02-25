/**
 * @author Kai Salmen / www.kaisalmen.de
 */

'use strict';

if ( browserVersions === undefined) {
	var browserVersions = null;
}

KSX.apps.core.BrowserVerification = (function () {

	function BrowserVerification( userVersions ) {
		this.platformVerification = new KSX.apps.core.PlatformVerification();

		this.versions = {
			chrome: {
				name: 'Google Chrome',
				supported: true,
				minVersion: { all: '9.0' },
				mobileSupported: true,
				mobileMinVersion: { all: '9.0' },
				mobileWarning: null
			},
			opera: {
				name: 'Opera',
				supported: true,
				minVersion: { all: '12.0' },
				mobileSupported: true,
				mobileMinVersion: { all: '12.0' },
				mobileWarning: null
			},
			firefox: {
				name: 'Firefox',
				supported: true,
				minVersion: { all: '4.0' },
				mobileSupported: true,
				mobileMinVersion: { all: '4.0', ios: '1.0' },
				mobileWarning: null
			},
			msie: {
				name: 'Microsoft Internet Explorer',
				supported: true,
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
				minVersion: { all: '5.1' },
				mobileSupported: true,
				mobileMinVersion: { all: '5.1' },
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

	BrowserVerification.prototype.verifySupport = function ( selectedBrowser ) {
		var haveGo = false;
		var msg = null;

		var verifyVersion = function ( allowedVersions ) {
			var noVersion = bowser.version === undefined;
			var versionCheck = false;

			if ( noVersion ) {
				console.error( 'Unable to identify a version for ' + bowser.name );
				versionCheck = true;
			}
			else {

				for ( var name in allowedVersions ) {

					if ( name !== 'all' && bowser.hasOwnProperty( name ) ) {
						versionCheck = parseFloat( bowser.version ) >= parseFloat( allowedVersions[ name ] );
					}

					if ( versionCheck ) {
						break;
					}
				}

				if ( ! versionCheck && allowedVersions.hasOwnProperty( 'all' ) ) {
					versionCheck = parseFloat( bowser.version ) >= parseFloat( allowedVersions[ 'all' ] );
				}
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

	BrowserVerification.prototype.checkPlatformSupport = function () {
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

	BrowserVerification.prototype.printSupportedBrowsers = function ( haveMobile ) {
		var supportedBrowsers = (haveMobile ? 'Supported mobile browsers' : 'Supported browsers')+ ' with minimum versions are:\n';

		var listVersions = function ( allowedVersions ) {
			var output = '(';

			for ( var name in allowedVersions ) {
				output += name === 'all' ? '' : name + ': ';
				output += allowedVersions[name] + '; ';
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

	return BrowserVerification;

})();


var browserSupport = new KSX.apps.core.BrowserVerification( browserVersions );
browserSupport.checkPlatformSupport();
