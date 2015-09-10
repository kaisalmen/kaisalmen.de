/**
 * Created by Kai Salmen on 10.09.2015.
 */

/// <reference path="../../libs/ts/threejs/three.d.ts" />

class TextUnit {

    geometry : THREE.Geometry;
    material : THREE.Material;
    mesh : THREE.Mesh;

    constructor(geometry: THREE.Geometry, material : THREE.Material) {
        this.geometry = geometry;
        this.material = material;
        this.mesh = new THREE.Mesh(this.geometry, this.material);
    }
}