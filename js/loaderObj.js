/**
 * Created by Kai Salmen on 2014.09.04
 *
 * Separate OBJ loader
 */
var APPOBJ = {}
APPOBJ = {
    baseDir : "models",
    dataAvailable : false,
    parseInitComplete : false,
    loadingComplete : false,
    baseObjGroup : null,
    zipFile : "../../resource/models/objs.zip",
    mtlFile : "Airstream.mtl",
    mtlContent : null,
    objFile : "Airstream.obj",
    objContent : null,
    fps : 60
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
    APPG.renderer.functions.createDefault();

    APPG.scenes.perspective.functions.createDefault();
    APPG.scenes.perspective.functions.resetCameraDefault();
    APPG.scenes.perspective.camera.position.set(400, 200, 450);

    APPG.scenes.lights.functions.createDefault();
    APPG.renderer.setClearColor(new THREE.Color(0.25, 0.25, 0.25), 255);

    // init trackball controls
    APPG.controls.functions.createDefault(APPG.scenes.perspective.camera);
    APPG.scenes.perspective.scene.add(APPG.scenes.geometry.functions.createGrid(512, 12, 152, 0x606060));

    APPL.support.dom.functions.initAndShow();

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
        APPOBJ.dataAvailable = true;
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

function startAnimation() {
    animateFrame();
}

function animateFrame() {
    if (APPOBJ.dataAvailable && !APPOBJ.loadingComplete) {
        if (!APPOBJ.parseInitComplete) {
            APPOBJ.parseInitComplete = APPL.loaders.obj.functions.parseInit(APPOBJ.objFile, APPOBJ.objContent, APPOBJ.mtlFile, APPOBJ.mtlContent);
        }
        var obj = APPL.loaders.obj.functions.parseExec();
        if (obj !== null) {
            APPL.loaders.obj.functions.addToScene(APPOBJ.baseObjGroup, obj);

            APPL.support.dom.divText.innerHTML = "Please wait while file is loading ... Object count: " + APPL.loaders.objectCount;
        }
        else {
            APPOBJ.loadingComplete = true;
            APPL.loaders.obj.functions.postLoad();
        }
    }
    render();
    requestAnimationFrame(animateFrame);
}

function render() {
    APPG.controls.trackball.update();
    APPG.renderer.clear();
    APPG.renderer.render(APPG.scenes.perspective.scene, APPG.scenes.perspective.camera);
    APPG.frameNumber++;
    //console.log("Render call: Frame: " + APPG.frameNumber);
}
