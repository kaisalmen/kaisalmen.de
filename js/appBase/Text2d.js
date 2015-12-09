/**
 * Created by Kai Salmen.
 */

"use strict";

/**
 * This class was started with typescript
 */
KSX.appBase.Text2d = (function () {

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
        var textUnit = new KSX.appBase.TextUnit(geometry, material);
        this.texts.set(name, textUnit);
        return textUnit;
    };

    Text2d.prototype.getText = function (name) {
        return this.texts.get(name);
    };

    return Text2d;
})();
