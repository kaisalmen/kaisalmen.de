/**
 * Created by Kai on 04.09.2015.
 */

/// <reference path="../../libs/ts/threejs/three.d.ts" />

interface Text {

    addText(name: string, value: THREE.Geometry);

    getText(name: string) : THREE.Geometry;

}