/**
 * Created by Kai on 15.03.2015.
 */

/// <reference path="../../libs/ts/threejs/three.d.ts" />
/// <reference path="BrowserContext.ts" />
/// <reference path="Canvas.ts" />
/// <reference path="SceneAppUser.ts" />

interface Geometry {
    createGrid() : THREE.Object3D;
}

interface SceneApp {
    browserContext: BrowserContext;
    user: SceneAppUser;
    canvas: Canvas;

    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.Camera;

    geometry: Geometry;

    initShaders();

    initPreGL();

    resizeDisplayHtml();

    initGL();

    addEventHandlers();

    resizeDisplayGL();

    initPostGL();

    render();

    adjustWindow();

    resetCamera();
}