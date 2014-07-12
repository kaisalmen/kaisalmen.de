/**
 * Created by Kai Salmen on 12.07.2014.
 */

var APPExecFlow = {}

var APPGlobal = {}

APPExecFlow =  {
    initShaders : null,
    initPreGL : null,
    resizeDisplayHtml : null,
    initGL : null,
    addEventHandlers : null,
    resizeDisplayGL : null,
    initPostGL : null,
    animateFrame : null
}

APPGlobal.screen = {
    aspectRatio : 2.35,
    glWidth : 1280.0,
    glHeight : 1280.0 / 2.35,
    glMinWidth : 800,
    glMinHeight : 800 / 2.35
}
APPGlobal.frameNumber = 0;
APPGlobal.widthScrollBar = 2;
APPGlobal.dom = {
    canvasGL : null,
    reductionHeight : APPGlobal.widthScrollBar + APPGlobal.widthScrollBar,
    reductionWidth : APPGlobal.widthScrollBar
}
