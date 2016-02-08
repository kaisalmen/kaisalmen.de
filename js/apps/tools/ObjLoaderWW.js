/**
 * Created by Kai Salmen.
 */

"use strict";

KSX.apps.tools.ObjLoaderWW = (function () {

    function ObjLoaderWW() {
        this.worker = new Worker("../../js/apps/tools/webworker/WWObjParser.js");


        this.geoStruct = {
            current : "reset",
            bufferGeometry : new THREE.BufferGeometry(),
            material : null
        };

        this.defaultMaterial = new THREE.MeshPhongMaterial();

        this.faceCount = 0;
    }

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

    ObjLoaderWW.prototype.setMaterials = function (materials) {
        this.materials = materials;
    };

    ObjLoaderWW.prototype.resetGeoStruct = function () {
        this.geoStruct.current = "reset";
        this.geoStruct.bufferGeometry = new THREE.BufferGeometry();
        this.geoStruct.material = null;
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
                case "ready":
                    this.geoStruct.current = "ready";
//                    console.time("Main: Add BufferGeometry");
                    this.faceCount += this.geoStruct.bufferGeometry.getAttribute("position").count;
                    var mesh = new THREE.Mesh(this.geoStruct.bufferGeometry, this.defaultMaterial);
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