/**
 * @author Kai Salmen / www.kaisalmen.de
 */

'use strict';

if (KSX === undefined) {
    var KSX = {
        apps: {
            core: {
                prerequisites: {

                }
            },
            tools: {
                webworker: {

                }
            },
            demos: {

            }
        },
        globals: {
            basedir: '../../',
            browserVersions: null,
            preChecksOk: true
        }
    };
}

KSX.apps.core.prerequisites.BrowserSupport = (function () {

    function BrowserSupport(userVersions) {
        this.platformVerification = new KSX.apps.core.prerequisites.PlatformVerification();

        this.versions = {
            chrome : {
                name : 'Google Chrome',
                supported : true,
                minVersion : 38.0,
                mobileSupported: true,
                mobileWarning : undefined
            },
            opera : {
                name : 'Opera',
                supported : true,
                minVersion : 25.0,
                mobileSupported: true,
                mobileWarning : undefined
            },
            firefox : {
                name : 'Firefox',
                supported : true,
                minVersion : 38.0,
                mobileSupported: true,
                mobileWarning : undefined
            },
            msie : {
                name : 'Microsoft Internet Explorer',
                supported : false,
                minVersion : 11.0,
                mobileSupported: false,
                mobileWarning : undefined
            },
            msedge : {
                name : 'Microsoft Edge',
                supported : true,
                minVersion : 12.0,
                mobileSupported: true,
                mobileWarning : undefined
            },
            safari : {
                name : 'Apple Safari',
                supported : true,
                minVersion : 9.0,
                mobileSupported: true,
                mobileWarning : undefined
            }
        };

        if (userVersions !== null) {
            checkSingleBrowserSupport(this.versions.chrome, userVersions.chrome);
            checkSingleBrowserSupport(this.versions.opera, userVersions.opera);
            checkSingleBrowserSupport(this.versions.firefox, userVersions.firefox);
            checkSingleBrowserSupport(this.versions.msie, userVersions.msie);
            checkSingleBrowserSupport(this.versions.msedge, userVersions.msedge);
            checkSingleBrowserSupport(this.versions.safari, userVersions.safari);
        }
        console.log(this.printSupportedBrowsers());
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

        if (selectedBrowser.supported) {
            if (bowser.version >= selectedBrowser.minVersion) {
                if (bowser.mobile) {
                    if (selectedBrowser.mobileSupported) {
                        haveGo = true;
                        if (selectedBrowser.mobileWarning !== undefined) {
                            alert( selectedBrowser.mobileWarning );
                        }
                    }
                    else {
                        msg = 'Mobile version of ' + selectedBrowser.name + ' ' + bowser.version + ' is not supported!\n' + this.printSupportedBrowsers();
                    }
                }
                else {
                    haveGo = true;
                }
            }
            else {
                msg = selectedBrowser.name + ' ' + bowser.version + ' is not supported!\n' + this.printSupportedBrowsers();
            }
        }
        else {
            msg = selectedBrowser.name + ' is generally not supported!\n' + this.printSupportedBrowsers();
        }

        if ( msg != null ) {
            this.platformVerification.showDivNotSupported( msg );
        }

        return haveGo;
    };

    BrowserSupport.prototype.checkSupport = function () {
        var haveGo = false;
        if (bowser.chrome) {
            haveGo = this.verifySupport( this.versions.chrome );
        }
        else if (bowser.opera) {
            haveGo = this.verifySupport( this.versions.opera );
        }
        else if (bowser.firefox) {
            haveGo = this.verifySupport( this.versions.firefox );
        }
        else if (bowser.msie) {
            haveGo = this.verifySupport( this.versions.msie );
        }
        else if (bowser.msedge) {
            haveGo = this.verifySupport( this.versions.msedge );
        }
        else if (bowser.safari) {
            haveGo = this.verifySupport( this.versions.safari );
        }
        else {
            alert('This browser is not tested. Application may not work properly');
            haveGo = true;
        }

        KSX.globals.preChecksOk = haveGo;
        return haveGo;
    };

    BrowserSupport.prototype.printSupportedBrowsers = function () {
        var supportedBrowsers = 'Supported Browsers with minimum versions are:\n';
        for (var version in this.versions) {
            var browserDesc = this.versions[version];
            if (browserDesc.supported) {
                supportedBrowsers += browserDesc.name + ' ' + browserDesc.minVersion + ', ';
            }
        }
        supportedBrowsers = supportedBrowsers.trim();
        supportedBrowsers = supportedBrowsers.substr(0, supportedBrowsers.length - 1);
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
            body.insertBefore( divNotSupported, body.childNodes[0] );
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

var browserSupport = new KSX.apps.core.prerequisites.BrowserSupport(KSX.globals.browserVersions);
browserSupport.checkSupport();
