/**
 * Created by Kai Salmen on 2014.07.12.
 *
 * Updates
 * 2014.08.10:
 * Added three basic loading functions to AppBase
 */
var APPExecFlow = {}

APPExecFlow =  {
    initShaders : null,
    initPreGL : null,
    resizeDisplayHtml : null,
    initGL : null,
    addEventHandlers : null,
    resizeDisplayGL : null,
    initPostGL : null,
    animateFrame : null
}
APPExecFlow.functions =  {
    run: function() {
        APPExecFlow.initShaders = initShaders();

        APPExecFlow.initPreGL = initPreGL();
        APPExecFlow.resizeDisplayHtml = resizeDisplayHtml();

        APPExecFlow.initGL = initGL();
        APPExecFlow.addEventHandlers = addEventHandlers();
        APPExecFlow.resizeDisplayGL = resizeDisplayGL();

        APPExecFlow.initPostGL = initPostGL();

        APPExecFlow.animateFrame = animateFrame();
    }
}

var APPG = {}

APPG.screen = {
    aspectRatio : 2.35,
    glWidth : 1280.0,
    glHeight : 1280.0 / 2.35,
    glMinWidth : 800,
    glMinHeight : 800 / 2.35
}
APPG.frameNumber = 0;
APPG.widthScrollBar = 12;
APPG.dom = {
    canvasGL : null,
    reductionHeight : APPG.widthScrollBar + APPG.widthScrollBar,
    reductionWidth : APPG.widthScrollBar
}
APPG.functions = {
    resizeDisplayHtmlDefault: function() {
        APPG.screen.glWidth = window.innerWidth > APPG.screen.glMinWidth ? window.innerWidth : APPG.screen.glMinWidth;
        var heightTemp = window.innerWidth / APPG.screen.aspectRatio;
        APPG.screen.glHeight = heightTemp > APPG.screen.glMinHeight ? heightTemp : APPG.screen.glMinHeight;

        APPG.dom.canvasGL.style.width = APPG.screen.glWidth - APPG.dom.reductionWidth + "px";
        APPG.dom.canvasGL.style.height = APPG.screen.glHeight - APPG.dom.reductionHeight + "px";
    }
}

APPG.shaders = {};
APPG.shaders.functions = {
    loadShader : function() {
        console.log("Currently no shaders are used.");
    },
    updateShader : function() {
        console.log("Currently no shaders are used.");
    }
}
APPG.renderer = {
    domElement : null
}
APPG.renderer.functions = {
    createDefault: function () {
        APPG.renderer = new THREE.WebGLRenderer();
        APPG.renderer.setClearColor(new THREE.Color(0.02, 0.02, 0.02), 255);
        APPG.renderer.setSize(APPG.screen.glWidth, APPG.screen.glHeight);
        APPG.renderer.autoClear = false;
    }
}
APPG.scenes = {};
APPG.scenes.perspective = {
    camera : null,
    cameraTarget : null,
    scene : null
}
APPG.scenes.perspective.functions = {
    createDefault: function () {
        APPG.scenes.perspective.scene = new THREE.Scene();
        APPG.scenes.perspective.camera = new THREE.PerspectiveCamera(45, (APPG.screen.glWidth) / (APPG.screen.glHeight), 0.1, 10000);
    },
    resetCameraDefault: function () {
        APPG.scenes.perspective.camera.position.set(0, 0, 250);
        APPG.scenes.perspective.cameraTarget = new THREE.Vector3(0, 0, 0);
        APPG.scenes.perspective.camera.lookAt(APPG.scenes.perspective.cameraTarget);
        APPG.scenes.perspective.camera.updateProjectionMatrix();
    },
    resizePerspectiveCameraDefault: function () {
        APPG.scenes.perspective.camera.aspect = (APPG.screen.glWidth / APPG.screen.glHeight);
        APPG.scenes.perspective.camera.updateProjectionMatrix();
    }
}
APPG.scenes.lights =  {
    light1 : null,
    light2 : null,
    light3 : null,
    light4 : null,
    light5 : null,
    light6 : null,
    light7 : null,
    light8 : null
}
APPG.scenes.lights.functions = {
    createDefault: function () {
        APPG.scenes.lights.light1 = new THREE.DirectionalLight(0xffffff, 1.0);
        APPG.scenes.lights.light1.position.set(0, 1, 1);
        APPG.scenes.perspective.scene.add(APPG.scenes.lights.light1);
    }
}
APPG.controls = {
    trackball : null
}
APPG.controls.functions = {
    createDefault: function(camera) {
        APPG.controls.trackball = new THREE.TrackballControls(camera);
        APPG.controls.trackball.rotateSpeed = 0.5;
        APPG.controls.trackball.rotateSpeed = 1.0;
        APPG.controls.trackball.panSpeed = 0.5;
        APPG.controls.trackball.noPan = false;
        APPG.controls.trackball.noZoom = false;
    }
}