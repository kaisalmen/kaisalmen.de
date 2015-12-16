/**
 * Created by Kai Salmen.
 */

"use strict";

KSX.apps.demos.HelloOOVideo = (function () {

    function HelloOOVideo(elementToBindTo) {
        this.sceneApp = new KSX.apps.core.SceneAppPerspective(this, "HelloOOVideo", elementToBindTo, false);
        var geometry = new THREE.TorusGeometry(7, 2, 16, 100);
        var material = new THREE.MeshNormalMaterial();
        this.mesh =  new THREE.Mesh(geometry, material);
    }

    HelloOOVideo.prototype.initAsyncContent = function() {
        console.log("HelloOOVideo.initShaders is not implemented");
        this.sceneApp.initSynchronuous();
    }

    HelloOOVideo.prototype.initGL = function () {
        this.sceneApp.scene.add(this.mesh);
        this.sceneApp.camera.position.z = 15;
    };

    HelloOOVideo.prototype.render = function () {
        this.mesh.rotation.x += 0.025;
        this.mesh.rotation.y += 0.025;
    };

    return HelloOOVideo;
})();
