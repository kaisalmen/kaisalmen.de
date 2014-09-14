/**
 * Created by Kai Salmen on 2014.09.04
 *
 * Separate OBJ loader
 */
var APPOBJ = {}
APPOBJ = {
    baseDir : "models",
    dataAvailable : false,
    updateTotalObjCount : true,
    readLinesPerFrame : 500,
    minReadLinesPerFrame : 75,
    maxReadLinesPerFrame : 5000,
    fpsCheckTime : 0,
    fpsRef : 0,
    minFps : 25,
    baseObjGroup : null,
    zipFile : "../../resource/models/objs.zip",
    mtlFile : "Airstream.mtl",
    mtlContent : null,
    objFile : "Airstream.obj",
    objContent : null,
    worker : null
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
    APPOBJ.fpsCheckTime = new Date().getTime();
/*
    APPOBJ.worker = new Worker("../../js/webWorker.js");
    APPOBJ.worker.addEventListener('message', function(e) {
        var data = e.data;
        if (data.blob) {
            console.log("Worker has blob" + data.blob.type + " " + data.blob.size);
        }
        else if (data.msg) {
            console.log(data.msg);
        };
    }, false);
*/
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
    APPG.scenes.perspective.functions.resetCameraDefault();
    APPG.scenes.perspective.camera.position.set(400, 200, 450);

    APPG.scenes.lights.functions.createDefault();
    APPG.renderer.setClearColor(new THREE.Color(0.25, 0.25, 0.25), 255);

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
        APPOBJ.dataAvailable = true;
        APPL.loaders.obj.functions.parseInit(APPOBJ.objFile, APPOBJ.objContent, APPOBJ.mtlFile, APPOBJ.mtlContent);
/*
        APPOBJ.worker.postMessage({"cmd": "init", "obj" : APPOBJ.objContent, "objName" : APPOBJ.objFile, "mtl" : APPOBJ.mtlContent, "mtlName" : APPOBJ.mtlFile});
        APPOBJ.worker.postMessage({"cmd": "loadObj"});
*/
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

function handleObjLoading() {
    if (APPOBJ.updateTotalObjCount && APPL.loaders.obj.functions.calcObjectCount(10000)) {
        // final update
        APPL.support.dom.divLoad.functions.setTotalObjectCount(APPL.loaders.obj.functions.getObjectCount());
        APPOBJ.updateTotalObjCount = false;
    }

    if (APPOBJ.updateTotalObjCount) {
        APPL.support.dom.divLoad.functions.setTotalObjectCount(APPL.loaders.obj.functions.getObjectCount());
    }
    var now = new Date().getTime();
    if (now > APPOBJ.fpsCheckTime + 1000) {

        APPOBJ.fpsCheckTime = now;
        var reference = APPG.frameNumber - APPOBJ.fpsRef;
        var old = APPOBJ.readLinesPerFrame;

        if (reference < APPOBJ.minFps) {
            APPOBJ.readLinesPerFrame = parseInt(APPOBJ.readLinesPerFrame / 2);
            if (APPOBJ.readLinesPerFrame < APPOBJ.minReadLinesPerFrame) {
                APPOBJ.readLinesPerFrame = APPOBJ.minReadLinesPerFrame;
            }
            if (APPOBJ.readLinesPerFrame !== APPOBJ.minReadLinesPerFrame || old !== APPOBJ.readLinesPerFrame) {
                console.log("New lines per frame: " + APPOBJ.readLinesPerFrame);
            }
        }
        else {
            APPOBJ.readLinesPerFrame *= 2;
            if (APPOBJ.readLinesPerFrame > APPOBJ.maxReadLinesPerFrame) {
                APPOBJ.readLinesPerFrame = APPOBJ.maxReadLinesPerFrame;
            }
            if (APPOBJ.readLinesPerFrame !== APPOBJ.maxReadLinesPerFrame || old !== APPOBJ.readLinesPerFrame) {
                console.log("New lines per frame: " + APPOBJ.readLinesPerFrame);
            }
        }
        console.log("Frames per second in last interval: " + reference + " (Frames: " + APPG.frameNumber + ")");
        APPOBJ.fpsRef = APPG.frameNumber;
    }

    if (!APPL.loaders.obj.functions.isLoadingComplete()) {
        var obj = APPL.loaders.obj.functions.parseExec(APPOBJ.readLinesPerFrame);
        if (obj !== null) {
            APPL.loaders.obj.functions.addToScene(APPOBJ.baseObjGroup, obj);
            APPL.support.dom.divLoad.functions.updateCurrentObjectCount(APPL.loaders.objectCount);
        }
    }
    else {
        APPL.loaders.obj.functions.postLoad();
        // everything was loaded
        APPOBJ.dataAvailable = false;
    }
}

function animateFrame() {
    if (APPOBJ.dataAvailable && APPG.frameNumber % 2 === 0) {
        handleObjLoading();
    }
    render();
    requestAnimationFrame(animateFrame, $("AppWebGLCanvas"));
}

function render() {
    APPG.controls.trackball.update();
    APPG.renderer.clear();
    APPG.renderer.render(APPG.scenes.perspective.scene, APPG.scenes.perspective.camera);
    APPG.functions.addFrameNumber();
}
