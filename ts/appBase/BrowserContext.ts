/**
 * Created by Kai on 22.03.2015.
 */

/// <reference path="../../libs/ts/jquery/jquery.d.ts" />
/// <reference path="SceneApp.ts" />

class BrowserContext {

    name: string;
    sceneApps: Array<SceneApp>;

    windowWidth: number;
    windowHeight: number;

    constructor(name : string) {
        this.name = name;
        this.sceneApps = new Array<SceneApp>();
    }

    addSceneApp(sceneApp : SceneApp) {
        this.sceneApps.push(sceneApp);
    }

    run() {
        console.log("Starting global initialisation phase...");

        console.log("Kicking register...");
        for (var i : number = 0; i < this.sceneApps.length; i++) {
            this.sceneApps[i].browserContext = this;
        }

        console.log("Kicking initShaders...");
        for (var i : number = 0; i < this.sceneApps.length; i++) {
            this.sceneApps[i].initShaders();
        }

        console.log("Kicking initPreGL...");
        for (var i : number = 0; i < this.sceneApps.length; i++) {
            this.sceneApps[i].initPreGL();
        }

        console.log("Kicking resizeDisplayHtml...");
        for (var i : number = 0; i < this.sceneApps.length; i++) {
            this.sceneApps[i].resizeDisplayHtml();
        }

        console.log("Kicking initGL...");
        for (var i : number = 0; i < this.sceneApps.length; i++) {
            this.sceneApps[i].initGL();
        }

        console.log("Kicking addEventHandlers...");
        for (var i : number = 0; i < this.sceneApps.length; i++) {
            this.sceneApps[i].addEventHandlers();
        }

        console.log("Kicking resizeDisplayGL...");
        for (var i : number = 0; i < this.sceneApps.length; i++) {
            this.sceneApps[i].resizeDisplayGL();
        }

        console.log("Kicking initPostGL...");
        for (var i : number = 0; i < this.sceneApps.length; i++) {
            this.sceneApps[i].initPostGL();
        }

        console.log("Ready to start render loop...");
    }
}

var browserContext = new BrowserContext("Browser Context");

$(window).resize(
    function() {
        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;
        for (var i : number = 0; i < browserContext.sceneApps.length; i++) {
            browserContext.sceneApps[i].adjustWindow();
        }
    }
);

$(document).ready(
    function() {
        browserContext.run();
    }
)