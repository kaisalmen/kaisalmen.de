/**
 * Created by Kai on 15.03.2015.
 */

/// <reference path="SceneApp.ts" />

class SceneAppPerspective implements SceneApp {

    aspectRatio : number;
    screenWidth : number;
    screenHeight : number;

    scene : THREE.Scene;
    camera : THREE.PerspectiveCamera;
    cameraTarget : THREE.Vector3;

    lights : Lights;
    geometry : Geometry;

    constructor(screenWidth : number, screenHeight : number) {
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
        this.aspectRatio = screenWidth / screenHeight;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.aspectRatio, 0.1, 10000);
        this.cameraTarget = new THREE.Vector3(0, 0, 0);
    }

    resetCamera() {
        this.camera.position.set(0, 0, 250);
        this.cameraTarget = new THREE.Vector3(0, 0, 0);
        this.camera.lookAt(this.cameraTarget);
        this.camera.updateProjectionMatrix();
    }

    resizeCamera() {
        this.aspectRatio = this.screenWidth / this.screenHeight;
        this.camera.updateProjectionMatrix();
    }
}

