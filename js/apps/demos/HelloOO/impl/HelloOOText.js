/**
 * Created by Kai Salmen.
 */

"use strict";

KSX.apps.demos.HelloOOText = (function () {

    function HelloOOText(elementToBindTo) {
        this.app = new KSX.apps.core.ThreeJsApp(this, "HelloOOText", elementToBindTo, false);
        var geometry = new THREE.BoxGeometry(1, 2, 1);
        var material = new THREE.MeshNormalMaterial();
        this.textStorage = new KSX.apps.core.Text2d();
        this.text = this.textStorage.addText("Hello", "Hello world. This text fills the line as much as possible!", new THREE.MeshBasicMaterial(), 0.1, 10);
        this.mesh = new THREE.Mesh(geometry, material);
        this.app.scene.add(this.box);
        this.app.camera.position.z = 5;
    }

    HelloOOText.prototype.initAsyncContent = function() {
        console.log("HelloOOText.initAsyncContent is not required!");
        this.app.initSynchronuous();
    }

    HelloOOText.prototype.initGL = function () {
        this.app.scene.add(this.mesh);
        this.app.camera.position.z = 5;
        this.text.mesh.position.set(-3, 0, 0);
        this.app.scene.add(this.text.mesh);
    };

    HelloOOText.prototype.render = function () {
        this.mesh.rotation.x += 0.02;
        this.mesh.rotation.y += 0.02;
    };

    return HelloOOText;
})();