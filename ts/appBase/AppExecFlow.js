/**
 * Created by Kai on 20.03.2015.
 */
/// <reference path="SceneApp.ts" />
var APPExecFlow = (function () {
    function APPExecFlow() {
    }
    APPExecFlow.prototype.run = function (sceneApps) {
        console.log("Starting global initialisation phase...");
        console.log("Kicking initShaders...");
        for (var i = 0; i < sceneApps.length; i++) {
            sceneApps[i].initShaders();
        }
        console.log("Kicking initPreGL...");
        for (var i = 0; i < sceneApps.length; i++) {
            sceneApps[i].initPreGL();
        }
        console.log("Kicking resizeDisplayHtml...");
        for (var i = 0; i < sceneApps.length; i++) {
            sceneApps[i].resizeDisplayHtml();
        }
        console.log("Kicking initGL...");
        for (var i = 0; i < sceneApps.length; i++) {
            sceneApps[i].initGL();
        }
        console.log("Kicking addEventHandlers...");
        for (var i = 0; i < sceneApps.length; i++) {
            sceneApps[i].addEventHandlers();
        }
        console.log("Kicking resizeDisplayGL...");
        for (var i = 0; i < sceneApps.length; i++) {
            sceneApps[i].resizeDisplayGL();
        }
        console.log("Kicking initPostGL...");
        for (var i = 0; i < sceneApps.length; i++) {
            sceneApps[i].initPostGL();
        }
        console.log("Ready to start render loop...");
    };
    return APPExecFlow;
})();
//# sourceMappingURL=AppExecFlow.js.map