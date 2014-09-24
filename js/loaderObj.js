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
    baseObjGroup : null
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
    APPG.renderer.setClearColor(new THREE.Color(0.25, 0.25, 0.25), 255);

    createText();

    // init trackball controls
    APPG.controls.functions.createDefault(APPG.scenes.perspective.camera);
    APPG.scenes.perspective.scene.add(APPG.scenes.geometry.functions.createGrid(512, 12, 152, 0x606060));

    APPL.support.dom.divLoad.functions.initAndShow();

    loadWithOBJLoader();
}

function createText() {
    APPG.textBuffer.functions.createAll();

    var material = new THREE.MeshPhongMaterial( {
        emissive: 0xdddddd,
        transparent : true,
        opacity : 0.75,
        shading: THREE.FlatShading,
        side : THREE.DoubleSide
    } );
    var geometry = new THREE.SphereGeometry(100, 32, 32);
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0,0,100);
    APPG.scenes.ortho.Billboard.functions.addMesh(mesh);

    var group = APPG.textBuffer.functions.renderText("This is a test?!", 20);
    APPG.scenes.ortho.Billboard.functions.addMesh(group);
}

function removeText() {}

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
