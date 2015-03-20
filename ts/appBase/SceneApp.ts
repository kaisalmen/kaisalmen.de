/**
 * Created by Kai on 15.03.2015.
 */

/// <reference path="../../libs/ts/threejs/three.d.ts" />
/// <reference path="AppExecFlow.ts" />

interface Geometry {
    createGrid() : THREE.Object3D;
}

interface SceneApp {
    aspectRatio : number;
    canvasWidth : number;
    canvasHeight : number;
    divGL : HTMLElement;

    execFlow : APPExecFlow;
    renderer : THREE.WebGLRenderer;
    scene : THREE.Scene;
    camera : THREE.Camera;

    geometry : Geometry;

    initShaders();

    initPreGL();

    resizeDisplayHtml();

    initGL();

    addEventHandlers();

    resizeDisplayGL();

    initPostGL();

    render();
}
