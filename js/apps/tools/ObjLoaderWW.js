/**
 * Created by Kai Salmen.
 */

"use strict";

KSX.apps.tools.ObjLoaderWW = (function () {

    function ObjLoaderWW (manager, path, fileObj, fileMtl, needsUnzipping, fileZip) {
        this.worker = new Worker("../../js/apps/tools/webworker/WWObjParser.js");

        this.manager = (manager !== undefined && manager !== null) ? manager : THREE.DefaultLoadingManager;

        this.path = path;
        this.fileObj = fileObj;
        this.fileMtl = fileMtl;
        this.needsUnzipping = needsUnzipping;
        this.fileZip = fileZip;

        this.mtlLoader = new THREE.MTLLoader();
        this.loader = new THREE.XHRLoader(this.manager);
        this.loader.setPath(this.path);
        this.materials = null;

        this.objContent = null;
        this.mtlContent = null;

        this.defaultMaterial = new THREE.MeshPhongMaterial();
        this.defaultMaterial.name = "defaultMaterial";

        this.geoStruct = {
            current: "reset",
            bufferGeometry: new THREE.BufferGeometry(),
            material: this.defaultMaterial
        };

        this.faceCount = 0;
    }

    ObjLoaderWW.prototype.onProgress = function (event) {
        if (event.lengthComputable) {
            var percentComplete = event.loaded / event.total * 100;
            console.log(Math.round(percentComplete, 2) + '% downloaded');
        }
    };

    ObjLoaderWW.prototype.onError = function (event) {
        console.log("Error of type '" + event.type + "' occurred when trying to load: " + src);
    };

    ObjLoaderWW.prototype.load = function () {
        var scope = this;

        var unzipper = function (e) {
            var arrayBuffer = e.data;

            var scopeFunction = function (e) {
                scope.process(e);
            };
            scope.worker.addEventListener("message", scopeFunction, false);
            scope.worker.postMessage(arrayBuffer, [arrayBuffer]);
        };

        var onLoadObj = function (text) {
            console.log("reached onLoadObj");
            scope.objContent = text;

            if (scope.needsUnzipping) {
                var workerZip = new Worker("../../js/apps/tools/webworker/WWUnzip.js");
                workerZip.addEventListener("message", unzipper, false);

                workerZip.postMessage({"filename": scope.fileObj});
                workerZip.postMessage(scope.objContent, [scope.objContent]);
            }
        };

        var onLoadMtl = function (text) {
            console.log("reached onLoadMtl");
            scope.mtlContent = text;

            scope.materials = scope.mtlLoader.parse(scope.mtlContent);

            if (scope.needsUnzipping) {
                scope.loader.setResponseType("arraybuffer");
                scope.loader.load(scope.path + scope.fileZip, onLoadObj, scope.onProgress, scope.onError);
            }
            else {
                scope.loader.load(scope.path + scope.fileObj, onLoadObj, scope.onProgress, scope.onError);
            }
        };

        if (this.fileMtl !== null || this.fileMtl !== undefined) {
            scope.loader.load(scope.path + scope.fileMtl, onLoadMtl, scope.onProgress, scope.onError);
        }
        else {
            if (scope.needsUnzipping) {
                scope.loader.setResponseType("arraybuffer");
                scope.loader.load(scope.path + scope.fileZip, onLoadObj, scope.onProgress, scope.onError);
            }
            else {
                scope.loader.load(scope.path + scope.fileObj, onLoadObj, scope.onProgress, scope.onError);
            }
        }
    };

    ObjLoaderWW.prototype.getWorker = function () {
        return this.worker;
    };

    ObjLoaderWW.prototype.setObjGroup = function (objGroup) {
        this.objGroup = objGroup;
    };

    ObjLoaderWW.prototype.registerCallback = function (callback) {
        this.worker.addEventListener("message", callback, false);
        return this.worker;
    };

    ObjLoaderWW.prototype.resetGeoStruct = function () {
        this.geoStruct.current = "reset";
        this.geoStruct.bufferGeometry = new THREE.BufferGeometry();
        this.geoStruct.material = this.defaultMaterial;
    };

    ObjLoaderWW.prototype.process = function (e) {
        var payload = e.data;
        if (payload.cmd != null) {
            switch (payload.cmd) {
                case "reset":
                    this.resetGeoStruct();
                    break;
                case "position":
                    this.geoStruct.current = "position";
                    break;
                case "normal":
                    this.geoStruct.current = "normal";
                    break;
                case "uv":
                    this.geoStruct.current = "uv";
                    break;
                case "material":
                    var materialName = payload.material;

                    if (this.materials !== null) {
                        this.geoStruct.material = this.materials.create(materialName);
                    }
                    this.geoStruct.material.shading = payload.smooth ? THREE.SmoothShading : THREE.FlatShading;
                    break;
                case "ready":
                    this.geoStruct.current = "ready";
//                    console.time("Main: Add BufferGeometry");
                    this.faceCount += this.geoStruct.bufferGeometry.getAttribute("position").count;
                    var mesh = new THREE.Mesh(this.geoStruct.bufferGeometry, this.geoStruct.material);
                    this.objGroup.add(mesh);
//                    console.timeEnd("Main: Add BufferGeometry");
                    break;
                case "complete":
                    console.log("Total Faces: " + this.faceCount);
                default:
                    break;
            }
        }
        else {
            switch (this.geoStruct.current) {
                case "position":
                    this.geoStruct.bufferGeometry.addAttribute("position", new THREE.BufferAttribute(new Float32Array(payload), 3));
                    break;
                case "normal":
                    this.geoStruct.bufferGeometry.addAttribute("normal", new THREE.BufferAttribute(new Float32Array(payload), 3));
                    break;
                case "uv":
                    this.geoStruct.bufferGeometry.addAttribute("uv", new THREE.BufferAttribute(new Float32Array(payload), 2));
                    break;
                default:
                    break;
            }
        }


    };

    return ObjLoaderWW;
})();