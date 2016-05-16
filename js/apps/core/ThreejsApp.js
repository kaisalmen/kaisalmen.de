/**
 * Created by Kai Salmen.
 */

"use strict";

var KSX = {
    apps : {
        core : {

        },
        demos : {
            impl : {

            }
        },
        learn : {
            impl : {

            },
            worker : {
                impl : {

                }
            }
        },
        zerosouth : {
            impl : {

            }
        },
        shader : {

        },
        tools : {
            webworker : {

            }
        }
    },
    globals : {
        basedir : '../../',
        browserVersions : undefined,
        preChecksOk : true
    }
};

KSX.apps.core.AppLifecycle = (function () {

    function AppLifecycle() {
        this.apps = new Array();
    }

    AppLifecycle.prototype.addApp = function (app) {
        this.apps.push(app);
        console.log("Added app: " + app.getAppName())
    };

    AppLifecycle.prototype.initAsync = function () {
        console.log("Starting global initialisation phase...");

        var currentScene;
        for (var i = 0; i < this.apps.length; i++) {
            currentScene = this.apps[i];
            currentScene.browserContext = this;
            console.log("Registering: " + currentScene.name);

            currentScene.initAsync();
        }
    };

    AppLifecycle.prototype.renderAllApps = function (scope) {
        if (scope === undefined) {
            scope = this;
        }
        for (var i = 0; i < scope.apps.length; i++) {
            scope.apps[i].render();
        }
    };

    AppLifecycle.prototype.resizeAll = function (scope) {
        if (scope === undefined) {
            scope = this;
        }
        for (var i = 0; i < scope.apps.length; i++) {
            scope.apps[i].resizeDisplayGL();
        }
    };

    return AppLifecycle;

})();

KSX.globals.lifecycleInstance = new KSX.apps.core.AppLifecycle();


KSX.apps.core.ThreeJsApp = (function () {

    function ThreeJsApp(user, name, divGLCanvas, useScenePerspective, useSceneOrtho, useCube) {
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

        if (this.useScenePerspective && useCube) {
            this.scenePerspective.useCube = true;
        }

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas.htmlCanvas,
            antialias: true
        });

        this.renderingEndabled = false;
        this.verbose = false;

        this.frameNumber = 0;
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
        if (typeof this.user.initAsyncContent == "function") {
            this.user.initAsyncContent();
        }
        else {
            this.initSynchronuous();
        }
    };

    ThreeJsApp.prototype.initSynchronuous = function () {
        console.log("SceneAppPerspective (" + this.name + "): initPreGL");
        if (typeof this.user.initPreGL == "function") {
            this.user.initPreGL();
        }

        console.log("SceneAppPerspective (" + this.name + "): initGL");

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
            this.frameNumber++;
            if (this.renderer.autoClear) {
                this.renderer.clearDepth();
            }
            this.user.render();

            if (this.useScenePerspective) {
                if (this.scenePerspective.useCube) {
                    this.scenePerspective.cameraCube.rotation.copy( this.scenePerspective.camera.rotation );
                    this.renderer.render(this.scenePerspective.sceneCube, this.scenePerspective.cameraCube);
                }

                this.renderer.render(this.scenePerspective.scene, this.scenePerspective.camera);
            }

            if (this.useSceneOrtho) {
                this.renderer.clearDepth();
                this.renderer.render(this.sceneOrtho.scene, this.sceneOrtho.camera);
            }

            if (typeof this.user.renderPost == "function") {
                this.user.renderPost();
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
    var DEFAULT_POS_CAM = new THREE.Vector3(100, 100, 100);
    var DEFAULT_POS_CAM_TARGET = new THREE.Vector3(0, 0, 0);
    var DEFAULT_POS_CAM_CUBE = new THREE.Vector3(0, 0, 0);

    function ScenePerspective(canvas) {
        this.canvas = canvas;
        this.verbose = false;
        this.camera = null;
        this.cameraTarget = null;
        this.useCube = false;
        this.cameraCube = null;
    }
    ScenePerspective.prototype.initGL = function () {
        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(DEFAULT_FOV, this.canvas.aspectRatio, DEFAULT_NEAR, DEFAULT_FAR);
        this.camera.position.set(DEFAULT_POS_CAM.x, DEFAULT_POS_CAM.y, DEFAULT_POS_CAM.z);
        this.cameraTarget = DEFAULT_POS_CAM_TARGET;

        if (this.useCube) {
            this.cameraCube = new THREE.PerspectiveCamera(DEFAULT_FOV, this.canvas.aspectRatio, DEFAULT_NEAR, DEFAULT_FAR);
            this.cameraCube.position.set(DEFAULT_POS_CAM_CUBE.x, DEFAULT_POS_CAM_CUBE.y, DEFAULT_POS_CAM_CUBE.z);
            this.sceneCube = new THREE.Scene();
        }
    };

    ScenePerspective.prototype.resetCamera = function () {
        this.camera.position.set(DEFAULT_POS_CAM.x, DEFAULT_POS_CAM.y, DEFAULT_POS_CAM.z);
        this.cameraTarget = DEFAULT_POS_CAM_TARGET;
        this.camera.lookAt(this.cameraTarget);
        this.camera.updateProjectionMatrix();
    };

    ScenePerspective.prototype.updateCamera = function () {
        this.camera.aspect = this.canvas.aspectRatio;
        this.camera.lookAt(this.cameraTarget);
        this.camera.updateProjectionMatrix();

        if (this.useCube) {
            this.cameraCube.rotation.copy( this.camera.rotation );
            this.cameraCube.aspectRatio = this.canvas.aspectRatio;
            this.cameraCube.updateProjectionMatrix();
        }
    };

    return ScenePerspective;

})();


KSX.apps.core.ThreeJsApp.SceneOrtho = (function () {

    var DEFAULT_NEAR = 10;
    var DEFAULT_FAR = -10;
    var DEFAULT_POS_CAM = new THREE.Vector3(0, 0, 1);

    function SceneOrtho(canvas) {
        this.canvas = canvas;
        this.verbose = false;
    }

    SceneOrtho.prototype.initGL = function () {
        this.scene = new THREE.Scene();

        this.camera = new THREE.OrthographicCamera(this.canvas.getPixelLeft(), this.canvas.getPixelRight, this.canvas.getPixelTop(), this.canvas.getPixelBottom(), DEFAULT_NEAR, DEFAULT_FAR);
    };

    SceneOrtho.prototype.resetCamera = function () {
        this.camera.position.set(DEFAULT_POS_CAM.x, DEFAULT_POS_CAM.y, DEFAULT_POS_CAM.z);
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

KSX.apps.demos.AppRunner = (function () {

    function AppRunner(implementations) {
        this.implementations = implementations;
    }

    AppRunner.prototype.init = function (startRenderLoop) {
        var resizeWindow = function () {
            KSX.globals.lifecycleInstance.resizeAll(KSX.globals.lifecycleInstance);
        };
        window.addEventListener('resize', resizeWindow, false);

        for (var i = 0; i < this.implementations.length; i++) {
            var impl = this.implementations[i];
            console.log('Starting application: ' + impl.app.name);
            KSX.globals.lifecycleInstance.addApp(impl.app);
        }

        // kicks init and prepares resources
        KSX.globals.lifecycleInstance.initAsync();

        if (startRenderLoop) {
            this.startRenderLoop();
        }
    };

    AppRunner.prototype.startRenderLoop = function () {
        var scope = this;
        var render = function () {
            requestAnimationFrame(render);
            scope.render();
        };
        render();
    };

    AppRunner.prototype.render = function () {
        KSX.globals.lifecycleInstance.renderAllApps(KSX.globals.lifecycleInstance);
    };

    return AppRunner;

})();
