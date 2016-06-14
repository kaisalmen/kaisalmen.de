/**
 * Created by Kai Salmen.
 */

"use strict";

KSX.apps.tools.TextureTools = (function () {

    function TextureTools() {
        this.textureLoader = new THREE.TextureLoader();
        this.textureCubeLoader = new THREE.CubeTextureLoader();
        this.textureCubeLoader.format = THREE.RGBFormat;
        this.textureCubeLoader.mapping = THREE.CubeReflectionMapping;
    }

    TextureTools.prototype.loadTexture = function (imageUrl) {
        var scope = this;

        var promise = function (resolve, reject) {

            var onSuccess = function (texture) {
                var src = texture.image !== null ? texture.image.src : imageUrl;
                console.log("Loading of texture was completed successfully: " + src);
                resolve(texture);
            };

            var onProgress = function (event) {
                if (event.lengthComputable) {
                    var percentComplete = event.loaded / event.total * 100;
                    var output = Math.round(percentComplete, 2) + '% downloaded';
                    console.log(output);
                }
            };

            var onError = function (event) {
                var src = event.target !== null ? event.target.src : imageUrl;
                console.log("Error of type '" + event.type + "' occurred when trying to load: " + src);
                reject(event);
            };

            scope.textureLoader.load(imageUrl, onSuccess, onProgress, onError);
        };

        return new Promise(promise);
    };

    TextureTools.prototype.loadTextureCube = function (basePath, imageFileNames) {
        var scope = this;

        var promise = function (resolve, reject) {

            var onSuccess = function (texture) {
                console.log("Loading of cube texture was completed successfully from: " + basePath);
                resolve(texture);
            };

            var onProgress = function (event) {
                if (event.lengthComputable) {
                    var percentComplete = event.loaded / event.total * 100;
                    var output = Math.round(percentComplete, 2) + '% downloaded';
                    console.log(output);
                }
            };

            var onError = function (event) {
                console.error("Error of type '" + event.type + "' occurred when trying to load images from: " + basePath);
                reject(event);
            };

            if (imageFileNames.length < 6) {
                reject('Less than six images file names have been provided. Aborting...');
            }
            else {
                var imageUrls = new Array(6);
                for (var i = 0; i < imageFileNames.length; i++) {
                    imageUrls[i] = basePath + '/' + imageFileNames[i];
                }
                scope.textureCubeLoader.load( imageUrls, onSuccess, onProgress, onError );
            }
        };

        return new Promise(promise);
    };

    return TextureTools;
})();