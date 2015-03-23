/**
 * Created by Kai on 22.03.2015.
 */

/// <reference path="../../libs/ts/jquery/jquery.d.ts" />
/// <reference path="SceneApp.ts" />

class BrowserContext {

    name : string;
    sceneApps : Array<SceneApp>;
    execFlow : APPExecFlow;

    constructor(name : string) {
        this.name = name;
        this.execFlow = new APPExecFlow();
        this.sceneApps = new Array<SceneApp>();
    }

    addSceneApp(sceneApp : SceneApp) {
        this.sceneApps.push(sceneApp);
    }

    run() {
        this.execFlow.run(this.sceneApps);
    }
}

var browserContext = new BrowserContext("Browser Context");

$(window).resize(
    function() {
        for (var i : number = 0; i < browserContext.sceneApps.length; i++) {
            browserContext.sceneApps[i].canvas.width = window.innerWidth;
            browserContext.sceneApps[i].resizeCamera();
        }
    }
);

$(document).ready(
    function() {
        browserContext.run();
    }
)