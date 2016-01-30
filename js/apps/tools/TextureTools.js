/**
 * Created by Kai Salmen.
 */

"use strict";

KSX.apps.tools.TextureTools = (function () {

    function TextureTools() {
        this.textureLoader = new THREE.TextureLoader();
    }

    TextureTools.prototype.loadTexture = function (imageUrl) {

        var onSuccess = function (texture) {
            var src = texture.image !== null ? texture.image.src : imageUrl;
            console.log("Loading of texture was completed successfully: " + src);
        };

        var onProgress = function (event) {
            if (event.lengthComputable) {
                var percentComplete = event.loaded / event.total * 100;
                console.log(Math.round(percentComplete, 2) + '% downloaded');
            }
        };

        var onError = function (event) {
            var src = event.target !== null ? event.target.src : imageUrl;
            console.log("Error of type '" + event.type + "' occurred when trying to load: " + src);
        };

        return this.textureLoader.load(imageUrl, onSuccess, onProgress, onError);
    };

    return TextureTools;
})();