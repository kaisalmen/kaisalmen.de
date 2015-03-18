/**
 * Created by Kai on 15.03.2015.
 */

/// <reference path="../../libs/ts/threejs/three.d.ts" />

interface Lights {

}

interface Geometry {
    createGrid() : THREE.Object3D;
}

interface SceneApp {
    aspectRatio : number;
    canvasWidth : number;
    canvasHeight : number;

    renderer : THREE.WebGLRenderer;

    scene : THREE.Scene;
    camera : THREE.Camera;

    lights : Lights;
    geometry : Geometry;

    setCanvasHtmlElement(divGL : HTMLElement);

    render();
}
