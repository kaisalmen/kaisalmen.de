/**
 * Created by Kai Salmen.
 */

"use strict";

KSX.apps.tools.ObjLoaderWW = (function () {

    function ObjLoaderWW (path, fileObj, fileMtl, needsUnzipping, fileZip) {
        this.worker = new Worker("../../js/apps/tools/webworker/WWObjParser.js");

        this.path = path;
        this.fileObj = fileObj;
        this.fileMtl = fileMtl;
        this.needsUnzipping = needsUnzipping;
        this.fileZip = fileZip;

        this.mtlLoader = new THREE.MTLLoader();

        // TODO: Implement own loading manager
        this.loader = new THREE.XHRLoader();
        this.loader.setPath(this.path);
        this.materials = null;

        this.defaultMaterial = new THREE.MeshPhongMaterial();
        this.defaultMaterial.name = "defaultMaterial";

        this.announcedFile = "";
        this.geoStruct = {
            current: "reset",
            name: "unknown",
            bufferGeometry: new THREE.BufferGeometry(),
            material: this.defaultMaterial
        };

        this.overallObjectCount = 0;
        this.faceCount = 0;
        this.progressCallback = null;

        this.progressInfoBaseText = "";

        this.useTextDecoder = false;

        this.callbackMeshLoaded = null;
        this.callbackCompletedLoading = null;
    }

    ObjLoaderWW.prototype.registerProgressCallback = function (progresCallback) {
        this.progressCallback = progresCallback;
    };

    ObjLoaderWW.prototype.registerHookMeshLoaded = function (callback) {
        this.callbackMeshLoaded = callback;
    };

    ObjLoaderWW.prototype.registerHookCompletedLoading = function (callback) {
        this.callbackCompletedLoading = callback;
    };

    ObjLoaderWW.prototype.setUseTextDecoder = function (useTextDecoder) {
        this.useTextDecoder = useTextDecoder;
    };

    ObjLoaderWW.prototype.announceProgress = function (scope, text, newBaseText) {
        if (scope.progressCallback !== null) {
            if (newBaseText !== null && newBaseText !== undefined) {
                scope.progressInfoBaseText = newBaseText;
            }
            var output = scope.progressInfoBaseText + " " + text;
            //console.log(output);
            scope.progressCallback(output);
        }
    };

    ObjLoaderWW.prototype.load = function () {
        var scope = this;

        var onProgress = function (event) {
            if (event.lengthComputable) {
                var percentComplete = event.loaded / event.total * 100;
                var output = Math.round(percentComplete, 2) + "%";
                console.log(output);
                scope.announceProgress(scope, output);
            }
        };

        var onError = function (event) {
            console.log("Error of type '" + event.type + "' occurred when trying to load: " + event.src);
        };

        var onLoadObj = function (arrayBuffer) {
            console.log("ObjLoaderWW: Reached onLoadObj");
            var scopeFunction = function (e) {
                scope.process(e);
            };
            scope.worker.addEventListener("message", scopeFunction, false);
            scope.worker.postMessage({"cmd" : "init", "useTextDecoder" : scope.useTextDecoder});

            scope.worker.postMessage(arrayBuffer, [arrayBuffer]);
        };

        var onLoadMtl = function (text, loadObj) {
            console.log("ObjLoaderWW: Reached onLoadMtl");
            scope.materials = scope.mtlLoader.parse(text);

            if (loadObj === undefined || loadObj === null) {
                scope.loader.setResponseType("arraybuffer");
                scope.loader.load(scope.path + scope.fileObj, onLoadObj, onProgress, onError);
            }
        };

        var unzipper = function (e) {
            var payload = e.data;
            if (payload.cmd !== null && payload.cmd === "feedback") {
                scope.announcedFile = payload.filename;
                switch (payload.filename) {
                    case scope.fileObj:
                        scope.announceProgress(scope, "", "Unpacking PTV data...");
                        break;
                    case scope.fileMtl:
                        scope.announceProgress(scope, "", "Unpacking PTV material data...");
                        break;
                    default:
                        console.log("Received feedback for unkown file: " + payload.filename);
                        break;
                }
            }
            else {
                if (scope.announcedFile === scope.fileMtl) {
                    onLoadMtl(payload.text, false);
                }
                else if (scope.announcedFile === scope.fileObj) {
                    onLoadObj(e.data);
                }
            }
        };

        if (this.needsUnzipping) {
            var onLoadZip = function(binary) {
                console.log("ObjLoaderWW: Reached onLoadZip");

                var workerZip = new Worker("../../js/apps/tools/webworker/WWUnzip.js");
                workerZip.addEventListener("message", unzipper, false);

                workerZip.postMessage(binary, [binary]);

                scope.announceProgress(scope, "", "Uncompressing 150 MB of data!");
                if (scope.fileMtl !== null || scope.fileMtl !== undefined) {
                    workerZip.postMessage({"cmd": "file", "filename": scope.fileMtl, "encoding": "text"});
                }
                workerZip.postMessage({"cmd": "file", "filename": scope.fileObj, "encoding": "arraybuffer"});
                workerZip.postMessage({"cmd": "clean"});
            };

            this.announceProgress(this, "", "Downloading object data:");
            this.loader.setResponseType("arraybuffer");
            this.loader.load(this.path + this.fileZip, onLoadZip, onProgress, onError);
        }
        else {
            if (this.fileMtl !== null) {
                scope.loader.setResponseType("text");
                this.loader.load(this.path + this.fileMtl, onLoadMtl, onProgress, onError);
            }
            else {
                this.loader.setResponseType("arraybuffer");
                this.loader.load(this.path + this.fileObj, onLoadObj, onProgress, onError);
            }
        }
    };

    ObjLoaderWW.prototype.setObjGroup = function (objGroup) {
        this.objGroup = objGroup;
    };

    ObjLoaderWW.prototype.resetGeoStruct = function () {
        this.geoStruct.current = "reset";
        this.geoStruct.name = "unknown";
        this.geoStruct.bufferGeometry = new THREE.BufferGeometry();
        this.geoStruct.material = this.defaultMaterial;
    };

    ObjLoaderWW.prototype.process = function (e) {
        var payload = e.data;
        if (payload.cmd != null) {
            switch (payload.cmd) {
                case "start":
                    this.overallObjectCount = payload.objectCount;
                    this.announceProgress(this, "", "Adding mesh ");
                    break;
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
                case "name":
                    this.geoStruct.name = payload.meshName;

                    var output = "(" + payload.count + "/" + this.overallObjectCount + "): " + this.geoStruct.name;
                    this.announceProgress(this, output);
                    break;
                case "ready":
                    this.geoStruct.current = "ready";

                    this.faceCount += this.geoStruct.bufferGeometry.getAttribute("position").count;

                    if (this.callbackMeshLoaded !== null) {
                        this.callbackMeshLoaded(this.geoStruct.name, this.geoStruct.material);
                    }

                    var mesh = new THREE.Mesh(this.geoStruct.bufferGeometry, this.geoStruct.material);
                    mesh.name = this.geoStruct.name;

                    this.objGroup.add(mesh);
                    break;
                case "complete":
                    console.log("Total Faces: " + this.faceCount);
                    this.announceProgress(this, "", "");

                    if (this.callbackCompletedLoading !== null) {
                        this.callbackCompletedLoading();
                    }

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