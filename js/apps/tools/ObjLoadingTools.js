/**
 * Created by Kai Salmen.
 */

"use strict";

KSX.apps.tools.ObjLoadingTools = (function () {

    function ObjLoadingTools(manager) {
        if (manager === null) {
            this.manager = new THREE.LoadingManager();
            this.manager.onProgress = function (item, loaded, total) {
                console.log(item, loaded, total);
            };
        }
        else {
            this.manager = manager;
        }

        this.loader = new THREE.OBJLoader(this.manager);
    }

    ObjLoadingTools.prototype.loadObject = function (objUrl, loadFunction) {

        var onProgress = function (event) {
            if (event.lengthComputable) {
                var percentComplete = event.loaded / event.total * 100;
                console.log(Math.round(percentComplete, 2) + '% downloaded');
            }
        };

        var onError = function (event) {
            console.log("Error of type '" + event.type + "' occurred when trying to load: " + src);
        };

        this.loader.load(objUrl, loadFunction, onProgress, onError);
    };

    ObjLoadingTools.prototype.parse = function (dataAsText) {
        return this.loader.parse(dataAsText);
    };

    return ObjLoadingTools;
})();