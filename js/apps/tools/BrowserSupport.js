/**
 * @author Kai Salmen / www.kaisalmen.de
 */

'use strict';

KSX.apps.tools.BrowserSupport = (function () {

    function BrowserSupport(userVersions) {
        this.versions = {
            chrome : {
                name : 'Google Chrome',
                supported : true,
                minVersion : 46.0,
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
                supported : true,
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

        if (userVersions !== undefined) {
            checkSingleBrowserSupport(this.versions.chrome, userVersions.chrome);
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

    var verifySupport = function (browserSupportInstance, selectedBrowser) {
        var haveGo = false;
        if (selectedBrowser.supported) {
            if (bowser.version >= selectedBrowser.minVersion) {
                if (bowser.mobile) {
                    if (selectedBrowser.mobileSupported) {
                        haveGo = true;
                        if (selectedBrowser.mobileWarning !== undefined) {
                            alert(selectedBrowser.mobileWarning);
                        }
                    }
                    else {
                        alert('Mobile version of ' + selectedBrowser.name + ' ' + bowser.version + ' is not supported!\n' + browserSupportInstance.printSupportedBrowsers());
                    }
                }
                else {
                    haveGo = true;
                }
            }
            else {
                alert(selectedBrowser.name + ' ' + bowser.version + ' is not supported!\n' + browserSupportInstance.printSupportedBrowsers());
            }
        }
        else {
            alert(selectedBrowser.name + ' is generally not supported!\n' + browserSupportInstance.printSupportedBrowsers());
        }

        return haveGo;
    };

    BrowserSupport.prototype.checkSupport = function () {
        var haveGo = false;
        if (bowser.chrome) {
            haveGo = verifySupport(this, this.versions.chrome);
        }
        else if (bowser.firefox) {
            haveGo = verifySupport(this, this.versions.firefox);
        }
        else if (bowser.msie) {
            haveGo = verifySupport(this, this.versions.msie);
        }
        else if (bowser.msedge) {
            haveGo = verifySupport(this, this.versions.msedge);
        }
        else if (bowser.safari) {
            haveGo = verifySupport(this, this.versions.safari);
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

var browserSupport = new KSX.apps.tools.BrowserSupport(KSX.globals.browserVersions);
browserSupport.checkSupport();
