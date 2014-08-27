/**
 * Created by Kai Salmen on 2014.08.06
 *
 * Basic functionality implemented (render loop), trackball
 *
 * Updates
 * 2014.08.10:
 * Added three basic loading functions to AppLoaders and further simplified/unified loader code structure
 */
var ALTS = {};

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
    APPG.functions.resizeDisplayHtmlDefault();
}

function initGL() {
    APPG.renderer.functions.createDefault();

    APPG.scenes.perspective.functions.createDefault();
    APPG.scenes.perspective.functions.resetCameraDefault();

    APPG.scenes.lights.functions.createDefault();

    APPG.renderer.setClearColor(new THREE.Color(0.25, 0.25, 0.25), 255);

    // init trackball controls
    APPG.controls.functions.createDefault(APPG.scenes.perspective.camera);

    //loadWithOBJMTLLoader();
    //loadWithSea3d();
    loadWithALLoader();
}

function loadWithOBJMTLLoader() {
    APPL.loaders.obj.functions.init();
    //APPL.loaders.obj.functions.load("../../resource/models/Airstream.obj", "../../resource/models/Airstream.mtl");
    //APPL.loaders.obj.functions.load("../../resource/models/snowtracks.obj", "../../resource/models/snowtracks.mtl");

    var zipFile = "../../resource/models/objs.zip";
    var files = ["Airstream.obj", "snowtracks.obj", "Airstream.mtl", "snowtracks.mtl"];
    APPL.support.zip.functions.loadZip(zipFile, files, APPL.loaders.obj.functions.parse);
}

function loadWithSea3d() {
    APPL.loaders.sea3d.functions.init();
    APPL.loaders.sea3d.functions.load("../../resource/models/snowtracks.sea");
}

function loadWithALLoader() {
    APPL.loaders.alloader.functions.init();
    //APPL.loaders.alloader.functions.load("../../resource/models/maxSphereTest.json");

    var zipFile = "../../resource/models/json.zip";
    var files = ["maxSphereTest.json", "snowtracks.json"];
    //var callbacks = [APPL.loaders.alloader.functions.parse, APPL.loaders.alloader.functions.parse];

    APPL.support.zip.functions.loadZip(zipFile, files, APPL.loaders.alloader.functions.parse);
}

function addEventHandlers() {

}

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
