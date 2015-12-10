0/**
 * Created by Kai Salmen.
 */

"use strict";

KSX.appBase.HelloOOShader = (function () {

    function HelloOOShader(elementToBindTo) {
        this.sceneApp = new KSX.appBase.SceneAppPerspective(this, "HelloOOShader", elementToBindTo);
        var geometry = new THREE.TorusKnotGeometry(8, 2, 128, 24);
        var material = new THREE.MeshNormalMaterial();
        this.mesh =  new THREE.Mesh(geometry, material);
    }

    HelloOOShader.prototype.initGL = function () {
        this.sceneApp.scene.add(this.mesh);
        this.sceneApp.camera.position.z = 25;
    };

    HelloOOShader.prototype.render = function () {
        this.mesh.rotation.x += 0.01;
        this.mesh.rotation.y += 0.01;
        this.sceneApp.render();
    };

    return HelloOOShader;
})();
