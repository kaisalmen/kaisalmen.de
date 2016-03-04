/**
 * Created by Kai Salmen.
 */

"use strict";

var KSX = {
    apps : {
        core : {
            AppLifecycle : (function () {

                function AppLifecycle(name) {
                    this.name = name;
                    this.apps = new Array();
                }

                AppLifecycle.prototype.addApp = function (app) {
                    this.apps.push(app);
                    console.log("Added app: " + app.getAppName())
                };

                AppLifecycle.prototype.initAsync = function () {
                    console.log("Starting global initialisation phase...");

                    var currentScene;
                    for (var i = 0; i < this.apps.length; i++) {
                        currentScene = this.apps[i];
                        currentScene.browserContext = this;
                        console.log("Registering: " + currentScene.name);

                        currentScene.initAsync();
                    }
                };

                AppLifecycle.prototype.renderAllApps = function () {
                    for (var i = 0; i < this.apps.length; i++) {
                        this.apps[i].render();
                    }
                };

                AppLifecycle.prototype.resizeAll = function () {
                    for (var i = 0; i < this.apps.length; i++) {
                        this.apps[i].resizeDisplayGL();
                    }
                };

                return AppLifecycle;
            })()
        },
        demos : {
            impl : {

            }
        },
        learn : {
            impl : {

            },
            worker : {
                impl : {

                }
            }
        },
        zerosouth : {
            impl : {

            }
        },
        tools : {
            webworker : {

            }
        }
    }
};
