/**
 * Created by Kai Salmen.
 */

"use strict";



KSX.apps.core.AppLifecycle = (function () {

    function AppLifecycle(name) {
        this.name = name;
        this.sceneApps = new Array();
    }

    AppLifecycle.prototype.addSceneApp = function (sceneApp) {
        this.sceneApps.push(sceneApp);
        console.log("Added sceneApp: " + sceneApp.getAppName())
    };

    AppLifecycle.prototype.initAsync = function () {
        console.log("Starting global initialisation phase...");

        var currentScene;
        for (var i = 0; i < this.sceneApps.length; i++) {
            currentScene = this.sceneApps[i];
            currentScene.browserContext = this;
            console.log("Registering: " + currentScene.name);

            currentScene.initAsync();
        }
    };

    AppLifecycle.prototype.renderAllApps = function () {
        for (var i = 0; i < this.sceneApps.length; i++) {
            this.sceneApps[i].render();
        }
    };

    AppLifecycle.prototype.resizeAll = function () {
        for (var i = 0; i < this.sceneApps.length; i++) {
            this.sceneApps[i].adjustWindow();
        }
    };

    return AppLifecycle;
})();
