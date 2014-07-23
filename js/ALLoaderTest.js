/**
 * Created by Kai Salmen on 2014.07.12
 *
 * Update 2014.07.22:
 * - Basic functionality implemented (render loop)
 * Update 2014.07.23:
 * - Added trackball and loading of example file
 */

var AALT = {};

AALT.alloader = null;

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

    // init trackball controls
    APPG.controls.functions.createDefault(APPG.scenes.perspective.camera);

    AALT.alloader = new THREE.ALLoader();
    AALT.alloader.load("../../resource/models/maxSphereTest.json", processMeshes);
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

/**
 * Extra functions (helper, init, etc.)
 */
function processMeshes(myObject3d) {
    myObject3d.meshes.map(function(child){APPG.scenes.perspective.scene.add(child)})
}