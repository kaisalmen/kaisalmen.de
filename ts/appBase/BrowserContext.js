/**
 * Created by Kai on 22.03.2015.
 */
/// <reference path="../../libs/ts/jquery/jquery.d.ts" />
/// <reference path="SceneApp.ts" />
var BrowserContext = (function () {
    function BrowserContext(name) {
        this.name = name;
        this.sceneApps = new Array();
    }
    BrowserContext.prototype.addSceneApp = function (sceneApp) {
        this.sceneApps.push(sceneApp);
    };
    return BrowserContext;
})();
var browserContext = new BrowserContext("Browser Context");
$(window).resize(function () {
    for (var i = 0; i < browserContext.sceneApps.length; i++) {
        console.log(browserContext.sceneApps[i].appName);
    }
});
//# sourceMappingURL=BrowserContext.js.map