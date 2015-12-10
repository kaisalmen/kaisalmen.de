/**
 * Created by Kai Salmen.
 */

"use strict";

KSX.apps.demos.HelloOOSimple = (function () {

    function HelloOOSimple(elementToBindTo) {
        this.sceneApp = new KSX.apps.core.SceneAppPerspective(this, "HelloOOSimple", elementToBindTo);
        var geometry = new THREE.SphereGeometry(1, 32, 32);
        var material = new THREE.MeshNormalMaterial();
        this.mesh =  new THREE.Mesh(geometry, material);
    }

    HelloOOSimple.prototype.initShaders = function() {
        console.log("HelloOOSimple.initShaders is not implemented");
    }

    HelloOOSimple.prototype.initGL = function () {
        this.sceneApp.scene.add(this.mesh);
        this.sceneApp.camera.position.z = 5;
    };

    HelloOOSimple.prototype.render = function () {
        this.mesh.rotation.x += 0.1;
        this.mesh.rotation.y += 0.1;
        this.sceneApp.render();
    };

    return HelloOOSimple;
})();
