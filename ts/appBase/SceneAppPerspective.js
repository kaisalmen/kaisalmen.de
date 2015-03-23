/**
 * Created by Kai on 15.03.2015.
 */
/// <reference path="AppExecFlow.ts" />
/// <reference path="SceneApp.ts" />
var SceneAppPerspective = (function () {
    function SceneAppPerspective(user, canvasWidth, aspectRatio, canvasMinWidth, divGL) {
        this.user = user;
        this.canvas = new Canvas(canvasWidth, aspectRatio, canvasMinWidth, divGL);
        this.canvas.recalcAspectRatio();
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.canvas.aspectRatio, 0.1, 10000);
        this.cameraTarget = new THREE.Vector3(0, 0, 0);
        this.renderer = new THREE.WebGLRenderer();
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
        this.renderer.setSize(this.canvas.width, this.canvas.height);
        this.user.initGL();
    };
    SceneAppPerspective.prototype.addEventHandlers = function () {
        console.log("SceneAppPerspective: addEventHandlers");
    };
    SceneAppPerspective.prototype.resizeDisplayGL = function () {
        console.log("SceneAppPerspective: resizeDisplayGL");
    };
    SceneAppPerspective.prototype.initPostGL = function () {
        console.log("SceneAppPerspective: initPostGL");
        this.renderer.domElement.style.padding = "0px 0px 0px 0px";
        this.renderer.domElement.style.margin = "0px 0px 0px 0px";
        this.canvas.divGL.appendChild(this.renderer.domElement);
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
        this.canvas.recalcAspectRatio();
        this.camera.aspect = this.canvas.aspectRatio;
        this.camera.updateProjectionMatrix();
    };
    return SceneAppPerspective;
})();
//# sourceMappingURL=SceneAppPerspective.js.map