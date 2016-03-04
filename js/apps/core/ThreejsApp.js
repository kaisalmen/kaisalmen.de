/**
 * Created by Kai Salmen.
 */

"use strict";

KSX.apps.core.ThreeJsApp = (function () {

    var DEFAULT_NEAR = 10;
    var DEFAULT_FAR = -10;

    function ThreeJsApp(user, name, divGLCanvas, verbose) {
        this.user = user;
        this.name = name;

        this.canvas = new KSX.apps.core.Canvas(divGLCanvas, verbose);

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, this.canvas.aspectRatio, 0.1, 10000);
        this.cameraTarget = new THREE.Vector3(0, 0, 0);

        this.sceneOrtho = new THREE.Scene();
        this.cameraOrtho = new THREE.OrthographicCamera(this.canvas.getPixelLeft(), this.canvas.getPixelRight, this.canvas.getPixelTop(), this.canvas.getPixelBottom(), DEFAULT_NEAR, DEFAULT_FAR);

        this.renderer = new THREE.WebGLRenderer({
            canvas: divGLCanvas,
            antialias: true
        });
        this.renderingEndabled = false;
        this.verbose = verbose;
    }

    ThreeJsApp.prototype.getAppName = function () {
        return this.name;
    };

    ThreeJsApp.prototype.initAsync = function () {
        console.log("SceneAppPerspective (" + this.name + "): initAsyncContent");
        this.user.initAsyncContent();
    };

    ThreeJsApp.prototype.initSynchronuous = function () {
        console.log("SceneAppPerspective (" + this.name + "): initPreGL");
        if (typeof this.user.initPreGL == "function") {
            this.user.initPreGL();
        }
        console.log("SceneAppPerspective (" + this.name + "): resizeDisplayHtml");

        console.log("SceneAppPerspective (" + this.name + "): initGL");
        this.resizeDisplayGL();
        this.user.initGL();

        console.log("SceneAppPerspective (" + this.name + "): addEventHandlers");

        console.log("SceneAppPerspective (" + this.name + "): initPostGL");

        console.log("SceneAppPerspective (" + this.name + "): Ready to start render loop!");

        this.renderingEndabled = true;
    };

    ThreeJsApp.prototype.resizeDisplayGL = function () {
        this.canvas.recalcAspectRatio();

        if (this.verbose) {
            console.log("SceneAppPerspective (" + this.name + "): resizeDisplayGL");
        }
        if (typeof this.user.resizeDisplayGL == "function") {
            this.user.resizeDisplayGL();
        }

        this.renderer.setSize(this.canvas.getWidth(), this.canvas.getHeight(), false);

        this.camera.aspect = this.canvas.aspectRatio;
        this.camera.updateProjectionMatrix();


        this.cameraOrtho.left = this.canvas.getPixelLeft();
        this.cameraOrtho.right = this.canvas.getPixelRight();
        this.cameraOrtho.top = this.canvas.getPixelTop();
        this.cameraOrtho.bottom = this.canvas.getPixelBottom();
        this.cameraOrtho.updateProjectionMatrix();
    };

    ThreeJsApp.prototype.render = function () {
        if (this.renderingEndabled) {
            this.user.render();
            this.renderer.render(this.scene, this.camera);
        }
    };

    ThreeJsApp.prototype.resetCamera = function () {
        this.camera.position.set(0, 0, 250);
        this.cameraTarget = new THREE.Vector3(0, 0, 0);
        this.camera.lookAt(this.cameraTarget);
        this.camera.updateProjectionMatrix();
    };

    ThreeJsApp.prototype.getScene = function () {
      return this.scene;
    };

    ThreeJsApp.prototype.getRenderer = function () {
        return this.renderer;
    };

    ThreeJsApp.prototype.getCanvas = function () {
        return this.canvas;
    };

    ThreeJsApp.prototype.getCamera = function () {
        return this.camera;
    };

    ThreeJsApp.prototype.getCameraTarget = function () {
        return this.cameraTarget;
    };

    return ThreeJsApp;
})();
