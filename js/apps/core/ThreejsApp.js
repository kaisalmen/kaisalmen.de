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
        appRunner : undefined,
        browserVersions : undefined,
        preChecksOk : true
    }
};

KSX.apps.core.ThreeJsApp = (function () {

    function ThreeJsApp(userDefinition) {
        this.definition = userDefinition;
        fillDefinition(KSX.apps.core.ThreeJsApp.DefaultDefinition, this.definition);

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

        for (var predefined in paramsPredefined) {
            // early exit
            if (!paramsPredefined.hasOwnProperty(predefined)) {
                continue;
            }

            // renderer definitions: special treatment as object fields need to be copied (no-refs)
            if (predefined === 'renderers') {

                if (!paramsUser.hasOwnProperty(predefined)) {
                    paramsUser[predefined] = {};
                }
                var userRenderers = paramsUser[predefined];

                if (paramsPredefined.hasOwnProperty(predefined)) {
                    var predefinedRenderers = paramsPredefined[predefined];

                    for (var predefinedRendererName in predefinedRenderers) {
                        // early exit
                        if (!predefinedRenderers.hasOwnProperty(predefinedRendererName)) {
                            continue;
                        }

                        if (!userRenderers.hasOwnProperty(predefinedRendererName)) {
                            userRenderers[predefinedRendererName] = {};
                        }

                        var predefinedRenderer = predefinedRenderers[predefinedRendererName];
                        var userRenderer = userRenderers[predefinedRendererName];
                        fillDefinition(predefinedRenderer, userRenderer);
                    }
                }
                if (userRenderers['regular'].canvas === undefined) {
                    userRenderers['regular'].canvas = paramsUser['htmlCanvas'];
                }
            }
            else {
                if (paramsUser.hasOwnProperty(predefined)) {
                    paramsPredefined[predefined] = paramsUser[predefined];
                }
                else {
                    paramsUser[predefined] = paramsPredefined[predefined];
                }
            }
        }
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


KSX.apps.core.AppRunner = (function () {

    function AppRunner() {
    }

    AppRunner.prototype.addImplementations = function (implementations) {
        this.implementations = implementations;
    };

    AppRunner.prototype.run = function (startRenderLoop) {
        var scope = this;
        var resizeWindow = function () {
            for (var i = 0; i < scope.implementations.length; i++) {
                scope.implementations[i].app.resizeDisplayGL();
            }
        };
        window.addEventListener('resize', resizeWindow, false);

        // kicks init and prepares resources
        console.log("Starting global initialisation phase...");

        var implementation;
        for (var i = 0; i < this.implementations.length; i++) {
            implementation = this.implementations[i];
            implementation.browserContext = this;
            console.log("Registering: " + implementation.app.definition.name);

            implementation.app.initAsync();
        }

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
        for (var i = 0; i < this.implementations.length; i++) {
            this.implementations[i].app.render();
        }
    };

    return AppRunner;

})();

KSX.globals.appRunner = new KSX.apps.core.AppRunner();
