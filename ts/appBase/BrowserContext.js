/**
 * Created by Kai on 22.03.2015.
 */
/// <reference path="../../libs/ts/jquery/jquery.d.ts" />
/// <reference path="SceneApp.ts" />
var BrowserContext = (function () {
    function BrowserContext(name) {
        this.name = name;
        this.execFlow = new APPExecFlow();
        this.sceneApps = new Array();
    }
    BrowserContext.prototype.addSceneApp = function (sceneApp) {
        this.sceneApps.push(sceneApp);
    };
    BrowserContext.prototype.run = function () {
        this.execFlow.run(this.sceneApps);
    };
    return BrowserContext;
})();
var browserContext = new BrowserContext("Browser Context");
$(window).resize(function () {
    for (var i = 0; i < browserContext.sceneApps.length; i++) {
        browserContext.sceneApps[i].adjustWindow(window.innerWidth, window.innerHeight);
    }
});
$(document).ready(function () {
    browserContext.run();
});
//# sourceMappingURL=BrowserContext.js.map