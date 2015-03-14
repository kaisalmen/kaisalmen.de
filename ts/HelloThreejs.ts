/**
 * Created by Kai on 14.03.2015.
 */

/// <reference path="../libs/ts/threejs/three.d.ts" />

class Camera {
    private camera : THREE.PerspectiveCamera;

    constructor(windowWidth : number, windowHeight : number, fov : number, near : number, far : number) {
        var aspect = windowWidth / windowHeight;
        this.camera =  new THREE.PerspectiveCamera(fov, aspect, near, far);
    }

    getThreejsCam() {
        return this.camera;
    }

}

class HelloThreejs {

    private cube : THREE.Mesh;
    private scene : THREE.Scene;
    private camera : Camera;
    private renderer : THREE.WebGLRenderer;

    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new Camera(window.innerWidth, window.innerHeight, 75, 0.1, 1000 );
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        var divGL = document.getElementById("AppWebGL");
        divGL.appendChild(this.renderer.domElement);

        var geometry = new THREE.BoxGeometry( 1, 1, 1 );
        var material = new THREE.MeshNormalMaterial();
        this.cube = new THREE.Mesh( geometry, material );
        this.scene.add( this.cube );
        this.camera.getThreejsCam().position.z = 5;
    }

    render() {
        this.cube.rotation.x += 0.1;
        this.cube.rotation.y += 0.1;
        this.renderer.render(this.scene, this.camera.getThreejsCam());
    }
}

var helloThreejs = new HelloThreejs();

var render = function () {
    requestAnimationFrame( render );
    helloThreejs.render();
};

render();







