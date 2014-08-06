/**
 * Created by Kai Salmen on 2014.08.06
 *
 * Basic functionality implemented (render loop), trackball
 */

var SEAT = {};

SEAT.loader = null;

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

    var time = new Date().getTime();
    SEAT.loader = new THREE.SEA3D();
    SEAT.loader.onComplete = function( e ) {
        // get camera from 3ds Max if exist
/*
        if (SEAT.loader.cameras) {
            var cam = SEAT.loader.cameras[0];
            APPG.scenes.perspective.camera.position = cam.position;
            APPG.scenes.perspective.camera.rotation = cam.rotation;
        }
*/
        // reset time for keyframe animation
        SEA3D.AnimationHandler.setTime( 0 );

        console.log( new Date().getTime() - time );
    }
    SEAT.loader.container = APPG.scenes.perspective.scene;

    // compatible mode
    SEAT.loader.parser = THREE.SEA3D.DEFAULT;
    SEAT.loader.load("../../resource/models/snowtracks.sea");
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