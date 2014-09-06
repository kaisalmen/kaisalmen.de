/**
 * Created by Kai Salmen on 2014.09.04
 *
 * Separate OBJ loader
 */
var APPOBJ = {}
APPOBJ = {
    baseDir : "models",
    loaded : false
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
    console.log("Starting initShaders...");
    APPG.shaders.functions.loadShader();
}

function initPreGL() {
    console.log("Starting initPreGL...");
    APPG.dom.canvasGL = document.getElementById("AppWebGL");
}

function resizeDisplayHtml() {
    var ratio = 32/17;
    APPG.screen.aspectRatio = ratio;
    APPG.screen.glWidth = 1280.0;
    APPG.screen.glHeight = 1280.0 / ratio;
    APPG.screen.glMinWidth = 800;
    APPG.screen.glMinHeight = 800 / ratio;
    APPG.functions.resizeDisplayHtmlDefault();
}

function initGL() {
    console.log("Starting initGL...");
    APPG.renderer.functions.createDefault();

    APPG.scenes.perspective.functions.createDefault();
    APPG.scenes.perspective.functions.resetCameraDefault();
    APPG.scenes.perspective.camera.position.set(100, 100, 250);

    APPG.scenes.lights.functions.createDefault();

    APPG.renderer.setClearColor(new THREE.Color(0.25, 0.25, 0.25), 255);

    // init trackball controls
    APPG.controls.functions.createDefault(APPG.scenes.perspective.camera);

    APPG.scenes.perspective.scene.add(APPG.scenes.geometry.functions.createGrid(256, 4, 100, 0x606060));

    APPL.support.dom.functions.initAndShow();
    loadWithOBJLoader();
}

function loadWithOBJLoader() {
    var zipFile = "../../resource/models/objs.zip";
    var files = ["Airstream.mtl", "Airstream.obj"];

    APPL.loaders.obj.functions.init();
    var callbacks = [APPL.loaders.obj.functions.parseMtl, APPL.loaders.obj.functions.parse];
    APPL.support.zip.functions.loadZipCallbacks(zipFile, files, callbacks);

    //loadViaFS();
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
    if (urlMtl !== undefined && urlObj !== undefined && !APPOBJ.loaded) {
        APPL.loaders.obj.functions.load(urlObj, urlMtl);
        APPOBJ.loaded = true;
    }
}

function addEventHandlers() {
    console.log("Starting addEventHandlers...");
}

function resizeDisplayGL() {
    APPG.controls.trackball.handleResize();
    resizeDisplayHtml();
    APPG.scenes.perspective.functions.resizePerspectiveCameraDefault();

    APPG.renderer.setSize(APPG.screen.glWidth, APPG.screen.glHeight);
}

function initPostGL() {
    console.log("Starting initPostGL...");
    APPG.dom.canvasGL.appendChild(APPG.renderer.domElement);
}

function animateFrame() {
    requestAnimationFrame(animateFrame);
    APPG.controls.trackball.update();
    render();
}

function render() {
    APPG.renderer.clear();
    APPG.renderer.render(APPG.scenes.perspective.scene, APPG.scenes.perspective.camera);
    APPG.frameNumber++;
}
