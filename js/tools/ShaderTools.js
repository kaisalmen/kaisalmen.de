/**
 * Created by Kai on 2014.03.17
 */

"use strict";

var ShaderTools = (function () {

    function ShaderTools() {
    }

    ShaderTools.prototype.loadShader = function (path, printShader, shaderName) {
        return $.get(path, function (data) {});
    };

    ShaderTools.prototype.printShader = function (shaderObj, shaderName) {
        console.log(shaderName + ":");
        console.log(shaderObj);
    };

    var hexToRGB = function (hexInput, floatUVSpace) {
        var divider = floatUVSpace ? 255.0 : 1;
        var rgb = [0, 0, 0];
        var hexNormalized = hexInput.charAt(0) == "#" ? hexInput.substring(1, 7) : hexInput;
        rgb[0] = parseInt((hexNormalized).substring(0, 2), 16) / divider;
        rgb[1] = parseInt((hexNormalized).substring(2, 4), 16) / divider;
        rgb[2] = parseInt((hexNormalized).substring(4, 6), 16) / divider;
        return rgb;
    }

    ShaderTools.prototype.hexToRGB = function (hexInput, floatUVSpace) {
        return hexToRGB(hexInput, floatUVSpace);
    }

    return ShaderTools;
})();