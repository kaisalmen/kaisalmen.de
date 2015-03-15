/**
 * Created by Kai on 15.03.2015.
 */
/// <reference path="SceneApp.ts" />
var SceneAppPerspective = (function () {
    function SceneAppPerspective(screenWidth, screenHeight) {
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
        this.aspectRatio = screenWidth / screenHeight;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.aspectRatio, 0.1, 10000);
        this.cameraTarget = new THREE.Vector3(0, 0, 0);
    }
    SceneAppPerspective.prototype.resetCamera = function () {
        this.camera.position.set(0, 0, 250);
        this.cameraTarget = new THREE.Vector3(0, 0, 0);
        this.camera.lookAt(this.cameraTarget);
        this.camera.updateProjectionMatrix();
    };
    SceneAppPerspective.prototype.resizeCamera = function () {
        this.aspectRatio = this.screenWidth / this.screenHeight;
        this.camera.updateProjectionMatrix();
    };
    return SceneAppPerspective;
})();
//# sourceMappingURL=SceneAppPerspective.js.map