/**
 * Created by Kai Salmen on 04.09.2015.
 */

/// <reference path="TextBase.ts" />
/// <reference path="TextUnit.ts" />
/// <reference path="../../libs/ts/threejs/three.d.ts" />
/// <reference path="../../node_modules/typescript/bin/lib.es6.d.ts" />

class Text2d implements TextBase {

    texts : Map<string, TextUnit>;

    constructor() {
        this.texts = new Map<string, TextUnit>();
    }

    addText(name: string, value: string, material: THREE.Material, size: number, curveSegments: number, font: string="ubuntu mono", weight: string="normal", style: string="normal") {
        var shapes = THREE.FontUtils.generateShapes(value, {
            size: size,
            curveSegments : curveSegments,
            font : font,
            weight : weight,
            style : style
        });
        var geometry = new THREE.ShapeGeometry(shapes);
        var textUnit = new TextUnit(geometry, material);
        this.texts.set(name, textUnit);
        return textUnit;
    }

    getText(name: string) {
        return this.texts.get(name);
    }

}