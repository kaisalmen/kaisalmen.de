/**
 * Created by Kai Salmen on 2014.09.04
 *
 * Separate OBJ loader
 */
var APPTXT = {};

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
    APPG.scenes.ortho.functions.createDefault(-10, 10);
    resetCamera();

    APPG.scenes.lights.functions.createDefault();
    APPG.renderer.setClearColor(new THREE.Color(0.075, 0.075, 0.075), 255);

    initText();

    // init trackball controls
    APPG.controls.functions.createDefault(APPG.scenes.perspective.camera);
    APPG.scenes.perspective.scene.add(APPG.scenes.geometry.functions.createGrid(512, 12, 152, 0x606060));
}

function initText() {
    APPG.textBuffer.functions.addTextNode2d("textNode1", "Each character is a single geometry in ortho view.");
    APPG.textBuffer.functions.addTextNode2d("textNode2", "They are created once and are only re-instantiated if required (mesh cache)!");
    APPG.textBuffer.functions.addTextNode2d("textFrameNode", "None");
    var material2d = new THREE.MeshFaceMaterial( [
        new THREE.MeshPhongMaterial( {
            emissive: 0x00ff00,
            transparent : true,
            opacity : 1.0,
            shading: THREE.FlatShading,
            side : THREE.DoubleSide
        } )
    ] );
    var material2dParams = {
        name: "blah",
        height : 20,
        size: 18,
        amount: 0,
        hover : 0,
        curveSegments: 2,
        bevelEnabled: false,
        bevelSegments : 2,
        bevelThickness : 2,
        bevelSize : 1.0,
        font: "ubuntu mono",
        weight: "normal",
        style: "normal",
        material: 0,
        extrudeMaterial: 0
    };

    APPG.textBuffer.functions.completeInit(material2d, material2dParams, null, null);
}

function addEventHandlers() {}

function resizeDisplayGL() {
    APPG.controls.trackball.handleResize();
    resizeDisplayHtml();
    APPG.scenes.perspective.functions.resizePerspectiveCameraDefault();
    APPG.scenes.ortho.functions.resizeOrthoCameraDefault();

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

    updateText();

    APPG.renderer.clearDepth();
    APPG.renderer.render(APPG.scenes.ortho.scene, APPG.scenes.ortho.camera);
}

function updateText() {
    var text = "Frame: " + APPG.frameNumber + " FPS:" + APPG.fps.toFixed(1);
    APPG.textBuffer.functions.updateTextNode2d("textFrameNode", text);
    APPG.textBuffer.functions.verifyTextGeometries();
    APPG.textBuffer.functions.processTextNode(true, "textNode1", -800, 327, 18);
    APPG.textBuffer.functions.processTextNode(true, "textNode2", -800, 300, 18);
    var spacing = 18;
    var scale = new THREE.Vector3(0.75, 0.75, 0.75);
    var textPosX = -(text.length * scale.x * spacing) - 24 + APPG.screen.glWidth / 2;
    var textPosY = 24 - APPG.screen.glHeight / 2;
    APPG.textBuffer.functions.processTextNode(true, "textFrameNode", textPosX, textPosY, spacing, scale);
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
