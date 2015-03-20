/**
 * Created by Kai on 14.03.2015.
 */

/// <reference path="../libs/ts/threejs/three.d.ts" />
/// <reference path="./appBase/AppExecFlow.ts" />
/// <reference path="./appBase/SceneApp.ts" />
/// <reference path="./appBase/SceneAppPerspective.ts" />

class HelloThreejsFirst {

    private sceneApp : SceneApp;
    private cube : THREE.Mesh;

    constructor() {
        this.sceneApp = new SceneAppPerspective((window.innerWidth / 2) - 8, window.innerHeight - 16, document.getElementById("AppWebGL1"));

        var geometry = new THREE.BoxGeometry(1, 1, 1);
        var material = new THREE.MeshNormalMaterial();
        this.cube = new THREE.Mesh(geometry, material);
        this.sceneApp.scene.add(this.cube);
        this.sceneApp.camera.position.z = 5;
    }

    render() {
        this.cube.rotation.x += 0.1;
        this.cube.rotation.y += 0.1;
        this.sceneApp.render();
    }
}

class HelloThreejsSecond {

    private sceneApp : SceneApp;
    private cube : THREE.Mesh;

    constructor() {
        this.sceneApp = new SceneAppPerspective((window.innerWidth / 2) - 8, window.innerHeight - 16, document.getElementById("AppWebGL2"));

        var geometry = new THREE.BoxGeometry(1, 2, 1);
        var material = new THREE.MeshNormalMaterial();

        this.cube = new THREE.Mesh(geometry, material);
        this.sceneApp.scene.add(this.cube);
        this.sceneApp.camera.position.z = 5;
    }

    render() {
        this.cube.rotation.x += 0.2;
        this.cube.rotation.y += 0.2;
        this.sceneApp.render();
    }
}

var helloThreejsFirst = new HelloThreejsFirst();
var helloThreejsSecond = new HelloThreejsSecond();

var render = function () {
    requestAnimationFrame(render);
    helloThreejsFirst.render();
    helloThreejsSecond.render();
};

render();







