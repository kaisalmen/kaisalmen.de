/**
 * Created by Kai on 14.03.2015.
 */

/// <reference path="../libs/ts/threejs/three.d.ts" />
/// <reference path="./appBase/SceneApp.ts" />
/// <reference path="./appBase/SceneAppPerspective.ts" />

class HelloThreejs {

    private sceneApp : SceneApp;
    private renderer : THREE.WebGLRenderer;
    private cube : THREE.Mesh;

    constructor() {
        this.sceneApp = new SceneAppPerspective(window.innerWidth, window.innerHeight);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.sceneApp.screenWidth, this.sceneApp.screenHeight);

        var divGL = document.getElementById("AppWebGL");
        divGL.appendChild(this.renderer.domElement);

        var geometry = new THREE.BoxGeometry( 1, 1, 1 );
        var material = new THREE.MeshNormalMaterial();
        this.cube = new THREE.Mesh( geometry, material );
        this.sceneApp.scene.add(this.cube);
        this.sceneApp.camera.position.z = 5;
    }

    render() {
        this.cube.rotation.x += 0.1;
        this.cube.rotation.y += 0.1;
        this.renderer.render(this.sceneApp.scene, this.sceneApp.camera);
    }
}

var helloThreejs = new HelloThreejs();

var render = function () {
    requestAnimationFrame( render );
    helloThreejs.render();
};

render();







