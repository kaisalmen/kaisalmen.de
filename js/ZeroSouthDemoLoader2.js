/**
 * Created by Kai Salmen on 2014.09.04
 *
 * Separate OBJ loader
 */
var APPZSD = {
    datGui : null
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
    APPG.functions.resizeDisplayHtmlDefault();

    APPG.dom.canvasAppFloat.style.top = 0 + "px";
    APPG.dom.canvasAppFloat.style.left = (window.innerWidth - parseInt(APPZSD.datGui.datGuiRef.domElement.style.width)) + "px";
}

function initGL() {
    APPG.renderer.functions.createDefault();

    APPG.scenes.perspective.functions.createDefault();
    APPG.scenes.perspective.functions.resetCameraDefault();

    APPG.scenes.lights.functions.createDefault();

    APPG.renderer.setClearColor(new THREE.Color(0.25, 0.25, 0.25), 255);

    // init trackball controls
    APPG.controls.functions.createDefault(APPG.scenes.perspective.camera);

    APPL.support.dom.functions.initAndShow();
    loadWithOBJLoader();
}

function loadWithOBJLoader() {
    var zipFile = "../../resource/models/snowtracks.zip";
    var files = ["snowtracks.mtl", "snowtracks.obj"];

    APPL.loaders.obj.functions.init();
    var callbacks = [APPL.loaders.obj.functions.parseMtl, APPL.loaders.obj.functions.parse];
    APPL.support.zip.functions.loadZipCallbacks(zipFile, files, callbacks);
/*
    if (APPL.support.filesystem.functions.createTempStorage(32)) {
        var queue = APPL.support.filesystem.functions.createQueue();
        APPL.support.filesystem.functions.createDir(queue, APPOBJ.baseDir);
        APPL.support.filesystem.functions.execute(queue);
        APPL.support.zip.functions.storeFilesFromZip(zipFile, files, APPOBJ.baseDir, checkObjs);
    }
*/
}

function checkObjs() {
    var urlObj = APPL.support.filesystem.functions.toURL(APPOBJ.baseDir, "snowtracks.obj");
    var urlMtl = APPL.support.filesystem.functions.toURL(APPOBJ.baseDir, "snowtracks.mtl");
    if (urlMtl !== undefined && urlObj !== undefined && !APPOBJ.loaded) {
        console.log("All resources loaded!");
        APPL.loaders.obj.functions.load(urlObj, urlMtl);
        APPOBJ.loaded = true;
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
