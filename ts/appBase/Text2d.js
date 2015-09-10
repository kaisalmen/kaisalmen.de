/**
 * Created by Kai Salmen on 04.09.2015.
 */
/// <reference path="TextBase.ts" />
/// <reference path="TextUnit.ts" />
/// <reference path="../../libs/ts/threejs/three.d.ts" />
/// <reference path="../../node_modules/typescript/bin/lib.es6.d.ts" />
var Text2d = (function () {
    function Text2d() {
        this.texts = new Map();
    }
    Text2d.prototype.addText = function (name, value, material, size, curveSegments, font, weight, style) {
        if (font === void 0) { font = "ubuntu mono"; }
        if (weight === void 0) { weight = "normal"; }
        if (style === void 0) { style = "normal"; }
        var shapes = THREE.FontUtils.generateShapes(value, {
            size: size,
            curveSegments: curveSegments,
            font: font,
            weight: weight,
            style: style
        });
        var geometry = new THREE.ShapeGeometry(shapes);
        var textUnit = new TextUnit(geometry, material);
        this.texts.set(name, textUnit);
        return textUnit;
    };
    Text2d.prototype.getText = function (name) {
        return this.texts.get(name);
    };
    return Text2d;
})();
//# sourceMappingURL=Text2d.js.map