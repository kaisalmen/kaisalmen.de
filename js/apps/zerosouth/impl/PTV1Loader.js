/**
 * Created by Kai Salmen.
 */

'use strict';


KSX.apps.tools.MeshInfo = (function () {

    function MeshInfo(meshName, materialName) {
        this.meshName = meshName;
        this.materialName = materialName;
    }

    return MeshInfo;
})();


KSX.apps.zerosouth.impl.PTV1Loader = (function () {

    var SLIDES_WIDTH = 100;
    var SLIDES_HEIGHT = 32;

    function PTV1Loader(elementToBindTo) {
        this.app = new KSX.apps.core.ThreeJsApp(this, 'PTV1Loader', elementToBindTo, true, false, true);
        this.controls = null;

        this.pathToObj = '../../resource/models/';
        this.fileObj = 'PTV1.obj';
        this.fileZip = 'PTV1.zip';
        this.fileMtl = 'PTV1.mtl';

        this.loadDirectly = false;
        this.objLoaderWW = new KSX.apps.tools.ObjLoaderWW(this.pathToObj, this.fileObj, this.fileMtl, !this.loadDirectly, this.fileZip);

        // disables dynamic counting of objects in file
        this.objLoaderWW.setOverallObjectCount(1585);

        this.helper = null;
        this.objGroup = null;

        this.faceCount = 0;
        this.meshInfos = new Set();
        this.exportMeshInfos = false;

        this.replaceMaterials = new Map();
        this.replaceObjectMaterials = new Map();
        this.alterMaterials = new Map();

        this.textureTools = new KSX.apps.tools.TextureTools();
        this.textureCubeLoader = null;
        this.cameraCube = null;
        this.skybox = null;

        this.ui = new UIL.Gui({
            css: 'top: 0px; right: 0px;',
            size: 350,
            center: true
        });

        this.stats = new Stats();
    }

    PTV1Loader.prototype.initAsyncContent = function () {
        var scope = this;

        var promises = new Set();
        var cubeBasePath = '../../resource/textures/skybox';
        var imageFileNames = [ 'px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg' ];
        promises.add(this.textureTools.loadTextureCube(cubeBasePath, imageFileNames));

        Promise.all(promises).then(
            function (results) {
                scope.textureCubeLoader = results[0];
                scope.app.initSynchronuous();
            }
        ).catch(
            function (error) {
                console.log('The following error occurred: ', error);
            }
        );
    };

    PTV1Loader.prototype.initPreGL = function () {
        var progressUpdate = function (text) {
            var div = document.getElementById('DIVFeedbackAreaDynamic');
            div.innerHTML = text;
        };
        this.objLoaderWW.registerProgressCallback(progressUpdate);

        this.stats.setMode(0);
        document.body.appendChild(this.stats.domElement);
    };

    PTV1Loader.prototype.initGL = function () {
        var scope = this;
        var renderer = this.app.renderer;
        var scenePerspective = this.app.scenePerspective;
        var scene = scenePerspective.scene;
        var sceneCube = scenePerspective.sceneCube;
        var camera = scenePerspective.camera;
        var cameraTarget = scenePerspective.cameraTarget;

        renderer.setClearColor(0x3B3B3B);
        renderer.autoClear = false;

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


        var ambient = new THREE.AmbientLight(0x707070);
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


        // material adjustemnts
        var glass = new THREE.MeshStandardMaterial( {
            color: '#555555',
            transparent: true,
            side : THREE.DoubleSide,
            opacity: 0.45,
        });
        this.objLoaderWW.addMaterial('glass', glass);

        var glassProps = {
            name: 'glass',
            maxOpacity: 0.45,
            materialAdjustments : {
            }
        };
        this.replaceObjectMaterials.set('WindshieldGlass', glassProps);
        this.replaceObjectMaterials.set('DoorRGlass', glassProps);
        this.replaceObjectMaterials.set('DoorLGlass', glassProps);

        this.alterMaterials.set('Blue_Paint', {
            envMap: scope.textureCubeLoader,
            envMapIntensity: 0.5,
            roughness: 0.2,
            color: new THREE.Color( 0x0221A5 )
        });


        // Skybox
        var shader = THREE.ShaderLib[ "cube" ];
        shader.uniforms[ "tCube" ].value = this.textureCubeLoader;

        var box = new THREE.BoxGeometry( 100, 100, 100 );
        var materialCube = new THREE.ShaderMaterial( {
            fragmentShader: shader.fragmentShader,
            vertexShader: shader.vertexShader,
            uniforms: shader.uniforms,
            depthWrite: false,
            side: THREE.BackSide
        });
        this.skybox = new THREE.Mesh(box, materialCube );
        sceneCube.add( this.skybox );

        this.objGroup = new THREE.Group();
        this.objGroup.position.y = 20;
        this.objGroup.position.z = 250;
        scene.add(this.objGroup);

        this.objLoaderWW.setObjGroup(this.objGroup);

        var callbackMaterialsLoaded = function (materials) {
            if (materials !== null) {
                console.log('Overall number of materials: ' + materials.size);

                var alter;
                var funcAlterMaterials = function(material, matName) {
                    alter = scope.alterMaterials.get(matName);
                    if (alter !== undefined) {
                        for ( var prop in alter ) {
                            material[prop] = alter[prop];
                        }
                    }
                };
                materials.forEach(funcAlterMaterials);
            }
        };
        this.objLoaderWW.registerHookMaterialsLoaded(callbackMaterialsLoaded);

        var callbackMeshLoaded = function (meshName, material) {
            var replacedMaterial = null;
            var perObjectMaterial = scope.replaceObjectMaterials.get(meshName);
            var perObjectMaterialName = null;
            if (perObjectMaterial !== undefined && perObjectMaterial !== null) {
                perObjectMaterialName = perObjectMaterial['name'];
            }

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
                var exportString = '';

                if (scope.meshInfos.size > 0) {
                    for (let item of scope.meshInfos.values()) {
                        exportString += JSON.stringify(item);
                        exportString += '\n';
                    }

                    var blob = new Blob([exportString], {type: 'text/plain;charset=utf-8'});
                    saveAs(blob, 'meshInfos.json');
                }
                else {
                    alert('Unable to export MeshInfo data as the datastructure is empty!');
                }
            }
        };
        this.objLoaderWW.registerHookCompletedLoading(callbackCompletedLoading);

        this.objLoaderWW.load();
    };

    PTV1Loader.prototype.initPostGL = function() {
        var scope = this;

        var enableSkybox = function (enabled) {
            scope.skybox.visible = enabled;
        };
        this.ui.add('bool', {
            name: 'Skybox',
            value: true,
            callback: enableSkybox,
            height: SLIDES_HEIGHT
        });


        var adjustOpacity = function (value) {
            var scene = scope.app.scenePerspective.scene;
            var mesh;
            var dontAlter;
            var transparent = value < 1.0 ? true : false;
            var side = value < 1.0 ? THREE.DoubleSide : THREE.FrontSide;
            var maxOpacity = 1.0;

            for (var meshInfo of scope.meshInfos) {
                mesh = scene.getObjectByName(meshInfo.meshName);
                dontAlter = scope.replaceObjectMaterials.get(meshInfo.meshName);

                if (dontAlter === undefined && mesh !== undefined) {
                    mesh.material.transparent = transparent;
                    mesh.material.opacity = value;
                    mesh.material.side = side;
                }
                else {
                    maxOpacity = dontAlter['maxOpacity'];
                    if (value > maxOpacity) {
                        mesh.material.opacity = maxOpacity;
                    }
                    else {
                        mesh.material.opacity = value;
                    }

                    for ( var prop in dontAlter['materialAdjustments'] ) {
                        mesh.material[prop] = dontAlter[prop];
                    }
                }
            }
        };
        scope.ui.add('slide', {
            name: 'Opacity',
            callback: adjustOpacity,
            min: 0.0,
            max: 1.0,
            value: 1.0,
            precision: 2,
            step: 0.01,
            width: SLIDES_WIDTH,
            height: SLIDES_HEIGHT
        });
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