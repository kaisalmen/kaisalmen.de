/**
 * Created by Kai on 15.03.2015.
 */
/// <reference path="SceneApp.ts" />
var SceneAppPerspective = (function () {
    function SceneAppPerspective(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.aspectRatio = this.canvasWidth / this.canvasHeight;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.aspectRatio, 0.1, 10000);
        this.cameraTarget = new THREE.Vector3(0, 0, 0);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.canvasWidth, this.canvasHeight);
    }
    SceneAppPerspective.prototype.setCanvasHtmlElement = function (divGL) {
        divGL.style.width = this.canvasWidth + "px";
        divGL.style.height = this.canvasHeight + "px";
        this.renderer.domElement.style.padding = "0px 0px 0px 0px";
        this.renderer.domElement.style.margin = "0px 0px 0px 0px";
        divGL.appendChild(this.renderer.domElement);
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