/**
 * Created by Kai Salmen.
 */

"use strict";

/**
 * This class was started with typescript
 */
var HelloOOText = (function () {

    function HelloOOText(elementToBindTo) {
        this.sceneApp = new SceneAppPerspective(this, elementToBindTo);
        var geometry = new THREE.BoxGeometry(1, 2, 1);
        var material = new THREE.MeshNormalMaterial();
        this.textStorage = new Text2d();
        this.text = this.textStorage.addText("Hello", "Hello world. This is a text to get a complete line as full as possible!", new THREE.MeshBasicMaterial(), 0.1, 10);
        this.sphere = new THREE.Mesh(geometry, material);
        this.sceneApp.scene.add(this.sphere);
        this.sceneApp.camera.position.z = 5;
    }

    HelloOOText.prototype.getAppName = function () {
        return "HelloOOText";
    };

    HelloOOText.prototype.initGL = function () {
        this.sceneApp.scene.add(this.sphere);
        this.sceneApp.camera.position.z = 5;
        this.text.mesh.position.set(-3, 0, 0);
        this.sceneApp.scene.add(this.text.mesh);
    };

    HelloOOText.prototype.render = function () {
        this.sphere.rotation.x += 0.2;
        this.sphere.rotation.y += 0.2;
        this.sceneApp.render();
    };

    return HelloOOText;
})();