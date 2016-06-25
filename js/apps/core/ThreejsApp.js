/**
 * @author Kai Salmen / www.kaisalmen.de
 */

"use strict";

var KSX = {
    apps : {
        core : {

        }
    }
};



if ( KSX.globals === undefined ) {
    KSX.globals = {}
}
if ( KSX.globals.basedir === undefined ) {
    KSX.globals.basedir = '../../';
}
if ( KSX.globals.browserVersions === undefined ) {
    KSX.globals.browserVersions = null;
}
if ( KSX.globals.preChecksOk === undefined ) {
    KSX.globals.preChecksOk = true;
}

if ( KSX.apps.demos === undefined ) {
    KSX.apps.demos = {}
}

if ( KSX.apps.tools === undefined ) {
    KSX.apps.tools = {
        webworker: {
        }
    }
}
else {
    if ( KSX.apps.tools.webworker === undefined ) {
        KSX.apps.tools.webworker = {

        }
    }
}

KSX.apps.core.ThreeJsApp = (function () {

    function ThreeJsApp() {
        this.renderingEnabled = false;

        this.frameNumber = 0;
        this.initOk = true;

        this.asyncDone = false;
    }

    ThreeJsApp.prototype.configure = function (userDefinition) {
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

        // auto-clear must not be used when both perspective and ortho scenes are active
        // otherwise: renderer clears 3d content
        if ( this.definition.useScenePerspective && this.definition.useSceneOrtho ) {
            this.renderer.autoClear = false;
        }

        if ( this.definition.verbose ) {
            this.canvas.verbose = this.definition.verbose;
            if ( this.definition.useScenePerspective ) {
                this.scenePerspective.verbose = this.definition.verbose;
            }

            if ( this.definition.useSceneOrtho ) {
                this.sceneOrtho.verbose = this.definition.verbose;
            }
        };
    };

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
                if (!paramsUser.hasOwnProperty(predefined)) {
                    paramsUser[predefined] = paramsPredefined[predefined];
                }
            }
        }
    };

    ThreeJsApp.prototype.init = function () {
        var scope = this;

        scope.initAsyncContent();

        var initSync = function () {
            console.log("ThreeJsApp (" + scope.definition.name + "): initPreGL");
            scope.initPreGL();

            if ( !scope.initOk ) { return; }
            console.log("ThreeJsApp (" + scope.definition.name + "): initGL");
            if (scope.definition.useScenePerspective) {
                scope.scenePerspective.initGL();
                if ( !scope.initOk ) { return; }
            }
            if (scope.definition.useSceneOrtho) {
                scope.sceneOrtho.initGL();
                if ( !scope.initOk ) { return; }
            }

            scope.initGL();
            if ( !scope.initOk ) { return; }

            console.log("ThreeJsApp (" + scope.definition.name + "): resizeDisplayGLBase");
            scope.resizeDisplayGLBase();

            console.log("ThreeJsApp (" + scope.definition.name + "): addEventHandlers");
            scope.addEventHandlers();

            console.log("ThreeJsApp (" + scope.definition.name + "): initPostGL");
            scope.renderingEnabled = scope.initPostGL();
            if ( !scope.initOk ) { return; }

            if ( scope.renderingEnabled ) {
                console.log("ThreeJsApp (" + scope.definition.name + "): Ready to start render loop!");
            }
        };

        var checkAsyncStatus = setInterval( checkAsyncStatusTimer, 10);

        function checkAsyncStatusTimer() {
            if ( scope.asyncDone ) {
                clearInterval(checkAsyncStatus);
                initSync();
            }
            else {
                console.log( 'waiting' );
            }
        }
    };

    ThreeJsApp.prototype.verifyHwInstancingSupport = function ( setGlobalInitFlag ) {
        var supported = true;

        var resInstancedArrays = this.renderer.extensions.get( 'ANGLE_instanced_arrays' );
        if ( resInstancedArrays === undefined || resInstancedArrays === null ) {
            var divNotSupported = document.getElementById('DivNotSupported');
            if ( divNotSupported !== undefined && divNotSupported !== null ) {
                divNotSupported.style.display = "";
            }
            else {
                console.error( 'Div "DivNotSupported" for showing error message does not exist!' );
            }
            supported = false;
        }

        if ( setGlobalInitFlag ) {
            this.initOk = supported;
        }

        return supported;
    };

    ThreeJsApp.prototype.resizeDisplayGLBase = function () {
        this.canvas.recalcAspectRatio();

        this.resizeDisplayGL();

        this.renderer.setSize(this.canvas.getWidth(), this.canvas.getHeight(), false);

        if (this.definition.useScenePerspective) {
            this.scenePerspective.updateCamera();
        }

        if (this.definition.useSceneOrtho) {
            this.sceneOrtho.updateCamera();
        }
    };

    ThreeJsApp.prototype.render = function () {
        if (this.renderingEnabled) {
            this.frameNumber++;
            if ( !this.renderer.autoClear ) {
                this.renderer.clear();
            }

            this.renderPre();

            if (this.definition.useScenePerspective) {
                if (this.scenePerspective.useCube) {
                    this.scenePerspective.cameraCube.rotation.copy( this.scenePerspective.camera.rotation );
                    this.renderer.render(this.scenePerspective.sceneCube, this.scenePerspective.cameraCube);
                }

                this.renderer.render(this.scenePerspective.scene, this.scenePerspective.camera);
            }

            if (this.definition.useSceneOrtho) {
                this.renderer.render(this.sceneOrtho.scene, this.sceneOrtho.camera);
            }

            this.renderPost();
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

    /**
     * Default implementation
     */
    ThreeJsApp.prototype.initAsyncContent = function () {
        this.asyncDone = true;
    };

    /**
     * default implementation
     */
    ThreeJsApp.prototype.initPreGL = function () {

    };

    /**
     * default implementation
     */
    ThreeJsApp.prototype.initGL = function () {

    };

    /**
     * default implementation
     */
    ThreeJsApp.prototype.addEventHandlers = function () {

    };

    /**
     * default implementation
     */
    ThreeJsApp.prototype.initPostGL = function () {
        return true;
    };

    /**
     * default implementation
     */
    ThreeJsApp.prototype.resizeDisplayGL = function () {

    };

    /**
     * default implementation
     */
    ThreeJsApp.prototype.renderPre = function () {
        if ( this.definition.verbose ) {
            console.log("ThreeJsApp DEFAULT (" + this.definition.name + "): renderPre");
        }
    };

    /**
     * default implementation
     */
    ThreeJsApp.prototype.renderPost = function () {
        if ( this.definition.verbose ) {
            console.log("ThreeJsApp DEFAULT (" + this.definition.name + "): renderPost");
        }
    };

    return ThreeJsApp;
})();


KSX.apps.core.Canvas = (function () {

    function Canvas(htmlCanvas) {
        this.init(htmlCanvas);
        this.verbose = false;
    }

    Canvas.prototype.init = function (htmlCanvas) {
        this.htmlCanvas = htmlCanvas;
        this.recalcAspectRatio();
    };

    Canvas.prototype.recalcAspectRatio = function () {
        if (this.verbose) {
            console.log("width: " + this.getWidth() + " height: " + this.getHeight());
        }
        var height = this.getHeight();
        if (height === 0) {
            this.aspectRatio = 1;
        }
        else {
            this.aspectRatio = this.getWidth() / height;
        }
    };

    Canvas.prototype.resetWidth = function (width, height) {
        if (this.htmlCanvas !== null) {
            this.htmlCanvas.style.width = width + 'px';
            this.htmlCanvas.style.height = height + 'px';
        }
        this.recalcAspectRatio();
    };

    Canvas.prototype.getWidth = function () {
        return this.htmlCanvas === null ? 0 : this.htmlCanvas.offsetWidth;
    };

    Canvas.prototype.getHeight = function () {
        return this.htmlCanvas === null ? 0 : this.htmlCanvas.offsetHeight;
    };

    Canvas.prototype.getPixelLeft = function () {
        return -this.getWidth() / 2;
    };

    Canvas.prototype.getPixelRight = function () {
        return this.getWidth() / 2;
    };

    Canvas.prototype.getPixelTop = function () {
        return this.getHeight() / 2;
    };

    Canvas.prototype.getPixelBottom = function () {
        return -this.getHeight() / 2;
    };

    return Canvas;

})();



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
            this.defaultPosCamera.copy(defaultPosCamera);
        }
        if (defaultUpVector !== undefined && defaultUpVector !== null) {
            this.defaultUpVector.copy(defaultUpVector);
        }
        if (defaultPosCameraTarget !== undefined && defaultPosCameraTarget !== null) {
            this.defaultPosCameraTarget.copy(defaultPosCameraTarget);
        }
        if (defaultPosCameraCube !== undefined && defaultPosCameraCube !== null) {
            this.defaultPosCameraCube.copy(defaultPosCameraCube);
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
        this.camera.position.copy(this.defaultPosCamera);
        this.camera.up.copy(this.defaultUpVector);
        this.cameraTarget.copy(this.defaultPosCameraTarget);

        if (this.useCube) {
            this.cameraCube.position.copy(this.defaultPosCameraCube);
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


KSX.apps.core.ThreeJsApp.DefaultDefinition = {
    user: undefined,
    name: 'None',
    htmlCanvas : undefined,
    renderers: {
        regular: {
            canvas: undefined,
            antialias: true
        }
    },
    useScenePerspective: true,
    useSceneOrtho: false,
    useCube: false,
    loader: false,
    verbose: false
};


KSX.apps.core.AppRunner = (function () {

    function AppRunner() {
    }

    AppRunner.prototype.addImplementations = function (implementations) {
        this.implementations = [];
        this.loader = undefined;

        var implementation;
        for ( var i = 0; i < implementations.length; i++ ) {
            implementation = implementations[i];

            if ( implementation.definition.loader ) {
                console.log("AppRunner: Registering app as loader: " + implementation.definition.name);
                this.loader = implementation;
            }
            else {
                console.log("AppRunner: Registering app: " + implementation.definition.name);
                this.implementations.push(implementation);
            }
        }
    };

    AppRunner.prototype.run = function (startRenderLoop) {
        var scope = this;
        var resizeWindow = function () {
            for ( var i = 0; i < scope.implementations.length; i++ ) {
                scope.implementations[i].resizeDisplayGLBase();
            }
            if ( scope.loader !== undefined ) {
                scope.loader.resizeDisplayGLBase();
            }
        };
        window.addEventListener('resize', resizeWindow, false);

        // kicks init and prepares resources
        console.log("AppRunner: Starting global initialisation phase...");

        var implementation;
        var promises = [];

        for ( var i = 0; i < scope.implementations.length; i++ ) {
            implementation = scope.implementations[i];

            var promise = function (resolve, reject) {
                implementation.init();
                resolve( implementation.definition.name );
            };
            promises.push(new Promise(promise));
        }
        if ( scope.loader !== undefined ) {
            var promise = function (resolve, reject) {
                scope.loader.init();
                resolve( implementation.definition.name );
            };
            promises.push(new Promise(promise));
        }

        Promise.all( promises ).then(
            function ( results ) {
                for ( var result of results ) {
                    console.log( 'AppRunner: Successfully initialised app: ' + result );
                }
            }
        ).catch(
            function (error) {
                console.error( 'AppRunner: The following error occurred during initialisation of application: ', error );
            }
        );

        if ( startRenderLoop ) {
            scope.startRenderLoop();
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
//        console.log( 'RENDER' );
        if ( this.loader !== undefined ) {
            var allReady = true;
            var implementation;

            for ( var i = 0; i < this.implementations.length; i++ ) {
                implementation = this.implementations[i];
                implementation.renderingEnabled ? implementation.render() : allReady = false;
            }

            if ( !allReady ) {
                this.loader.render();
            }
            else {
                this.loader.definition.htmlCanvas.style.display  = 'none';
                this.loader = undefined;
            }
        }
        else {
            for ( var i = 0; i < this.implementations.length; i++ ) {
                this.implementations[i].render();
            }
        }
    };

    return AppRunner;

})();

KSX.globals.appRunner = new KSX.apps.core.AppRunner();
