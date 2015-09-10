/**
 * Created by Kai Salmen on 04.09.2015.
 */

/// <reference path="../../libs/ts/threejs/three.d.ts" />

interface TextBase {

    addText(name: string, value: string, material: THREE.Material, size: number, curveSegments: number, font?: string, weight?: string, style?: string): TextUnit;

    getText(name: string): TextUnit;

}