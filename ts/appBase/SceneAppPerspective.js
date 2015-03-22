/**
 * Created by Kai on 15.03.2015.
 */
/// <reference path="SceneApp.ts" />
/// <reference path="AppExecFlow.ts" />
var SceneAppPerspective = (function () {
    function SceneAppPerspective(appName, canvasWidth, canvasHeight, divGL) {
        this.appName = appName;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.divGL = divGL;
        this.aspectRatio = this.canvasWidth / this.canvasHeight;
        this.execFlow = new APPExecFlow(this);
        this.execFlow.run();
    }
    SceneAppPerspective.prototype.initShaders = function () {
        console.log("SceneAppPerspective: initShaders");
    };
    SceneAppPerspective.prototype.initPreGL = function () {
        console.log("SceneAppPerspective: initPreGL");
    };
    SceneAppPerspective.prototype.resizeDisplayHtml = function () {
        console.log("SceneAppPerspective: resizeDisplayHtml");
    };
    SceneAppPerspective.prototype.initGL = function () {
        console.log("SceneAppPerspective: initGL");
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.aspectRatio, 0.1, 10000);
        this.cameraTarget = new THREE.Vector3(0, 0, 0);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.canvasWidth, this.canvasHeight);
    };
    SceneAppPerspective.prototype.addEventHandlers = function () {
        console.log("SceneAppPerspective: addEventHandlers");
    };
    SceneAppPerspective.prototype.resizeDisplayGL = function () {
        console.log("SceneAppPerspective: resizeDisplayGL");
    };
    SceneAppPerspective.prototype.initPostGL = function () {
        console.log("SceneAppPerspective: initPostGL");
        this.divGL.style.width = this.canvasWidth + "px";
        this.divGL.style.height = this.canvasHeight + "px";
        this.renderer.domElement.style.padding = "0px 0px 0px 0px";
        this.renderer.domElement.style.margin = "0px 0px 0px 0px";
        this.divGL.appendChild(this.renderer.domElement);
    };
    SceneAppPerspective.prototype.render = function () {
        this.renderer.render(this.scene, this.camera);
    };
    SceneAppPerspective.prototype.resetCamera = function () {
        this.camera.position.set(0, 0, 250);
        this.cameraTarget = new THREE.Vector3(0, 0, 0);
        this.camera.lookAt(this.cameraTarget);
        this.camera.updateProjectionMatrix();
    };
    SceneAppPerspective.prototype.resizeCamera = function () {
        this.aspectRatio = this.canvasWidth / this.canvasHeight;
        this.camera.updateProjectionMatrix();
    };
    return SceneAppPerspective;
})();
//# sourceMappingURL=SceneAppPerspective.js.map