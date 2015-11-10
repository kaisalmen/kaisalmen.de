/**
 * Created by Kai Salmen.
 */

"use strict";

/**
 * This class was started with typescript
 */
var HelloThreejsFirst = (function () {

    function HelloThreejsFirst() {
        this.sceneApp = new SceneAppPerspective(this, document.getElementById("DivGL1Canvas"));
        var geometry = new THREE.SphereGeometry(1, 32, 32);
        var material = new THREE.MeshNormalMaterial();
        this.cube =  new THREE.Mesh(geometry, material);
    }

    HelloThreejsFirst.prototype.getAppName = function () {
        return "first";
    };

    HelloThreejsFirst.prototype.initGL = function () {
        this.sceneApp.scene.add(this.cube);
        this.sceneApp.camera.position.z = 5;
    };

    HelloThreejsFirst.prototype.render = function () {
        this.cube.rotation.x += 0.1;
        this.cube.rotation.y += 0.1;
        this.sceneApp.render();
    };

    return HelloThreejsFirst;
})();

/**
 * This class was started with typescript
 */
var HelloThreejsSecond = (function () {

    function HelloThreejsSecond() {
        this.sceneApp = new SceneAppPerspective(this, document.getElementById("DivGL4Canvas"));
        var geometry = new THREE.BoxGeometry(1, 2, 1);
        var material = new THREE.MeshNormalMaterial();
        this.textStorage = new Text2d();
        this.text = this.textStorage.addText("Hello", "Hello world. This is a text to get a complete line as full as possible!", new THREE.MeshBasicMaterial(), 0.1, 10);
        this.cube = new THREE.Mesh(geometry, material);
        this.sceneApp.scene.add(this.cube);
        this.sceneApp.camera.position.z = 5;
    }

    HelloThreejsSecond.prototype.getAppName = function () {
        return "second";
    };

    HelloThreejsSecond.prototype.initGL = function () {
        this.sceneApp.scene.add(this.cube);
        this.sceneApp.camera.position.z = 5;
        this.text.mesh.position.set(-3, 0, 0);
        this.sceneApp.scene.add(this.text.mesh);
    };

    HelloThreejsSecond.prototype.render = function () {
        this.cube.rotation.x += 0.2;
        this.cube.rotation.y += 0.2;
        this.sceneApp.render();
    };

    return HelloThreejsSecond;
})();

var appLifecycle = new AppLifecycle("App Lifecycle");
var helloThreejsFirst = new HelloThreejsFirst();
var helloThreejsSecond = new HelloThreejsSecond();
appLifecycle.addSceneApp(helloThreejsFirst.sceneApp);
appLifecycle.addSceneApp(helloThreejsSecond.sceneApp);

$(window).resize(function () {
    appLifecycle.resizeAll();
});

$(document).ready(function () {
    appLifecycle.run();
});

var render = function () {
    requestAnimationFrame(render);
    helloThreejsFirst.render();
    helloThreejsSecond.render();
    //document.getElementById("DivGL1").style.width = "50%";
    //document.getElementById("DivGL2").style.width = "50%";
    //document.getElementById("DivGL3").style.width = "50%";
    //document.getElementById("DivGL4").style.width = "50%";
};

render();
