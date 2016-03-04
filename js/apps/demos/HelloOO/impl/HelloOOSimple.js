/**
 * Created by Kai Salmen.
 */

"use strict";

KSX.apps.demos.HelloOOSimple = (function () {

    function HelloOOSimple(elementToBindTo) {
        this.app = new KSX.apps.core.ThreeJsApp(this, "HelloOOSimple", elementToBindTo, true, false);
        var geometry = new THREE.SphereGeometry(1, 32, 32);
        var material = new THREE.MeshNormalMaterial();
        this.mesh =  new THREE.Mesh(geometry, material);
    }

    HelloOOSimple.prototype.initAsyncContent = function() {
        console.log("HelloOOSimple.initAsyncContent is not required!");
        this.app.initSynchronuous();
    };

    HelloOOSimple.prototype.initGL = function () {
        this.app.scenePerspective.scene.add(this.mesh);
        this.app.scenePerspective.camera.position.z = 5;
    };

    HelloOOSimple.prototype.render = function () {
        this.mesh.rotation.x += 0.1;
        this.mesh.rotation.y += 0.1;
    };

    return HelloOOSimple;
})();
