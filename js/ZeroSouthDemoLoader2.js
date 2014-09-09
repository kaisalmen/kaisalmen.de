/**
 * Created by Kai Salmen on 2014.09.04
 *
 * Separate OBJ loader
 */
var APPZSD = {
    datGui : null,
    dataAvailable : false,
    parseInitComplete : false,
    baseObjGroup : null,
    zipFile : "../../resource/models/snowtracks.zip",
    mtlFile : "snowtracks.mtl",
    mtlContent : null,
    objFile : "snowtracks.obj",
    objContent : null
}
APPZSD.datGui = {
    functions : null,
    datGuiRef : null,
    params : null
}
APPZSD.datGui.functions = {
    init: function () {
        this.resetCamera = resetTrackballControls;
    }
}
APPZSD.datGui.params = {
    paramFunctionRef : null
}
$(document).ready(
    function() {
        APPExecFlow.functions.run();
    }
)
    .on({
        mouseenter: function() {
            APPG.controls.trackball.enabled = true;
            APPG.controls.trackball.noPan = false;
        },
        mouseleave: function() {
            APPG.controls.trackball.enabled = false;
            APPG.controls.trackball.noPan = true;
        }
    }, "#AppWebGL");

$(window).resize(function() {
    resizeDisplayGL();
});

/**
 * Life-cycle functions
 */
function initShaders() {
    APPG.shaders.functions.loadShader();
}

function initPreGL() {
    APPG.dom.canvasGL = document.getElementById("AppWebGL");

    APPZSD.datGui.paramFunctionRef = new APPZSD.datGui.functions.init();
    APPZSD.datGui.datGuiRef = new dat.GUI(
        {
            autoPlace : false
        }
    );
    APPZSD.datGui.datGuiRef.add(APPZSD.datGui.paramFunctionRef, "resetCamera").name("Reset camera!");

    APPG.dom.canvasAppFloat = document.getElementById("AppFloat");
    APPG.dom.canvasAppFloat.appendChild(APPZSD.datGui.datGuiRef.domElement);
}

function resizeDisplayHtml() {
    var ratio = 32/17;
    APPG.screen.aspectRatio = ratio;
    APPG.screen.glWidth = 1280.0;
    APPG.screen.glHeight = 1280.0 / ratio;
    APPG.screen.glMinWidth = 800;
    APPG.screen.glMinHeight = 800 / ratio;
    APPG.functions.resizeDisplayHtmlDefault(2);

    APPG.dom.canvasAppFloat.style.top = 0 + "px";
    APPG.dom.canvasAppFloat.style.left = (window.innerWidth - parseInt(APPZSD.datGui.datGuiRef.domElement.style.width)) + "px";
}

function initGL() {
    APPG.renderer.functions.createDefault();

    APPG.scenes.perspective.functions.createDefault();
    APPG.scenes.perspective.functions.resetCameraDefault();
    APPG.scenes.perspective.camera.position.set(600, 600, 1050);

    APPG.scenes.lights.functions.createDefault();
    APPG.renderer.setClearColor(new THREE.Color(0.25, 0.25, 0.25), 255);

    // init trackball controls
    APPG.controls.functions.createDefault(APPG.scenes.perspective.camera);
    APPG.scenes.perspective.scene.add(APPG.scenes.geometry.functions.createGrid(1024, 24, 152, 0x606060));

    APPL.support.dom.divLoad.functions.initAndShow();

    loadWithOBJLoader();
}

function loadWithOBJLoader() {
    APPZSD.baseObjGroup = new THREE.Object3D();
    APPG.scenes.perspective.scene.add(APPZSD.baseObjGroup);

    var files = [APPZSD.mtlFile, APPZSD.objFile];
    APPL.loaders.obj.functions.init();
    var callbacks = [storeData, storeData];
    APPL.support.zip.functions.loadZipCallbacks(APPZSD.zipFile, files, callbacks);
}

function storeData(filename, fileContent) {
    if (filename === APPZSD.mtlFile) {
        APPZSD.mtlContent = fileContent;
    }
    if (filename === APPZSD.objFile) {
        APPZSD.objContent = fileContent;
    }
    if (APPZSD.objContent !== null && APPZSD.mtlContent !== null) {
        APPZSD.dataAvailable = true;
    }
}

function addEventHandlers() {}

function resizeDisplayGL() {
    APPG.controls.trackball.handleResize();
    resizeDisplayHtml();
    APPG.scenes.perspective.functions.resizePerspectiveCameraDefault();

    APPG.renderer.setSize(APPG.screen.glWidth, APPG.screen.glHeight);
}

function initPostGL() {
    APPG.renderer.domElement.id = "AppWebGLCanvas";
    APPG.dom.canvasGL.appendChild(APPG.renderer.domElement);
}

function animateFrame() {
    if (APPZSD.dataAvailable) {
        if (!APPL.loaders.obj.functions.isLoadingComplete()) {
            if (!APPZSD.parseInitComplete) {
                APPZSD.parseInitComplete = APPL.loaders.obj.functions.parseInit(APPZSD.objFile, APPZSD.objContent, APPZSD.mtlFile, APPZSD.mtlContent);
                APPL.support.dom.divLoad.functions.setTotalObjectCount(APPL.loaders.obj.functions.getObjectCount());
            }
            var obj = APPL.loaders.obj.functions.parseExec();
            if (obj !== null) {
                APPL.loaders.obj.functions.addToScene(APPZSD.baseObjGroup, obj);
                APPL.support.dom.divLoad.functions.updateCurrentObjectCount(APPL.loaders.objectCount);
            }
        }
        else {
            APPL.loaders.obj.functions.postLoad();
        }
    }
    render();
    requestAnimationFrame(animateFrame, $("AppWebGLCanvas"));
    //requestAnimationFrame(animateFrame);
}

function render() {
    APPG.controls.trackball.update();
    APPG.renderer.clear();
    APPG.renderer.render(APPG.scenes.perspective.scene, APPG.scenes.perspective.camera);
    APPG.frameNumber++;
}

function resetCamera() {
    APPG.scenes.perspective.camera.position.set(-35, 35, -35);
    APPG.scenes.perspective.camera.updateProjectionMatrix();
}

function resetTrackballControls() {
    console.log("resetTrackballControls");
    resetCamera();
    APPG.controls.trackball.reset();
    render();
}
