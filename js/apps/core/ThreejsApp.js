/**
 * Created by Kai Salmen.
 */

"use strict";


KSX.apps.core.ThreeJsApp = (function () {

    function ThreeJsApp(user, name, divGLCanvas, useScenePerspective, useSceneOrtho) {
        this.user = user;
        this.name = name;

        this.canvas = new KSX.apps.core.Canvas(divGLCanvas);

        this.useScenePerspective = useScenePerspective;
        if (this.useScenePerspective) {
            this.scenePerspective = new KSX.apps.core.ThreeJsApp.ScenePerspective(this.canvas);
        }

        this.useSceneOrtho = useSceneOrtho;
        if (this.useSceneOrtho) {
            this.sceneOrtho = new KSX.apps.core.ThreeJsApp.SceneOrtho(this.canvas);
        }

        this.renderer = null;

        this.renderingEndabled = false;
        this.verbose = false;
    }

    ThreeJsApp.prototype.getAppName = function () {
        return this.name;
    };

    ThreeJsApp.prototype.setVerbose = function (enabled) {
        this.verbose = enabled;
        this.canvas.verbose = enabled;
        if (this.useScenePerspective) {
            this.scenePerspective.verbose = enabled;
        }

        if (this.useSceneOrtho) {
            this.sceneOrtho.verbose = enabled;
        }
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

        console.log("SceneAppPerspective (" + this.name + "): initGL");

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas.htmlCanvas,
            antialias: true
        });

        if (this.useScenePerspective) {
            this.scenePerspective.initGL();
        }
        if (this.useSceneOrtho) {
            this.sceneOrtho.initGL();
        }

        this.user.initGL();
        this.resizeDisplayGL();

        console.log("SceneAppPerspective (" + this.name + "): addEventHandlers");
        if (typeof this.user.addEventHandlers == "function") {
            this.user.addEventHandlers();
        }


        console.log("SceneAppPerspective (" + this.name + "): initPostGL");
        if (typeof this.user.initPostGL == "function") {
            this.user.initPostGL();
        }

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

        if (this.useScenePerspective) {
            this.scenePerspective.updateCamera();
        }

        if (this.useSceneOrtho) {
            this.sceneOrtho.updateCamera();
        }
    };

    ThreeJsApp.prototype.render = function () {
        if (this.renderingEndabled) {
            this.user.render();

            if (this.useScenePerspective) {
                this.renderer.clearDepth();
                this.renderer.render(this.scenePerspective.scene, this.scenePerspective.camera);
            }

            if (this.useSceneOrtho) {
                this.renderer.clearDepth();
                this.renderer.render(this.sceneOrtho.scene, this.sceneOrtho.camera);
            }
        }
    };

    ThreeJsApp.prototype.resetCamera = function () {
        if (this.useScenePerspective) {
            this.scenePerspective.resetCamera();
        }

        if (this.useSceneOrtho) {
            this.sceneOrtho.resetCamera();
        }
    };

    return ThreeJsApp;
}
)();

KSX.apps.core.ThreeJsApp.ScenePerspective = (function () {

    var DEFAULT_NEAR = 0.1;
    var DEFAULT_FAR = 10000;
    var DEFAULT_FOV = 45;
    var DEFAULT_POS = new THREE.Vector3(0, 0, 250);
    var DEFAULT_POS_TARGET = new THREE.Vector3(0, 0, 0);

    function ScenePerspective(canvas) {
        this.canvas = canvas;
        this.verbose = false;
    }

    ScenePerspective.prototype.resetCamera = function () {
        this.camera.position.set(DEFAULT_POS);
        this.cameraTarget = new THREE.Vector3(DEFAULT_POS_TARGET);
        this.camera.lookAt(this.cameraTarget);
        this.camera.updateProjectionMatrix();
    };

    ScenePerspective.prototype.initGL = function () {
        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(DEFAULT_FOV, this.canvas.aspectRatio, DEFAULT_NEAR, DEFAULT_FAR);
        this.cameraTarget = new THREE.Vector3(DEFAULT_POS_TARGET);
    };

    ScenePerspective.prototype.updateCamera = function () {
        this.camera.aspect = this.canvas.aspectRatio;
        this.camera.updateProjectionMatrix();
    };

    ScenePerspective.prototype.getScene = function () {
        return this.scene;
    };

    ScenePerspective.prototype.getCamera = function () {
        return this.camera;
    };

    ScenePerspective.prototype.getCameraTarget = function () {
        return this.cameraTarget;
    };

    return ScenePerspective;

})();

KSX.apps.core.ThreeJsApp.SceneOrtho = (function () {

    var DEFAULT_NEAR = 10;
    var DEFAULT_FAR = -10;
    var DEFAULT_POS = new THREE.Vector3(0, 0, 1);

    function SceneOrtho(canvas) {
        this.canvas = canvas;
        this.verbose = false;
    }

    SceneOrtho.prototype.initGL = function () {
        this.scene = new THREE.Scene();

        this.camera = new THREE.OrthographicCamera(this.canvas.getPixelLeft(), this.canvas.getPixelRight, this.canvas.getPixelTop(), this.canvas.getPixelBottom(), DEFAULT_NEAR, DEFAULT_FAR);
    };

    SceneOrtho.prototype.resetCamera = function () {
        this.camera.position.set(DEFAULT_POS);
        this.camera.updateProjectionMatrix();
    };

    SceneOrtho.prototype.updateCamera = function () {
        this.camera.left = this.canvas.getPixelLeft();
        this.camera.right = this.canvas.getPixelRight();
        this.camera.top = this.canvas.getPixelTop();
        this.camera.bottom = this.canvas.getPixelBottom();

        if (this.verbose) {
            console.log('Ortho Camera Dimensions: ' + this.camera.left + ' ' + this.camera.right + ' ' + this.camera.top + ' ' + this.camera.bottom);
        }

        this.camera.updateProjectionMatrix();
    };

    return SceneOrtho;

})();
