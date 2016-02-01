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

        this.objLoader = new THREE.OBJLoader(this.manager);
        this.mtlLoader = new THREE.MTLLoader();
    }

    ObjLoadingTools.prototype.onProgress = function (event) {
        if (event.lengthComputable) {
            var percentComplete = event.loaded / event.total * 100;
            console.log(Math.round(percentComplete, 2) + '% downloaded');
        }
    };

    ObjLoadingTools.prototype.onError = function (event) {
        console.log("Error of type '" + event.type + "' occurred when trying to load: " + src);
    };

    ObjLoadingTools.prototype.loadMtl = function (baseURL, mtlFile, objLoadFunction) {
        this.mtlLoader.setBaseUrl(baseURL);
        this.mtlLoader.setPath(baseURL);
        this.mtlLoader.load(mtlFile, objLoadFunction, this.onProgress, this.onError);
    }

    ObjLoadingTools.prototype.parseMtl = function (dataAsText) {
        return this.mtlLoader.parse(dataAsText);
    };

    ObjLoadingTools.prototype.loadObject = function (objPath, objFile, materials, loadFunction) {
        this.objLoader.setPath(objPath);
        if (materials !== null) {
            materials.preload();
            this.objLoader.setMaterials( materials );
        }
        this.objLoader.load(objFile, loadFunction, this.onProgress, this.onError);
    };

    ObjLoadingTools.prototype.parseObj = function (dataAsTextObj, dataAsTextMtl) {
        var materials = this.mtlLoader.parse(dataAsTextMtl);
        this.objLoader.setMaterials(materials);
        return this.objLoader.parse(dataAsTextObj);
    };

    return ObjLoadingTools;
})();