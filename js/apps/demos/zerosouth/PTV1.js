/**
 * @author Kai Salmen / www.kaisalmen.de
 */

'use strict';

if ( KSX.apps.zerosouth === undefined ) {
    KSX.apps.zerosouth = {}
}

KSX.apps.tools.MeshInfo = (function () {

    function MeshInfo(meshName, materialName) {
        this.meshName = meshName;
        this.materialName = materialName;
    }

    return MeshInfo;
})();


KSX.apps.zerosouth.PTV1Loader = (function () {

    PTV1Loader.prototype = Object.create(KSX.apps.core.ThreeJsApp.prototype, {
        constructor: {
            configurable: true,
            enumerable: true,
            value: PTV1Loader,
            writable: true
        }
    });

    function PTV1Loader( elementToBindTo, mobileDevice ) {
        KSX.apps.core.ThreeJsApp.call(this);

        this.configure({
            name: 'PTV1Loader',
            htmlCanvas: elementToBindTo,
            useScenePerspective: true,
            useCube: true
        });
        this.controls = null;

        this.pathToObj = '../../resource/models/';
        this.fileObj = 'PTV1.obj';
        this.fileZip = 'PTV1.zip';
        this.fileMtl = 'PTV1.mtl';
        this.wwObjFrontEnd = new THREE.WebWorker.WWOBJLoaderFrontEnd( KSX.globals.basedir );

        this.objGroup = null;

        this.meshInfos = [];
        this.exportMeshInfos = false;

        this.replaceMaterials = [];
        this.replaceObjectMaterials = [];
        this.dontAlterOpacity = [];
        this.alterMaterials = [];

        this.textureTools = new KSX.apps.tools.TextureTools();
        this.textureCubeLoader = null;
        this.skybox = null;
        this.ground = null;

        var uiToolsConfig = {
            mobileDevice: mobileDevice,
            useUil: true,
            uilParams: {
                css: 'top: 0px; left: 0px;',
                width: 384,
                center: false,
                color: 'rgba(224, 224, 224, 1.0)',
                bg: 'rgba(40, 40, 40, 0.66)'
            },
            paramsDimension: {
                desktop : {
                    slidesWidth : 384
                },
                mobile : {
                    slidesWidth : 384
                }
            },
            useStats: true
        };
        this.uiTools = new KSX.apps.tools.UiTools( uiToolsConfig );

        this.zipTools = new KSX.apps.tools.ZipTools( this.pathToObj );
    }

    PTV1Loader.prototype.initPreGL = function () {
        var scope = this;

        scope.uiTools.createFeedbackAreaDynamic();

        var announceFeedback = function ( text ) {
            scope.uiTools.announceFeedback( text );
        };
        scope.wwObjFrontEnd.registerProgressCallback( announceFeedback );

        this.uiTools.enableStats();

        var promises = [];
        var cubeBasePath = '../../resource/textures/skybox';
        var imageFileNames = [ 'px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg' ];
        promises.push( this.textureTools.loadTextureCube( cubeBasePath, imageFileNames ) );

        Promise.all(promises).then(
            function (results) {
                scope.textureCubeLoader = results[0];
                scope.preloadDone = true;
            }
        ).catch(
            function (error) {
                console.log('The following error occurred: ', error);
            }
        );
    };

    PTV1Loader.prototype.initGL = function () {
        var scope = this;

        this.renderer.setClearColor(0x3B3B3B);
        this.renderer.autoClear = false;

        this.scenePerspective.camera.position.set( 600, 350, 600);
        this.scenePerspective.cameraTarget.y = 500;
        this.scenePerspective.updateCamera();

        this.controls = new THREE.TrackballControls(this.scenePerspective.camera);

        var ambientLight = new THREE.AmbientLight(0x707070);
        this.scenePerspective.scene.add(ambientLight);

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
        this.scenePerspective.scene.add(light1Mesh);

        var light2Mesh = new THREE.Mesh(geoLight, emissiveMat2);
        light2Mesh.position.set(posLight2.x, posLight2.y, posLight2.z);
        this.scenePerspective.scene.add(light2Mesh);

        var directionalLight1 = new THREE.DirectionalLight(light1Color);
        directionalLight1.position.set(posLight1.x, posLight1.y, posLight1.z);
        directionalLight1.castShadow = true;
        directionalLight1.shadow.camera.near = 10;
        directionalLight1.shadow.camera.far = 2500;
        directionalLight1.shadow.camera.fov = 50;
        directionalLight1.shadow.mapSize.width = 2048;
        directionalLight1.shadow.mapSize.height = 2048;
        this.scenePerspective.scene.add(directionalLight1);

        var directionalLight2 = new THREE.DirectionalLight(light2Color);
        directionalLight2.position.set(posLight2.x, posLight2.y, posLight2.z);
        directionalLight2.castShadow = true;
        this.scenePerspective.scene.add(directionalLight2);

        var dHelp1 = new THREE.DirectionalLightHelper(directionalLight1, 40);
        this.scenePerspective.scene.add(dHelp1);

        var dHelp2 = new THREE.DirectionalLightHelper(directionalLight2, 40);
        this.scenePerspective.scene.add(dHelp2);

        var helper = new THREE.GridHelper( 2400, 100, 0xFF4444, 0x404040 );
        this.scenePerspective.scene.add(helper);

        var groundGeometry = new THREE.CircleGeometry( 5000, 64 );
        var groundMaterial = new THREE.MeshStandardMaterial( {side: THREE.DoubleSide} );
        this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
        this.ground.rotateX( Math.PI / 2.0) ;
        this.ground.position.set( 0.0, -1.0, 0.0 );
        this.ground.receiveShadow = true;
        this.ground.castShadow = true;

        this.scenePerspective.scene.add(this.ground);


        // material adjustemnts
        var glass = new THREE.MeshStandardMaterial( {
            color: '#555555',
            transparent: true,
            side : THREE.DoubleSide,
            opacity: 0.45
        });
        this.wwObjFrontEnd.addMaterial('glass', glass);

        var glassProps = {
            name: 'glass',
            maxOpacity: 0.45,
            materialAdjustments : {
            }
        };
        this.replaceObjectMaterials['WindshieldGlass'] = glassProps;
        this.replaceObjectMaterials['DoorRGlass'] = glassProps;
        this.replaceObjectMaterials['DoorLGlass'] = glassProps;

        this.dontAlterOpacity = this.replaceObjectMaterials;

        this.alterMaterials['Blue_Paint'] = {
            envMap: scope.textureCubeLoader,
            envMapIntensity: 0.5,
            roughness: 0.2,
            color: new THREE.Color( 0x0221A5 )
        };


        this.objGroup = new THREE.Group();
        this.objGroup.position.y = 20;
        this.objGroup.position.z = 250;
        this.scenePerspective.scene.add( this.objGroup );

        this.wwObjFrontEnd.setObjGroup( this.objGroup );


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
        this.skybox = new THREE.Mesh(box, materialCube);
        this.scenePerspective.sceneCube.add( this.skybox );

        var callbackMaterialsLoaded = function ( materials ) {
            if ( materials !== null ) {
                var alter;
                var matName;
                var material;
                var prop;
                var materialCount = 0;

                for ( matName in materials ) {
                    if ( ! materials.hasOwnProperty( matName ) ) {
                        continue;
                    }
                    materialCount++;
                    material = materials[ matName ];

                    var msm = new THREE.MeshStandardMaterial();
                    msm.copy( material );

                    if ( material.hasOwnProperty( 'shininess' ) ) {
                        msm.metalness = [ 0.0, material.shininess / 100.0, 1.0 ].sort()[ 1 ];
                    }
                    if ( material.hasOwnProperty( 'specular' ) ) {
                        var s = material.specular;
                        msm.roughness = [ 0.0, ( 3.0 - s.r - s.g - s.b ) / 3.0, 1.0 ].sort()[ 1 ];
                    }

                    if ( scope.alterMaterials.hasOwnProperty( matName ) ) {
                        alter = scope.alterMaterials[ matName ];

                        for ( prop in alter ) {
                            if ( msm.hasOwnProperty( prop ) && alter.hasOwnProperty( prop ) ) {
                                msm[ prop ] = alter[ prop ];
                            }
                        }
                    }
                    materials[ matName ] = msm;
                }
                console.log( 'Overall number of materials: ' + materialCount );
            }
            return materials;
        };
        this.wwObjFrontEnd.registerHookMaterialsLoaded( callbackMaterialsLoaded );

        var callbackMeshLoaded = function ( meshName, material ) {
            var replacedMaterial = null;
            var perObjectMaterial = scope.replaceObjectMaterials[ meshName ];
            var perObjectMaterialName = null;
            if ( perObjectMaterial !== undefined && perObjectMaterial !== null ) {
                perObjectMaterialName = perObjectMaterial[ 'name' ];
            }

            if ( perObjectMaterialName !== null && perObjectMaterialName !== undefined ) {
                replacedMaterial = scope.wwObjFrontEnd.getMaterial( perObjectMaterialName );
            }
            else {
                var replacedMaterialName = scope.replaceMaterials[ material.name ];
                if ( replacedMaterialName !== null && replacedMaterialName !== undefined ) {
                    replacedMaterial = scope.wwObjFrontEnd.getMaterial( replacedMaterialName );
                }
            }

            var meshInfo;
            if ( replacedMaterial !== null ) {
                meshInfo = new KSX.apps.tools.MeshInfo( meshName, replacedMaterial.name );
            }
            else {
                meshInfo = new KSX.apps.tools.MeshInfo( meshName, material.name );
            }

            scope.meshInfos.push( meshInfo );

            return replacedMaterial;
        };
        this.wwObjFrontEnd.registerHookMeshLoaded( callbackMeshLoaded );

        var callbackCompletedLoading = function () {
            if ( scope.exportMeshInfos ) {
                var exportString = '';

                if ( scope.meshInfos.length > 0 ) {
                    var meshInfo;
                    for ( var key in scope.meshInfos ) {
                        meshInfo = scope.meshInfos[ key ];
                        exportString += JSON.stringify( meshInfo );
                        exportString += '\n';
                    }

                    var blob = new Blob( [ exportString ], { type: 'text/plain;charset=utf-8' } );
                    saveAs( blob, 'meshInfos.json' );
                }
                else {
                    alert( 'Unable to export MeshInfo data as the datastructure is empty!' );
                }
            }
        };
        this.wwObjFrontEnd.registerHookCompletedLoading( callbackCompletedLoading );
    };

    PTV1Loader.prototype.initPostGL = function() {
        var scope = this;
        var ui = scope.uiTools.ui;

        var enableSkybox = function (enabled) {
            scope.skybox.visible = enabled;
        };
        ui.add('bool', {
            name: 'Enable Skybox',
            value: true,
            callback: enableSkybox,
            height: scope.uiTools.paramsDimension.boolHeight
        });
        var enableGround = function (enabled) {
            scope.ground.visible = enabled;
        };
        ui.add('bool', {
            name: 'Enable Ground',
            value: true,
            callback: enableGround,
            height: scope.uiTools.paramsDimension.boolHeight
        });


        var adjustOpacity = function (value) {
            var mesh;
            var dontAlter;
            var transparent = value < 1.0;
            var side = value < 1.0 ? THREE.DoubleSide : THREE.FrontSide;
            var maxOpacity = 1.0;
            var meshInfo;

            for ( var key in scope.meshInfos ) {
                meshInfo = scope.meshInfos[key];
                mesh = scope.scenePerspective.scene.getObjectByName(meshInfo.meshName);
                dontAlter = scope.dontAlterOpacity[meshInfo.meshName];

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
        ui.add('slide', {
            name: 'Opacity',
            callback: adjustOpacity,
            min: 0.0,
            max: 1.0,
            value: 1.0,
            precision: 2,
            step: 0.01,
            width: scope.uiTools.paramsDimension.slidesWidth,
            height: scope.uiTools.paramsDimension.slidesHeight,
            stype: scope.uiTools.paramsDimension.sliderType
        });

        var objAsArrayBuffer = null;
        var mtlAsString = null;

        var setObjAsArrayBuffer = function( data ) {
            objAsArrayBuffer = data;

            scope.wwObjFrontEnd.initWithData( objAsArrayBuffer, mtlAsString, scope.pathToObj );
            scope.wwObjFrontEnd.run();

        };
        var setMtlAsString = function( data ) {
            mtlAsString = data;
            scope.zipTools.unpackAsUint8Array( scope.fileObj, setObjAsArrayBuffer );
        };

        var doneUnzipping = function() {
            scope.zipTools.unpackAsString( scope.fileMtl, setMtlAsString );
        };
        var reportProgress = function( text ) {
            scope.uiTools.announceFeedback( text );
        };
        scope.zipTools.load( scope.fileZip, doneUnzipping, reportProgress );

        return true;
    };

    PTV1Loader.prototype.renderPre = function() {
        this.controls.update();
        this.renderer.clearDepth();
        this.renderer.clearColor();
    };

    PTV1Loader.prototype.renderPost = function() {
        this.uiTools.updateStats();
    };

    PTV1Loader.prototype.resizeDisplayGL = function() {
        this.controls.handleResize();
    };

    return PTV1Loader;
})();
