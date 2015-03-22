/**
 * Created by Kai on 15.03.2015.
 */

/// <reference path="SceneApp.ts" />
/// <reference path="AppExecFlow.ts" />

class SceneAppPerspective implements SceneApp {
    appName : String;

    aspectRatio : number;
    canvasWidth : number;
    canvasHeight : number;
    divGL : HTMLElement;

    execFlow : APPExecFlow;
    renderer : THREE.WebGLRenderer;
    scene : THREE.Scene;
    camera : THREE.PerspectiveCamera;
    cameraTarget : THREE.Vector3;

    geometry : Geometry;

    constructor(appName : String, canvasWidth : number, canvasHeight : number, divGL : HTMLElement) {
        this.appName = appName;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.divGL = divGL;
        this.aspectRatio = this.canvasWidth / this.canvasHeight;

        this.execFlow = new APPExecFlow(this);
        this.execFlow.run();
    }

    initShaders() {
        console.log("SceneAppPerspective: initShaders");
    }

    initPreGL() {
        console.log("SceneAppPerspective: initPreGL");
    }

    resizeDisplayHtml() {
        console.log("SceneAppPerspective: resizeDisplayHtml");
    }

    initGL() {
        console.log("SceneAppPerspective: initGL");
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.aspectRatio, 0.1, 10000);
        this.cameraTarget = new THREE.Vector3(0, 0, 0);

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.canvasWidth, this.canvasHeight);
    }

    addEventHandlers() {
        console.log("SceneAppPerspective: addEventHandlers");
    }

    resizeDisplayGL() {
        console.log("SceneAppPerspective: resizeDisplayGL");
    }

    initPostGL() {
        console.log("SceneAppPerspective: initPostGL");
        this.divGL.style.width = this.canvasWidth + "px";
        this.divGL.style.height = this.canvasHeight + "px";
        this.renderer.domElement.style.padding = "0px 0px 0px 0px";
        this.renderer.domElement.style.margin = "0px 0px 0px 0px";
        this.divGL.appendChild(this.renderer.domElement);
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    resetCamera() {
        this.camera.position.set(0, 0, 250);
        this.cameraTarget = new THREE.Vector3(0, 0, 0);
        this.camera.lookAt(this.cameraTarget);
        this.camera.updateProjectionMatrix();
    }

    resizeCamera() {
        this.aspectRatio = this.canvasWidth / this.canvasHeight;
        this.camera.updateProjectionMatrix();
    }
}

