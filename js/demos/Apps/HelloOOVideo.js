/**
 * Created by Kai Salmen.
 */

"use strict";

KSX.appBase.HelloOOVideo = (function () {

    function HelloOOVideo(elementToBindTo) {
        this.sceneApp = new KSX.appBase.SceneAppPerspective(this, "HelloOOVideo", elementToBindTo);
        var geometry = new THREE.TorusGeometry(7, 2, 16, 100);
        var material = new THREE.MeshNormalMaterial();
        this.mesh =  new THREE.Mesh(geometry, material);
    }

    HelloOOVideo.prototype.initGL = function () {
        this.sceneApp.scene.add(this.mesh);
        this.sceneApp.camera.position.z = 15;
    };

    HelloOOVideo.prototype.render = function () {
        this.mesh.rotation.x += 0.025;
        this.mesh.rotation.y += 0.025;
        this.sceneApp.render();
    };

    return HelloOOVideo;
})();
