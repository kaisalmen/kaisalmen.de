/**
 * Created by Kai Salmen.
 */

"use strict";

/**
 * This class was started with typescript
 */
var HelloOOVideo = (function () {

    function HelloOOVideo(elementToBindTo) {
        this.sceneApp = new SceneAppPerspective(this, elementToBindTo);
        var geometry = new THREE.TorusGeometry(7, 2, 16, 100);
        var material = new THREE.MeshNormalMaterial();
        this.torus =  new THREE.Mesh(geometry, material);
    }

    HelloOOVideo.prototype.getAppName = function () {
        return "HelloOOVideo";
    };

    HelloOOVideo.prototype.initGL = function () {
        this.sceneApp.scene.add(this.torus);
        this.sceneApp.camera.position.z = 15;
    };

    HelloOOVideo.prototype.render = function () {
        this.torus.rotation.x += 0.025;
        this.torus.rotation.y += 0.025;
        this.sceneApp.render();
    };

    return HelloOOVideo;
})();
