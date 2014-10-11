/**
 * Created by Kai Salmen on 2014.09.04
 *
 * Separate OBJ loader
 */
var APPOBJ = {}

APPOBJ = {
    baseDir : "models",
    zipFile : "../../resource/models/objs.zip",
    mtlFile : "Airstream.mtl",
    mtlContent : null,
    objFile : "Airstream.obj",
    objContent : null,
    baseObjGroup : null,
    textNode : null,
    textNodeContent : "This is a test?!",
    textFrameNode : null,
    textFrameNodeContent : "None"
}
APPOBJ.datGui = {
    functions : null,
    datGuiRef : null,
    params : null
}
APPOBJ.datGui.functions = {
    init: function () {
        this.resetCamera = resetTrackballControls;
    }
}
APPOBJ.datGui.params = {
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

    APPOBJ.datGui.paramFunctionRef = new APPOBJ.datGui.functions.init();
    APPOBJ.datGui.datGuiRef = new dat.GUI(
        {
            autoPlace : false
        }
    );
    APPOBJ.datGui.datGuiRef.add(APPOBJ.datGui.paramFunctionRef, "resetCamera").name("Reset camera!");

    APPG.dom.canvasAppFloat = document.getElementById("AppFloat");
    APPG.dom.canvasAppFloat.appendChild(APPOBJ.datGui.datGuiRef.domElement);

    APPL.loaders.obj.fpsCheckTime = new Date().getTime();
}

function resizeDisplayHtml() {
    var ratio = 32/17;
    APPG.screen.aspectRatio = ratio;
    APPG.screen.glWidth = 1280.0;
    APPG.screen.glHeight = 1280.0 / ratio;
    APPG.screen.glMinWidth = 800;
    APPG.screen.glMinHeight = 800 / ratio;
    APPG.functions.resizeDisplayHtmlDefault(12);
}

function initGL() {
    APPG.renderer.functions.createDefault();

    APPG.scenes.perspective.functions.createDefault();
    APPG.scenes.ortho.functions.createDefault(-1000, 1000);
    resetCamera();

    APPG.scenes.lights.functions.createDefault();
    APPG.renderer.setClearColor(new THREE.Color(0.075, 0.075, 0.075), 255);

    APPOBJ.textNode = new THREE.Object3D();
    APPOBJ.textFrameNode = new THREE.Object3D();
    APPG.textBuffer.functions.init([APPOBJ.textNode, APPOBJ.textFrameNode]);

    // init trackball controls
    APPG.controls.functions.createDefault(APPG.scenes.perspective.camera);
    APPG.scenes.perspective.scene.add(APPG.scenes.geometry.functions.createGrid(512, 12, 152, 0x606060));

    APPL.support.dom.divLoad.functions.initAndShow();

    loadWithOBJLoader();
}

function loadWithOBJLoader() {
    APPOBJ.baseObjGroup = new THREE.Object3D();
    APPG.scenes.perspective.scene.add(APPOBJ.baseObjGroup);

    var files = [APPOBJ.mtlFile, APPOBJ.objFile];
    APPL.loaders.obj.functions.init();
    var callbacks = [storeData, storeData];
    APPL.support.zip.functions.loadZipCallbacks(APPOBJ.zipFile, files, callbacks);
    //loadViaFS();
}

function storeData(filename, fileContent) {
    if (filename === APPOBJ.mtlFile) {
        APPOBJ.mtlContent = fileContent;
    }
    if (filename === APPOBJ.objFile) {
        APPOBJ.objContent = fileContent;
    }
    if (APPOBJ.objContent !== null && APPOBJ.mtlContent !== null) {
        APPL.loaders.obj.dataAvailable = true;
        APPL.loaders.obj.functions.parseInit(APPOBJ.objFile, APPOBJ.objContent, APPOBJ.mtlFile, APPOBJ.mtlContent);
    }
}

function loadViaFS() {
    if (APPL.support.filesystem.functions.createTempStorage(8)) {
        var queue = APPL.support.filesystem.functions.createQueue();
        APPL.support.filesystem.functions.createDir(queue, APPOBJ.baseDir);
        APPL.support.filesystem.functions.execute(queue);
        APPL.support.zip.functions.storeFilesFromZip(zipFile, files, APPOBJ.baseDir, checkObjs);
    }
}

function checkObjs() {
    console.log("Checking objs...");
    var urlObj = APPL.support.filesystem.functions.toURL(APPOBJ.baseDir, "Airstream.obj");
    var urlMtl = APPL.support.filesystem.functions.toURL(APPOBJ.baseDir, "Airstream.mtl");
    if (urlMtl !== undefined && urlObj !== undefined) {
        APPL.loaders.obj.functions.load(urlObj, urlMtl);
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
    if (APPL.loaders.obj.dataAvailable && APPG.frameNumber % 2 === 0) {
        APPL.loaders.obj.functions.handleObjLoading(APPOBJ.baseObjGroup);
    }
    render();
    requestAnimationFrame(animateFrame, $("AppWebGLCanvas"));
}

function render() {
    APPG.controls.trackball.update();
    APPG.renderer.clear();
    APPG.renderer.render(APPG.scenes.perspective.scene, APPG.scenes.perspective.camera);
    APPG.functions.addFrameNumber();

    APPOBJ.textFrameNodeContent = "Current Frame is: " + APPG.frameNumber;
    APPG.textBuffer.functions.verifyTextGeometries([APPOBJ.textNodeContent, APPOBJ.textFrameNodeContent]);
    APPG.textBuffer.functions.updateTextGroup(APPOBJ.textNode, APPOBJ.textNodeContent , -900, 360, 8, 16, 44);
    APPG.textBuffer.functions.updateTextGroup(APPOBJ.textFrameNode, APPOBJ.textFrameNodeContent , 200, -300, 8, 16, 44);

    APPG.renderer.clearDepth();
    APPG.renderer.render(APPG.scenes.ortho.scene, APPG.scenes.ortho.camera);
}

function resetCamera() {
    APPG.scenes.perspective.camera.position.set(400, 200, 450);
    APPG.scenes.perspective.camera.updateProjectionMatrix();
    APPG.scenes.ortho.camera.position.set(0, 0, 10);
}

function resetTrackballControls() {
    console.log("resetTrackballControls");
    resetCamera();
    APPG.controls.trackball.reset();
    render();
}
