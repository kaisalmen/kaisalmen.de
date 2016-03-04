/**
 * Created by Kai Salmen.
 */

"use strict";


KSX.apps.tools.MeshInfo = (function () {

    function MeshInfo(meshName, materialName) {
        this.meshName = meshName;
        this.materialName = materialName;
    }

    return MeshInfo;
})();


KSX.apps.zerosouth.impl.PTV1Loader = (function () {

    function PTV1Loader(elementToBindTo) {
        this.app = new KSX.apps.core.ThreeJsApp(this, "PTV1Loader", elementToBindTo, true);
        this.controls = new THREE.TrackballControls(this.app.getCamera());

        this.pathToObj = "../../resource/models/";
        this.fileObj = "PTV1.obj";
        this.fileZip = "PTV1.zip";
        this.fileMtl = "PTV1.mtl";

        this.loadDirectly = false;
        this.objLoaderWW = new KSX.apps.tools.ObjLoaderWW(this.pathToObj, this.fileObj, this.fileMtl, !this.loadDirectly, this.fileZip);

        // disables dynamic counting of objects in file
        this.objLoaderWW.setOverallObjectCount(1585);

        this.helper = null;
        this.objGroup = null;

        this.faceCount = 0;
        this.meshInfos = new Set();
        this.exportMeshInfos = false;
        this.alterAllMaterials = false;

        this.alteredColors = new Map();
        this.replaceMaterials = new Map();

        this.stats = new Stats();
    }

    PTV1Loader.prototype.initAsyncContent = function () {
        console.log("PTV1Loader.initAsyncContent is not required!");

        this.app.initSynchronuous();
    };

    PTV1Loader.prototype.initPreGL = function () {
        var progressUpdate = function (text) {
            var div = document.getElementById("DIVFeedbackAreaDynamic");
            div.innerHTML = text;
        };
        this.objLoaderWW.registerProgressCallback(progressUpdate);

        this.stats.setMode(0);
        document.body.appendChild(this.stats.domElement);

        this.alteredColors.set('wire_166229229', 'rgb(2, 26, 128)');
        this.replaceMaterials.set('wire_135110008', 'Yellow_Metal');
    };

    PTV1Loader.prototype.initGL = function () {
        var renderer = this.app.getRenderer();
        var scene = this.app.getScene();
        var camera = this.app.getCamera();

        renderer.setClearColor(0x3B3B3B);
        camera.position.x = 600;
        camera.position.y = 450;
        camera.position.z = 350;

        this.controls.rotateSpeed = 0.5;
        this.controls.zoomSpeed = 1.0;
        this.controls.panSpeed = 0.8;

        this.controls.noZoom = false;
        this.controls.noPan = false;

        this.controls.staticMoving = true;
        this.controls.dynamicDampingFactor = 0.3;

        this.controls.keys = [ 65, 83, 68 ];
//        this.controls.addEventListener( 'change', render );

        var ambient = new THREE.AmbientLight(0x1011030);
        scene.add(ambient);

        var directionalLight1 = new THREE.DirectionalLight(0xd0d0d0);
        directionalLight1.position.set(-1000, 1000, 1000);
        scene.add(directionalLight1);

        var directionalLight2 = new THREE.DirectionalLight(0x909090);
        directionalLight2.position.set(1000, -1000, 1000);
        scene.add(directionalLight2);

        this.helper = new THREE.GridHelper(1000, 20);
        this.helper.setColors(0xFF4444, 0xB0B0B0);
        scene.add(this.helper);

        this.objGroup = new THREE.Group();
        this.objGroup.position.y = 20;
        this.objGroup.position.z = 250;
        scene.add(this.objGroup);

        this.objLoaderWW.setObjGroup(this.objGroup);

        var scope = this;
        var callbackMaterialsLoaded = function (materials) {
            if (materials !== null) {
                console.log("Overall nuumber of materials: " + materials.size);

                var funcAlterMaterials = function(rgbvalue, matName) {
                    console.log('Altering color of "' + matName + '" to: ' + rgbvalue);

                    var matAlter = materials.get(matName);
                    if (matAlter !== null) {
                        matAlter.color = new THREE.Color(rgbvalue);
                    }
                    if (scope.alterAllMaterials) {
                        material.side = THREE.DoubleSide;
                        material.transparent = true;
                        material.opacity = 0.5;
                    }
                };
                scope.alteredColors.forEach(funcAlterMaterials, scope.alteredColors);
            }
        };
        this.objLoaderWW.registerHookMaterialsLoaded(callbackMaterialsLoaded);

        var callbackMeshLoaded = function (meshName, material) {
            var replacedMaterial = null;
            var replacedMaterialName = scope.replaceMaterials.get(material.name);

            if (replacedMaterialName !== null && replacedMaterialName !== undefined) {
                replacedMaterial = scope.objLoaderWW.getMaterial(replacedMaterialName);
            }

            if (replacedMaterial !== null) {
                var meshInfo = new KSX.apps.tools.MeshInfo(meshName, replacedMaterial.name);
            }
            else {
                var meshInfo = new KSX.apps.tools.MeshInfo(meshName, material.name);
            }

            scope.meshInfos.add(meshInfo);

            return replacedMaterial;
        };
        this.objLoaderWW.registerHookMeshLoaded(callbackMeshLoaded);

        var callbackCompletedLoading = function () {
            if (scope.exportMeshInfos) {
                var exportString = "";

                if (scope.meshInfos.size > 0) {
                    for (let item of scope.meshInfos.values()) {
                        exportString += JSON.stringify(item);
                        exportString += "\n";
                    }

                    var blob = new Blob([exportString], {type: "text/plain;charset=utf-8"});
                    saveAs(blob, "meshInfos.json");
                }
                else {
                    alert("Unable to export MeshInfo data as the datastructure is empty!");
                }
            }
        };
        this.objLoaderWW.registerHookCompletedLoading(callbackCompletedLoading);

        this.objLoaderWW.load();
    };

    PTV1Loader.prototype.render = function() {
        this.controls.update();
        this.stats.update();
    };

    PTV1Loader.prototype.resizeDisplayGL = function() {
        this.controls.handleResize();
    };

    return PTV1Loader;
})();