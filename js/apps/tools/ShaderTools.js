/**
 * Created by Kai on 2014.03.17
 */

"use strict";

KSX.apps.tools.ShaderTools = (function () {

    function ShaderTools() {
        this.loader = new THREE.XHRLoader();
    }

    ShaderTools.prototype.loadShader = function (path, printShader, shaderName) {
        var scope = this;

        var promise = function (resolve, reject) {

            var onSuccess = function(text) {
                if (printShader) {
                    scope.printShader(text, shaderName);
                }
                resolve(text);
            };

            var onProgress = function (event) {
                if (event.lengthComputable) {
                    var percentComplete = event.loaded / event.total * 100;
                    var output = Math.round(percentComplete, 2) + '% downloaded';
                    console.log(output);
                }
            };

            var onError = function (event) {
                console.log("Error of type '" + event.type + "' occurred when trying to load: " + event.src);
                reject(event);
            };

            scope.loader.load(path, onSuccess, onProgress, onError);
        };

        return new Promise(promise);
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

    return ShaderTools;
})();