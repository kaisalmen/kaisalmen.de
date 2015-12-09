/**
 * Created by Kai Salmen.
 */

"use strict";

KSX.appBase.AppLifecycle = (function () {

    function AppLifecycle(name) {
        this.name = name;
        this.sceneApps = new Array();
    }

    AppLifecycle.prototype.addSceneApp = function (sceneApp) {
        this.sceneApps.push(sceneApp);
        console.log("Added sceneApp: " + sceneApp.getAppName())
    };

    AppLifecycle.prototype.init = function () {
        console.log("Starting global initialisation phase...");
        console.log("Kicking register...");
        for (var i = 0; i < this.sceneApps.length; i++) {
            this.sceneApps[i].browserContext = this;
        }
        console.log("Kicking initShaders...");
        for (var i = 0; i < this.sceneApps.length; i++) {
            this.sceneApps[i].initShaders();
        }
        console.log("Kicking initPreGL...");
        for (var i = 0; i < this.sceneApps.length; i++) {
            this.sceneApps[i].initPreGL();
        }
        console.log("Kicking resizeDisplayHtml...");
        for (var i = 0; i < this.sceneApps.length; i++) {
            this.sceneApps[i].resizeDisplayHtml();
        }
        console.log("Kicking initGL...");
        for (var i = 0; i < this.sceneApps.length; i++) {
            this.sceneApps[i].initGL();
        }
        console.log("Kicking addEventHandlers...");
        for (var i = 0; i < this.sceneApps.length; i++) {
            this.sceneApps[i].addEventHandlers();
        }
        console.log("Kicking resizeDisplayGL...");
        for (var i = 0; i < this.sceneApps.length; i++) {
            this.sceneApps[i].resizeDisplayGL();
        }
        console.log("Kicking initPostGL...");
        for (var i = 0; i < this.sceneApps.length; i++) {
            this.sceneApps[i].initPostGL();
        }
        console.log("Ready to start render loop...");
    };

    AppLifecycle.prototype.resizeAll = function () {
        for (var i = 0; i < this.sceneApps.length; i++) {
            this.sceneApps[i].adjustWindow();
        }
    };

    return AppLifecycle;
})()
