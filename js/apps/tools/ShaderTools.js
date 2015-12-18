/**
 * Created by Kai on 2014.03.17
 */

"use strict";

KSX.apps.tools.ShaderTools = (function () {

    function ShaderTools() {
    }

    ShaderTools.prototype.loadShader = function (path, printShader, shaderName) {
        return $.get(path, function (data) {
            if (printShader) {
                ShaderTools.prototype.printShader(data, shaderName);
            }
        });
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
    };

    ShaderTools.prototype.hexToRGB = function (hexInput, floatUVSpace) {
        return hexToRGB(hexInput, floatUVSpace);
    };

    ShaderTools.prototype.loadTexture = function (imageUrl) {
        var textureLoader = new THREE.TextureLoader();

        return textureLoader.load(imageUrl,
            function (texture) {
                console.log("Loading of texture was completed successfully!");
            },
            function (xhr) {
                console.log((xhr.loaded / xhr.total * 100) + "% loaded");
            },
            function (xhr) {
                console.log("An error occurred!");
            }
        )
    };

    return ShaderTools;
})();