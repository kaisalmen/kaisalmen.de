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
        this.xhrLoader = new THREE.XHRLoader();
        this.xhrLoader.setPath(this.path);
        this.materials = new Map();

        this.defaultMaterial = new THREE.MeshPhongMaterial();
        this.defaultMaterial.name = "defaultMaterial";

        this.announcedFile = "";

        this.overallObjectCount = 0;
        this.faceCount = 0;

        this.useTextDecoder = false;

        this.callbackProgress = null;
        this.callbackMaterialsLoaded = null;
        this.callbackMeshLoaded = null;
        this.callbackCompletedLoading = null;
    }

    ObjLoaderWW.prototype.registerProgressCallback = function (callbackProgress) {
        this.callbackProgress = callbackProgress;
    };

    ObjLoaderWW.prototype.registerHookMaterialsLoaded = function (callback) {
        this.callbackMaterialsLoaded = callback;
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

    ObjLoaderWW.prototype.announceProgress = function (callbackProgress, baseText, text) {
        if (callbackProgress !== null) {
            var output = "";
            if (baseText !== null && baseText !== undefined) {
                output = baseText;
            }

            if (text !== null && text !== undefined) {
                output = output + " " + text;
            }

            //console.log(output);
            callbackProgress(output);
        }
    };

    ObjLoaderWW.prototype.getMaterial = function (name) {
        var material = null;
        if (this.materials !== null) {
            material = this.materials.get(name);
            if (material === undefined) {
                material = null;
            }
        }

        return material;
    };

    ObjLoaderWW.prototype.load = function () {
        var scope = this;

        var onProgress = function (event) {
            if (event.lengthComputable) {
                var percentComplete = event.loaded / event.total * 100;
                var output = Math.round(percentComplete, 2) + "%";
                console.log(output);
                scope.announceProgress(scope.callbackProgress, "Downloading PTV data: ", output);
            }
        };

        var onError = function (event) {
            console.log("Error of type '" + event.type + "' occurred when trying to load: " + event.src);
        };

        var scopeFunction = function (e) {
            scope.processObjData(e);
        };
        scope.worker.addEventListener("message", scopeFunction, false);

        var onLoadObj = function (arrayBuffer) {
            console.log("ObjLoaderWW: Reached onLoadObj");

            scope.worker.postMessage({"cmd" : "init", "useTextDecoder" : scope.useTextDecoder, arrayBuffer : arrayBuffer},[arrayBuffer] );
        };

        var onLoadMtl = function (text, loadObj) {
            console.log("ObjLoaderWW: Reached onLoadMtl");
            var materialCreator = scope.mtlLoader.parse(text);

            if (materialCreator !== null && materialCreator.materialsInfo !== null) {
                var materialsInfo = materialCreator.materialsInfo;
                for (var id in materialsInfo) {
                    scope.materials.set(id, materialCreator.create(id));
                }
            }

            if (scope.callbackMaterialsLoaded !== null) {
                scope.callbackMaterialsLoaded(scope.materials);
            }

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
                        scope.announceProgress(scope.callbackProgress, "Unpacking PTV data...");
                        break;
                    case scope.fileMtl:
                        scope.announceProgress(scope.callbackProgress, "Unpacking PTV material data...");
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

        if (scope.needsUnzipping) {
            var onLoadZip = function(binary) {
                console.log("ObjLoaderWW: Reached onLoadZip");

                var workerZip = new Worker("../../js/apps/tools/webworker/WWUnzip.js");
                workerZip.addEventListener("message", unzipper, false);

                workerZip.postMessage(binary, [binary]);

                scope.announceProgress(scope.callbackProgress, "Uncompressing 150 MB of data!");
                if (scope.fileMtl !== null || scope.fileMtl !== undefined) {
                    workerZip.postMessage({"cmd": "file", "filename": scope.fileMtl, "encoding": "text"});
                }
                workerZip.postMessage({"cmd": "file", "filename": scope.fileObj, "encoding": "arraybuffer"});
                workerZip.postMessage({"cmd": "clean"});
            };

            scope.announceProgress(scope.callbackProgress, "Downloading PTV data:");
            scope.xhrLoader.setResponseType("arraybuffer");
            scope.xhrLoader.load(scope.path + scope.fileZip, onLoadZip, onProgress, onError);
        }
        else {
            if (scope.fileMtl !== null) {
                scope.loader.setResponseType("text");
                scope.xhrLoader.load(scope.path + scope.fileMtl, onLoadMtl, onProgress, onError);
            }
            else {
                scope.xhrLoader.setResponseType("arraybuffer");
                scope.xhrLoader.load(scope.path + scope.fileObj, onLoadObj, onProgress, onError);
            }
        }
    };

    ObjLoaderWW.prototype.setObjGroup = function (objGroup) {
        this.objGroup = objGroup;
    };

    ObjLoaderWW.prototype.processObjData = function (e) {
        var payload = e.data;

        switch (payload.cmd) {
            case "initDone":
                this.worker.postMessage({'cmd' : 'count'});
                break;

            case "countDone":
                this.overallObjectCount = payload.objectCount;
                this.announceProgress(this.callbackProgress, "Adding mesh ");

                this.worker.postMessage({'cmd' : 'process', 'state' : 'start'});
                break;

            case "objData":
                var meshName = payload.meshName;
                var material = this.defaultMaterial;
                if (this.materials !== null) {
                     this.materials.get(payload.material);
                    if (material !== null) {
                        material.shading = payload.smooth ? THREE.SmoothShading : THREE.FlatShading;
                    }
                }

                var output = "(" + payload.count + "/" + this.overallObjectCount + "): " + payload.meshName;
                this.announceProgress(this.callbackProgress, "Adding mesh ", output);

                var bufferGeometry = new THREE.BufferGeometry();
                bufferGeometry.addAttribute("position", new THREE.BufferAttribute(new Float32Array(payload.vertices), 3));
                bufferGeometry.addAttribute("normal", new THREE.BufferAttribute(new Float32Array(payload.normals), 3));
                bufferGeometry.addAttribute("uv", new THREE.BufferAttribute(new Float32Array(payload.uvs), 2));

                this.faceCount += bufferGeometry.getAttribute("position").count;

                if (this.callbackMeshLoaded !== null) {
                    this.callbackMeshLoaded(meshName, material);
                }

                var mesh = new THREE.Mesh(bufferGeometry, material);
                mesh.name = payload.meshName;

                this.objGroup.add(mesh);

                if (payload.complete) {
                    console.log("Total Faces: " + this.faceCount);
                    this.announceProgress(this.callbackProgress, "", "");

                    if (this.callbackCompletedLoading !== null) {
                        this.callbackCompletedLoading();
                    }
                }
                else {
                    this.worker.postMessage({'cmd' : 'process', 'state' : 'ongoing'});
                }
                break;

            default:
                console.error('Received unknown command: ' + payload.cmd);
                break;
        }
    };

    return ObjLoaderWW;
})();