/**
 * Created by Kai on 14.03.2015.
 */
/// <reference path="../libs/ts/threejs/three.d.ts" />
var Camera = (function () {
    function Camera(windowWidth, windowHeight, fov, near, far) {
        var aspect = windowWidth / windowHeight;
        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    }
    Camera.prototype.getThreejsCam = function () {
        return this.camera;
    };
    return Camera;
})();
var HelloThreejs = (function () {
    function HelloThreejs() {
        this.scene = new THREE.Scene();
        this.camera = new Camera(window.innerWidth, window.innerHeight, 75, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        var divGL = document.getElementById("AppWebGL");
        divGL.appendChild(this.renderer.domElement);
        var geometry = new THREE.BoxGeometry(1, 1, 1);
        var material = new THREE.MeshNormalMaterial();
        this.cube = new THREE.Mesh(geometry, material);
        this.scene.add(this.cube);
        this.camera.getThreejsCam().position.z = 5;
    }
    HelloThreejs.prototype.render = function () {
        this.cube.rotation.x += 0.1;
        this.cube.rotation.y += 0.1;
        this.renderer.render(this.scene, this.camera.getThreejsCam());
    };
    return HelloThreejs;
})();
var helloThreejs = new HelloThreejs();
var render = function () {
    requestAnimationFrame(render);
    helloThreejs.render();
};
render();
//# sourceMappingURL=HelloThreejs.js.map