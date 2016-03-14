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
        this.app = new KSX.apps.core.ThreeJsApp(this, "PTV1Loader", elementToBindTo, true, false);
        this.controls = null;

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

        this.replaceMaterials = new Map();
        this.replaceObjectMaterials = new Map();

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

        var glass = new THREE.MeshStandardMaterial( {
            color: '#555555',
            transparent: true,
            opacity: 0.45,
            depthTest: true
        });
        this.objLoaderWW.addMaterial('glass', glass);

        this.replaceObjectMaterials.set('WindshieldGlass', 'glass');
        this.replaceObjectMaterials.set('DoorRGlass', 'glass');
        this.replaceObjectMaterials.set('DoorLGlass', 'glass');
    };

    PTV1Loader.prototype.initGL = function () {
        var renderer = this.app.renderer;
        var scenePerspective = this.app.scenePerspective;
        var scene = scenePerspective.getScene();
        var camera = scenePerspective.getCamera();
        var cameraTarget = scenePerspective.getCameraTarget();

        renderer.setClearColor(0x3B3B3B);
        camera.position.set( 600, 350, 600);
        cameraTarget.y = 500;
        scenePerspective.updateCamera();

        this.controls = new THREE.TrackballControls(camera);

        this.controls.rotateSpeed = 0.5;
        this.controls.zoomSpeed = 1.0;
        this.controls.panSpeed = 0.8;

        this.controls.staticMoving = true;
        this.controls.dynamicDampingFactor = 0.3;

        this.controls.keys = [ 65, 83, 68 ];
//        this.controls.addEventListener( 'change', render );

        var ambient = new THREE.AmbientLight(0x404040);
        scene.add(ambient);

        var posLight1 = new THREE.Vector3(-500, 500, 500);
        var posLight2 = new THREE.Vector3(500, 200, -500);
        var light1Color = 0xF0F0F0;
        var light2Color = 0xE0E0E0;

        var emissiveMat1 = new THREE.MeshStandardMaterial( {
            emissive: new THREE.Color( light1Color ),
            emissiveIntensity: 1.0
        });
        var emissiveMat2 = new THREE.MeshStandardMaterial( {
            emissive: new THREE.Color( light2Color ),
            emissiveIntensity: 1.0
        });

        var geoLight = new THREE.SphereGeometry(5, 32, 32);
        var light1Mesh = new THREE.Mesh(geoLight, emissiveMat1);
        light1Mesh.position.set(posLight1.x, posLight1.y, posLight1.z);
        scene.add(light1Mesh);

        var light2Mesh = new THREE.Mesh(geoLight, emissiveMat2);
        light2Mesh.position.set(posLight2.x, posLight2.y, posLight2.z);
        scene.add(light2Mesh);

        var directionalLight1 = new THREE.DirectionalLight(light1Color);
        directionalLight1.position.set(posLight1.x, posLight1.y, posLight1.z);
        scene.add(directionalLight1);

        var directionalLight2 = new THREE.DirectionalLight(light2Color);
        directionalLight2.position.set(posLight2.x, posLight2.y, posLight2.z);
        scene.add(directionalLight2);

        var dHelp1 = new THREE.DirectionalLightHelper(directionalLight1, 40);
        scene.add(dHelp1);

        var dHelp2 = new THREE.DirectionalLightHelper(directionalLight2, 40);
        scene.add(dHelp2);

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

                if (scope.alterAllMaterials) {
                    var funcAlterMaterials = function(material, matName) {
                        material.side = THREE.DoubleSide;
                        material.transparent = true;
                        material.opacity = 0.5;
                        material.depthTest = true;
                    };
                    materials.forEach(funcAlterMaterials);
                }
            }
        };
        this.objLoaderWW.registerHookMaterialsLoaded(callbackMaterialsLoaded);

        var callbackMeshLoaded = function (meshName, material) {
            var replacedMaterial = null;
            var perObjectMaterialName = scope.replaceObjectMaterials.get(meshName);

            if (perObjectMaterialName !== null && perObjectMaterialName !== undefined) {
                replacedMaterial = scope.objLoaderWW.getMaterial(perObjectMaterialName);
            }
            else {
                var replacedMaterialName = scope.replaceMaterials.get(material.name);
                if (replacedMaterialName !== null && replacedMaterialName !== undefined) {
                    replacedMaterial = scope.objLoaderWW.getMaterial(replacedMaterialName);
                }
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