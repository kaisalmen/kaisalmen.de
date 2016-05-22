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

    function ThreeJsApp(userDefinition) {
        this.definition = {};
        fillDefinition(KSX.apps.core.ThreeJsApp.DefaultDefinition, this.definition);
        fillDefinition(this.definition, userDefinition);

        this.canvas = new KSX.apps.core.Canvas(this.definition.htmlCanvas);

        if (this.definition.useScenePerspective) {
            this.scenePerspective = new KSX.apps.core.ThreeJsApp.ScenePerspective(this.canvas);
        }

        if (this.definition.useSceneOrtho) {
            this.sceneOrtho = new KSX.apps.core.ThreeJsApp.SceneOrtho(this.canvas);
        }

        if (this.definition.useScenePerspective && this.definition.useCube) {
            this.scenePerspective.useCube = true;
        }

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.definition.renderers.regular.canvas,
            antialias: this.definition.renderers.regular.antialias
        });

        this.renderingEndabled = false;
        this.verbose = false;

        this.frameNumber = 0;
        this.initError = false;
    }

    var fillDefinition = function (paramsPredefined, paramsUser) {
        if (paramsUser !== undefined) {
            var potentialValue;

            for (var predefined in paramsPredefined) {
                potentialValue = paramsUser[predefined];

                // renderers definition: special case
                if (predefined === 'renderers') {
                    var predefinedRenderers = paramsPredefined[predefined];

                    var userRenderers = paramsUser[predefined];
                    if (userRenderers === undefined) {
                        paramsUser[predefined] = {};
                        userRenderers = paramsUser[predefined];
                    }

                    for (var predefinedRendererName in predefinedRenderers) {
                        var predefinedRenderer = predefinedRenderers[predefinedRendererName];
                        var userRenderer = userRenderers[predefinedRendererName];

                        if (userRenderer === undefined) {
                            userRenderers[predefinedRendererName] = {};
                            userRenderer = userRenderers[predefinedRendererName];
                        }
                        fillDefinition(predefinedRenderer, userRenderer);
                    }
                }
                else {
                    if (potentialValue !== undefined) {
                        paramsPredefined[predefined] = potentialValue;
                    }
                    else {
                        paramsUser[predefined] = paramsPredefined[predefined];
                    }
                }
            }
        }
    };

    ThreeJsApp.prototype.getAppName = function () {
        return this.definition.name;
    };

    ThreeJsApp.prototype.setVerbose = function (enabled) {
        this.verbose = enabled;
        this.canvas.verbose = enabled;
        if (this.definition.useScenePerspective) {
            this.scenePerspective.verbose = enabled;
        }

        if (this.definition.useSceneOrtho) {
            this.sceneOrtho.verbose = enabled;
        }
    };

    ThreeJsApp.prototype.initAsync = function () {
        console.log("SceneAppPerspective (" + this.definition.name + "): initAsyncContent");
        if (typeof this.definition.user.initAsyncContent == "function") {
            this.definition.user.initAsyncContent();
        }
        else {
            this.initSynchronuous();
        }
    };

    ThreeJsApp.prototype.initSynchronuous = function () {
        console.log("SceneAppPerspective (" + this.definition.name + "): initPreGL");
        if (typeof this.definition.user.initPreGL == "function") {
            this.definition.user.initPreGL();
        }

        console.log("SceneAppPerspective (" + this.definition.name + "): initGL");

        if (this.definition.useScenePerspective) {
            this.scenePerspective.initGL();
        }
        if (this.definition.useSceneOrtho) {
            this.sceneOrtho.initGL();
        }

        this.definition.user.initGL();

        if (!this.initError) {
            this.resizeDisplayGL();

            console.log("SceneAppPerspective (" + this.definition.name + "): addEventHandlers");
            if (typeof this.definition.user.addEventHandlers == "function") {
                this.definition.user.addEventHandlers();
            }

            console.log("SceneAppPerspective (" + this.definition.name + "): initPostGL");
            if (typeof this.definition.user.initPostGL == "function") {
                this.definition.user.initPostGL();
            }

            console.log("SceneAppPerspective (" + this.definition.name + "): Ready to start render loop!");

            this.renderingEndabled = true;
        }
    };

    ThreeJsApp.prototype.resizeDisplayGL = function () {
        this.canvas.recalcAspectRatio();

        if (this.verbose) {
            console.log("SceneAppPerspective (" + this.definition.name + "): resizeDisplayGL");
        }
        if (typeof this.definition.user.resizeDisplayGL == "function") {
            this.definition.user.resizeDisplayGL();
        }

        this.renderer.setSize(this.canvas.getWidth(), this.canvas.getHeight(), false);

        if (this.definition.useScenePerspective) {
            this.scenePerspective.updateCamera();
        }

        if (this.definition.useSceneOrtho) {
            this.sceneOrtho.updateCamera();
        }
    };

    ThreeJsApp.prototype.render = function () {
        if (this.renderingEndabled) {
            this.frameNumber++;
            if (this.renderer.autoClear) {
                this.renderer.clearDepth();
            }
            this.definition.user.render();

            if (this.definition.useScenePerspective) {
                if (this.scenePerspective.useCube) {
                    this.scenePerspective.cameraCube.rotation.copy( this.scenePerspective.camera.rotation );
                    this.renderer.render(this.scenePerspective.sceneCube, this.scenePerspective.cameraCube);
                }

                this.renderer.render(this.scenePerspective.scene, this.scenePerspective.camera);
            }

            if (this.definition.useSceneOrtho) {
                this.renderer.clearDepth();
                this.renderer.render(this.sceneOrtho.scene, this.sceneOrtho.camera);
            }

            if (typeof this.definition.user.renderPost == "function") {
                this.definition.user.renderPost();
            }
        }
    };

    ThreeJsApp.prototype.resetCamera = function () {
        if (this.definition.useScenePerspective) {
            this.scenePerspective.resetCamera();
        }

        if (this.definition.useSceneOrtho) {
            this.sceneOrtho.resetCamera();
        }
    };

    return ThreeJsApp;
})();


KSX.apps.core.ThreeJsApp.DefaultDefinition = {
    user : undefined,
    name : 'None',
    htmlCanvas : undefined,
    renderers : {
        regular : {
            canvas : undefined,
            antialias : true
        }
    },
    useScenePerspective : true,
    useSceneOrtho : false,
    useCube : false
};


KSX.apps.core.ThreeJsApp.ScenePerspective = (function () {

    var DEFAULT_NEAR = 0.1;
    var DEFAULT_FAR = 10000;
    var DEFAULT_FOV = 45;

    function ScenePerspective(canvas) {
        this.canvas = canvas;
        this.verbose = false;
        this.camera = null;
        this.useCube = false;
        this.cameraCube = null;

        this.defaultPosCamera = new THREE.Vector3(100, 100, 100);
        this.defaultUpVector = new THREE.Vector3(0, 1, 0);
        this.defaultPosCameraTarget = new THREE.Vector3(0, 0, 0);
        this.defaultPosCameraCube = new THREE.Vector3(0, 0, 0);

        this.cameraTarget = this.defaultPosCameraTarget;
    }

    ScenePerspective.prototype.setCameraDefaults = function (defaultPosCamera, defaultUpVector, defaultPosCameraTarget, defaultPosCameraCube) {
        if (defaultPosCamera !== undefined && defaultPosCamera !== null) {
            this.defaultPosCamera = defaultPosCamera;
        }
        if (defaultUpVector !== undefined && defaultUpVector !== null) {
            this.defaultUpVector = defaultUpVector;
        }
        if (defaultPosCameraTarget !== undefined && defaultPosCameraTarget !== null) {
            this.defaultPosCameraTarget = defaultPosCameraTarget;
        }
        if (defaultPosCameraCube !== undefined && defaultPosCameraCube !== null) {
            this.defaultPosCameraCube = defaultPosCameraCube;
        }
        this.resetCamera();
    };

    ScenePerspective.prototype.initGL = function () {
        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(DEFAULT_FOV, this.canvas.aspectRatio, DEFAULT_NEAR, DEFAULT_FAR);

        if (this.useCube) {
            this.cameraCube = new THREE.PerspectiveCamera(DEFAULT_FOV, this.canvas.aspectRatio, DEFAULT_NEAR, DEFAULT_FAR);
            this.sceneCube = new THREE.Scene();
        }
        this.resetCamera();
    };

    ScenePerspective.prototype.resetCamera = function () {
        this.camera.position.set(this.defaultPosCamera.x, this.defaultPosCamera.y, this.defaultPosCamera.z);
        this.camera.up = this.defaultUpVector;
        this.cameraTarget = this.defaultPosCameraTarget;

        if (this.useCube) {
            this.cameraCube.position.set(this.defaultPosCameraCube.x, this.defaultPosCameraCube.y, this.defaultPosCameraCube.z);
        }
        this.updateCamera();
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
