/**
 * Created by Kai Salmen.
 */

"use strict";

/**
 * This class was started with typescript
 */
var HelloOOSimple = (function () {

    function HelloOOSimple(elementToBindTo) {
        this.sceneApp = new SceneAppPerspective(this, elementToBindTo);
        var geometry = new THREE.SphereGeometry(1, 32, 32);
        var material = new THREE.MeshNormalMaterial();
        this.sphere =  new THREE.Mesh(geometry, material);
    }

    HelloOOSimple.prototype.getAppName = function () {
        return "HelloOOSimple";
    };

    HelloOOSimple.prototype.initGL = function () {
        this.sceneApp.scene.add(this.sphere);
        this.sceneApp.camera.position.z = 5;
    };

    HelloOOSimple.prototype.render = function () {
        this.sphere.rotation.x += 0.1;
        this.sphere.rotation.y += 0.1;
        this.sceneApp.render();
    };

    return HelloOOSimple;
})();
