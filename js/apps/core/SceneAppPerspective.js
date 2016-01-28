/**
 * Created by Kai Salmen.
 */

"use strict";

KSX.apps.core.SceneAppPerspective = (function () {

    function SceneAppPerspective(user, name, divGLCanvas, verbose) {
        this.user = user;
        this.name = name;
        this.canvas = new KSX.apps.core.Canvas(divGLCanvas, verbose);
        this.canvas.recalcAspectRatio();
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.canvas.aspectRatio, 0.1, 10000);
        this.cameraTarget = new THREE.Vector3(0, 0, 0);
        this.renderer = new THREE.WebGLRenderer({
            canvas: divGLCanvas,
            antialias: true
        });
        this.renderingEndabled = false;
        this.verbose = verbose;
    }

    SceneAppPerspective.prototype.getAppName = function () {
        return this.name;
    };

    SceneAppPerspective.prototype.initAsync = function () {
        console.log("SceneAppPerspective (" + this.name + "): initAsyncContent");
        this.user.initAsyncContent(this.user);
    };

    SceneAppPerspective.prototype.initSynchronuous = function () {
        console.log("SceneAppPerspective (" + this.name + "): initPreGL");

        console.log("SceneAppPerspective (" + this.name + "): resizeDisplayHtml");

        console.log("SceneAppPerspective (" + this.name + "): initGL");
        this.resizeDisplayGL();
        this.user.initGL();

        console.log("SceneAppPerspective (" + this.name + "): addEventHandlers");

        console.log("SceneAppPerspective (" + this.name + "): initPostGL");

        console.log("SceneAppPerspective (" + this.name + "): Ready to start render loop!");

        this.renderingEndabled = true;
    };

    SceneAppPerspective.prototype.resizeDisplayGL = function () {
        if (this.verbose) {
            console.log("SceneAppPerspective (" + this.name + "): resizeDisplayGL");
        }
        if (typeof this.user.resizeDisplayGL == "function") {
            this.user.resizeDisplayGL();
        }

        this.renderer.setSize(this.canvas.getWidth(), this.canvas.getHeight(), false);
    };

    SceneAppPerspective.prototype.render = function () {
        if (this.renderingEndabled) {
            this.user.render();
            this.renderer.render(this.scene, this.camera);
        }
    };

    SceneAppPerspective.prototype.adjustWindow = function () {
        this.canvas.recalcAspectRatio();
        this.resizeDisplayGL();

        this.camera.aspect = this.canvas.aspectRatio;
        this.camera.updateProjectionMatrix();
    };

    SceneAppPerspective.prototype.resetCamera = function () {
        this.camera.position.set(0, 0, 250);
        this.cameraTarget = new THREE.Vector3(0, 0, 0);
        this.camera.lookAt(this.cameraTarget);
        this.camera.updateProjectionMatrix();
    };

    SceneAppPerspective.prototype.getScene = function () {
      return this.scene;
    };

    SceneAppPerspective.prototype.getRenderer = function () {
        return this.renderer;
    };

    SceneAppPerspective.prototype.getCanvas = function () {
        return this.canvas;
    };

    SceneAppPerspective.prototype.getCamera = function () {
        return this.camera;
    };

    SceneAppPerspective.prototype.getCameraTarget = function () {
        return this.cameraTarget;
    };

    return SceneAppPerspective;
})();
