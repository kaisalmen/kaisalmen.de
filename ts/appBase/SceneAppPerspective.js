/**
 * Created by Kai on 15.03.2015.
 */
/// <reference path="SceneApp.ts" />
var SceneAppPerspective = (function () {
    function SceneAppPerspective(user, divGL, divGLCanvas) {
        this.user = user;
        this.canvas = new Canvas(divGLCanvas);
        this.canvas.recalcAspectRatio();
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.canvas.aspectRatio, 0.1, 10000);
        this.cameraTarget = new THREE.Vector3(0, 0, 0);
        this.renderer = new THREE.WebGLRenderer({
            canvas: divGLCanvas,
            antialias: true
        });
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
        this.resizeDisplayGL();
        this.user.initGL();
    };
    SceneAppPerspective.prototype.addEventHandlers = function () {
        console.log("SceneAppPerspective: addEventHandlers");
    };
    SceneAppPerspective.prototype.resizeDisplayGL = function () {
        console.log("SceneAppPerspective: resizeDisplayGL");
        this.renderer.setSize(this.canvas.getWidth(), this.canvas.getHeight(), false);
    };
    SceneAppPerspective.prototype.initPostGL = function () {
        console.log("SceneAppPerspective: initPostGL");
    };
    SceneAppPerspective.prototype.render = function () {
        this.renderer.render(this.scene, this.camera);
    };
    SceneAppPerspective.prototype.adjustWindow = function () {
        this.resizeDisplayGL();
        this.canvas.recalcAspectRatio();
        this.camera.aspect = this.canvas.aspectRatio;
        this.camera.updateProjectionMatrix();
    };
    SceneAppPerspective.prototype.resetCamera = function () {
        this.camera.position.set(0, 0, 250);
        this.cameraTarget = new THREE.Vector3(0, 0, 0);
        this.camera.lookAt(this.cameraTarget);
        this.camera.updateProjectionMatrix();
    };
    return SceneAppPerspective;
})();
//# sourceMappingURL=SceneAppPerspective.js.map