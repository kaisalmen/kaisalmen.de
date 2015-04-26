/**
 * Created by Kai on 15.03.2015.
 */

/// <reference path="SceneApp.ts" />

class SceneAppPerspective implements SceneApp {
    browserContext: BrowserContext;
    user: SceneAppUser;
    canvas: Canvas;

    renderer : THREE.WebGLRenderer;
    scene : THREE.Scene;
    camera : THREE.PerspectiveCamera;
    cameraTarget : THREE.Vector3;

    geometry : Geometry;

    constructor(user : SceneAppUser, divGL : HTMLElement, divGLCanvas : HTMLCanvasElement) {
        this.user = user;
        this.canvas = new Canvas(divGLCanvas);
        this.canvas.recalcAspectRatio();

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.canvas.aspectRatio, 0.1, 10000);
        this.cameraTarget = new THREE.Vector3(0, 0, 0);

        this.renderer = new THREE.WebGLRenderer({canvas : divGLCanvas});
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
        this.resizeDisplayGL();
        this.user.initGL();
    }

    addEventHandlers() {
        console.log("SceneAppPerspective: addEventHandlers");
    }

    resizeDisplayGL() {
        console.log("SceneAppPerspective: resizeDisplayGL");
        this.renderer.setSize(this.canvas.getWidth(), this.canvas.getHeight(), false);
    }

    initPostGL() {
        console.log("SceneAppPerspective: initPostGL");
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    adjustWindow() {
        this.resizeDisplayGL();
        this.canvas.recalcAspectRatio();
        this.camera.aspect = this.canvas.aspectRatio;
        this.camera.updateProjectionMatrix();
    }

    resetCamera() {
        this.camera.position.set(0, 0, 250);
        this.cameraTarget = new THREE.Vector3(0, 0, 0);
        this.camera.lookAt(this.cameraTarget);
        this.camera.updateProjectionMatrix();
    }

}

