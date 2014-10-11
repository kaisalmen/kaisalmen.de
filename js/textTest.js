/**
 * Created by Kai Salmen on 2014.09.04
 *
 * Separate OBJ loader
 */
var APPTXT = {};

APPTXT = {
    textNode1 : null,
    textNode1Content : "Each character is a single geometry in ortho view.",
    textNode2 : null,
    textNode2Content : "They are created once and are only re-instantiated if required (mesh cache)!",
    textFrameNode : null,
    textFrameNodeContent : "None"
};

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
    APPG.dom.canvasAppFloat = document.getElementById("AppFloat");
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
    APPG.renderer.functions.createDefault(true);

    APPG.scenes.perspective.functions.createDefault();
    APPG.scenes.ortho.functions.createDefault(-1000, 1000);
    resetCamera();

    APPG.scenes.lights.functions.createDefault();
    APPG.renderer.setClearColor(new THREE.Color(0.075, 0.075, 0.075), 255);

    // Text init
    APPTXT.textNode1 = new THREE.Object3D();
    APPTXT.textNode2 = new THREE.Object3D();
    APPTXT.textFrameNode = new THREE.Object3D();
    APPG.textBuffer.functions.init([APPTXT.textNode1, APPTXT.textNode2, APPTXT.textFrameNode]);

    // init trackball controls
    APPG.controls.functions.createDefault(APPG.scenes.perspective.camera);
    APPG.scenes.perspective.scene.add(APPG.scenes.geometry.functions.createGrid(512, 12, 152, 0x606060));
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
    render();
    requestAnimationFrame(animateFrame, $("AppWebGLCanvas"));
}

function render() {
    APPG.controls.trackball.update();
    APPG.renderer.clear();
    APPG.renderer.render(APPG.scenes.perspective.scene, APPG.scenes.perspective.camera);
    APPG.functions.addFrameNumber();

    // Text updates
    APPTXT.textFrameNodeContent = "Frame: " + APPG.frameNumber;
    APPG.textBuffer.functions.verifyTextGeometries([APPTXT.textNode1Content, APPTXT.textNode2Content, APPTXT.textFrameNodeContent]);
    APPG.textBuffer.functions.updateTextGroup(APPTXT.textNode1, APPTXT.textNode1Content , -900, 360, 8, 16, 44);
    APPG.textBuffer.functions.updateTextGroup(APPTXT.textNode2, APPTXT.textNode2Content , -900, 300, 8, 16, 44);
    APPG.textBuffer.functions.updateTextGroup(APPTXT.textFrameNode, APPTXT.textFrameNodeContent , 200, -300, 8, 16, 44);

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
