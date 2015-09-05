/**
 * Created by Kai Salmen on 04.09.2015.
 */

/// <reference path="../../libs/ts/threejs/three.d.ts" />
/// <reference path="../../node_modules/typescript/bin/lib.es6.d.ts" />

class Text2d implements Text {

    texts : Map<string, string>;

    constructor() {
        texts = new Map<string, string>();
    }

    addText(name: string, value: THREE.Geometry) {
        texts.put(name, value);
    }

    getText(name: string) {
        return texts.get(name);
    }

}