/**
 * Created by Kai Salmen on 2014.07.12
 *
 * Update 2014.07.22:
 * - Basic functionality implemented (render loop)
 */

var AALT = {};

$(document).ready(
    function() {
        APPExecFlow.functions.run();
    }
)

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

    //(new THREE.ALLoader).load("data/primitives.json", processMeshes);
}

function addEventHandlers() {

}

function resizeDisplayGL() {
    resizeDisplayHtml();
    APPG.scenes.perspective.functions.resizePerspectiveCameraDefault();

    APPG.renderer.setSize(APPG.screen.glWidth, APPG.screen.glHeight);
}

function initPostGL() {
    APPG.dom.canvasGL.appendChild(APPG.renderer.domElement);
}

function animateFrame() {
    requestAnimationFrame(animateFrame);
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
    myObject3d.meshes.map(function(child){scene.add(child)})
}