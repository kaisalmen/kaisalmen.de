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
    screenWidth : number;
    screenHeight : number;

    scene : THREE.Scene;
    camera : THREE.Camera;

    lights : Lights;
    geometry : Geometry;
}
