/**
 * Created by Kai on 20.03.2015.
 */
/// <reference path="SceneApp.ts" />
var APPExecFlow = (function () {
    function APPExecFlow(sceneApp) {
        this.sceneApp = sceneApp;
    }
    APPExecFlow.prototype.run = function () {
        console.log("Starting global initialisation phase...");
        console.log("Kicking initShaders...");
        this.sceneApp.initShaders();
        console.log("Kicking initPreGL...");
        this.sceneApp.initPreGL();
        console.log("Kicking resizeDisplayHtml...");
        this.sceneApp.resizeDisplayHtml();
        console.log("Kicking initGL...");
        this.sceneApp.initGL();
        console.log("Kicking addEventHandlers...");
        this.sceneApp.addEventHandlers();
        console.log("Kicking resizeDisplayGL...");
        this.sceneApp.resizeDisplayGL();
        console.log("Kicking initPostGL...");
        this.sceneApp.initPostGL();
        console.log("Ready to start render loop...");
    };
    return APPExecFlow;
})();
//# sourceMappingURL=AppExecFlow.js.map