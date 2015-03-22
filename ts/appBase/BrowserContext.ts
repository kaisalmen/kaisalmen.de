/**
 * Created by Kai on 22.03.2015.
 */

/// <reference path="../../libs/ts/jquery/jquery.d.ts" />
/// <reference path="SceneApp.ts" />

class BrowserContext {

    name : string;
    sceneApps : Array<SceneApp>;

    constructor(name : string) {
        this.name = name;
        this.sceneApps = new Array<SceneApp>();
    }

    addSceneApp(sceneApp : SceneApp) {
        this.sceneApps.push(sceneApp);
    }
}

var browserContext = new BrowserContext("Browser Context");

$(window).resize(
    function() {
        for (var i : number = 0; i < browserContext.sceneApps.length; i++) {
            console.log(browserContext.sceneApps[i].appName);
        }
    }
);