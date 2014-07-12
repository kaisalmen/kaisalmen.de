/**
 * Created by Kai Salmen on 2014.07.12
 */

var AALT = {};

AALT.shader = {
    loadShaderFunc : function() {
        console.log("Currently no shaders are used.");
    }
}

$(document).ready(
    function() {
        APPExecFlow.initShaders = AALT.shader.loadShaderFunc();

        APPExecFlow.initPreGL = initPreGL();
        APPExecFlow.resizeDisplayHtml = resizeDisplayHtml();

        APPExecFlow.initGL = initGL();
        APPExecFlow.addEventHandlers = addEventHandlers();
        APPExecFlow.resizeDisplayGL = resizeDisplayGL();

        APPExecFlow.initPostGL = initPostGL();

        APPExecFlow.animateFrame = animateFrame();
    }
)

/**
 * Life-cycle functions
 */
function initPreGL() {
    APPGlobal.dom.canvasGL = document.getElementById("AppWebGL");
}

function resizeDisplayHtml() {
    APPGlobal.screen.glWidth  = window.innerWidth > APPGlobal.screen.glMinWidth ? window.innerWidth : APPGlobal.screen.glMinWidth;
    var heightTemp = window.innerWidth / APPGlobal.screen.aspectRatio;
    APPGlobal.screen.glHeight = heightTemp > APPGlobal.screen.glMinHeight ? heightTemp : APPGlobal.screen.glMinHeight;

    APPGlobal.dom.canvasGL.style.width = APPGlobal.screen.glWidth - APPGlobal.dom.reductionWidth + "px";
    APPGlobal.dom.canvasGL.style.height = APPGlobal.screen.glHeight  - APPGlobal.dom.reductionHeight + "px";
}

function initGL() {

}

function addEventHandlers() {

}

function resizeDisplayGL() {

}

function initPostGL() {

}

function animateFrame() {

}

/**
 * Extra functions (helper, init, etc.)
 */