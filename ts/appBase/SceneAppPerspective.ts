/**
 * Created by Kai on 15.03.2015.
 */

/// <reference path="AppExecFlow.ts" />
/// <reference path="SceneApp.ts" />

class SceneAppPerspective implements SceneApp {
    user : SceneAppUser;

    canvas : Canvas;

    renderer : THREE.WebGLRenderer;
    scene : THREE.Scene;
    camera : THREE.PerspectiveCamera;
    cameraTarget : THREE.Vector3;

    geometry : Geometry;

    constructor(user : SceneAppUser, canvasWidth : number, aspectRatio : number, canvasMinWidth : number, divGL : HTMLElement) {
        this.user = user;
        this.canvas = new Canvas(canvasWidth, aspectRatio, canvasMinWidth, divGL);
        this.canvas.recalcAspectRatio();

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.canvas.aspectRatio, 0.1, 10000);
        this.cameraTarget = new THREE.Vector3(0, 0, 0);

        this.renderer = new THREE.WebGLRenderer();
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

        this.renderer.setSize(this.canvas.width, this.canvas.height);

        this.user.initGL();
    }

    addEventHandlers() {
        console.log("SceneAppPerspective: addEventHandlers");
    }

    resizeDisplayGL() {
        console.log("SceneAppPerspective: resizeDisplayGL");
    }

    initPostGL() {
        console.log("SceneAppPerspective: initPostGL");
        this.renderer.domElement.style.padding = "0px 0px 0px 0px";
        this.renderer.domElement.style.margin = "0px 0px 0px 0px";
        this.canvas.divGL.appendChild(this.renderer.domElement);
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
        this.canvas.recalcAspectRatio();
        this.camera.aspect = this.canvas.aspectRatio;
        this.camera.updateProjectionMatrix();
    }
}

