/**
 * @author Kai Salmen / www.kaisalmen.de
 */
/**
 * @author Kai Salmen / www.kaisalmen.de
 */

'use strict';

KSX.apps.tools.loaders.WWOBJLoaderFrontEnd = (function () {

    function WWOBJLoaderFrontEnd( basedir ) {
        this.worker = new Worker(basedir + "/js/apps/tools/loaders/WWOBJLoader.js");

        var scope = this;
        var scopeFunction = function (e) {
            scope.processData(e);
        };
        this.worker.addEventListener('message', scopeFunction, false);

        this.mtlLoader = new THREE.MTLLoader();
        this.mtlFile = null;
        this.texturePath = null;
        this.dataAvailable = false;
        this.mtlAsString = null;

        this.materials = [];
        this.defaultMaterial = new THREE.MeshPhongMaterial();
        this.defaultMaterial.name = "defaultMaterial";

        this.counter = 0;
        this.objGroup = null;

        this.debug = false;

        // callbacks
        this.callbackMaterialsLoaded = null;
        this.callbackProgress = null;
        this.callbackMeshLoaded = null;
        this.callbackCompletedLoading = null;
    }

    WWOBJLoaderFrontEnd.prototype.setObjGroup = function (objGroup) {
        this.objGroup = objGroup;
    };

    WWOBJLoaderFrontEnd.prototype.setDebug = function ( enabled ) {
        this.debug = enabled;
    };

    WWOBJLoaderFrontEnd.prototype.registerHookMaterialsLoaded = function (callback) {
        this.callbackMaterialsLoaded = callback;
    };

    WWOBJLoaderFrontEnd.prototype.registerProgressCallback = function (callbackProgress) {
        this.callbackProgress = callbackProgress;
    };

    WWOBJLoaderFrontEnd.prototype.registerHookMeshLoaded = function (callback) {
        this.callbackMeshLoaded = callback;
    };

    WWOBJLoaderFrontEnd.prototype.registerHookCompletedLoading = function (callback) {
        this.callbackCompletedLoading = callback;
    };

    WWOBJLoaderFrontEnd.prototype.addMaterial = function (name, material) {
        if (material.name !== name) {
            material.name = name;
        }
        this.materials[name] = material;
    };

    WWOBJLoaderFrontEnd.prototype.getMaterial = function (name) {
        var material = this.materials[name];
        if (material === undefined) {
            material = null;
        }
        return material;
    };

    WWOBJLoaderFrontEnd.prototype.announceProgress = function ( baseText, text ) {
        var output = "";
        if ( baseText !== null && baseText !== undefined ) {
            output = baseText;
        }

        if ( text !== null && text !== undefined ) {
            output = output + " " + text;
        }

        if ( this.callbackProgress !== null ) {
            this.callbackProgress( output );
        }
        if ( this.debug ) {
            console.log( output );
        }
    };

    WWOBJLoaderFrontEnd.prototype.initWithFiles = function ( basePath, objFile, mtlFile, texturePath ) {
        this.dataAvailable = false;

        this.worker.postMessage({
            cmd: 'init',
            debug: this.debug,
            dataAvailable: this.dataAvailable,
            basePath: basePath,
            objFile: objFile,
            objAsArrayBuffer: null
        });


        // configure MTLLoader
        this.mtlFile = mtlFile;
        this.texturePath = texturePath;
        this.mtlLoader.setPath( this.texturePath );

        console.time( 'WWOBJLoaderFrontEnd' );
    };

    WWOBJLoaderFrontEnd.prototype.initWithData = function ( texturePath, objAsArrayBuffer, mtlAsString ) {
        this.dataAvailable = true;

        this.worker.postMessage({
            cmd: 'init',
            debug: this.debug,
            dataAvailable: this.dataAvailable,
            basePath: null,
            objFile: null,
            objAsArrayBuffer: objAsArrayBuffer === undefined ? null : objAsArrayBuffer
        }, [objAsArrayBuffer.buffer] );

        this.mtlAsString = mtlAsString;

        console.time( 'WWOBJLoaderFrontEnd' );
    };

    WWOBJLoaderFrontEnd.prototype.run = function () {
        var scope = this;

        var processMaterials = function( materialsOrg ) {

            var matInfoOrg = materialsOrg.materialsInfo;
            // simple, not elegant, but sufficient way to clone the mtl input material objects
            var matInfoMod = JSON.parse( JSON.stringify( matInfoOrg ) );
            var materialsMod = new THREE.MTLLoader.MaterialCreator( materialsOrg.baseUrl, materialsOrg.options );

            var name;
            for ( name in matInfoMod ) {
                if ( matInfoMod.hasOwnProperty( name ) ) {
                    var mat = matInfoMod[name];

                    if ( mat.hasOwnProperty( 'map_kd' ) ) {
                        delete mat['map_kd'];
                    }
                    if ( mat.hasOwnProperty( 'map_ks' ) ) {
                        delete mat['map_ks'];
                    }
                    if ( mat.hasOwnProperty( 'map_bump' ) ) {
                        delete mat['map_bump'];
                    }
                    if ( mat.hasOwnProperty( 'bump' ) ) {
                        delete mat['bump'];
                    }
                }
            }
            materialsMod.setMaterials( matInfoMod );
            materialsMod.preload();

            // set 'castrated' materials in associated materials array
            matInfoMod = materialsMod.materials;
            for ( name in matInfoMod ) {
                if ( matInfoMod.hasOwnProperty( name ) ) {
                    scope.materials[ name ] = materialsMod.materials[ name ];
                }
            }

            // pass 'castrated' materials to web worker
            var matInfoModJSON = JSON.stringify( matInfoMod );
            scope.worker.postMessage({
                cmd: 'initMaterials',
                materials: matInfoModJSON,
                baseUrl: materialsMod.baseUrl,
                options: materialsMod.options
            });

            // process obj immediately
            scope.worker.postMessage({
                cmd: 'run',
            });


            // wrap texture loading in Promise
            var promises = [];
            var promise = function ( resolve ) {
                console.time( 'promise textures' );
                materialsOrg.preload();
                resolve( materialsOrg );
            };

            promises.push( new Promise(promise) );

            Promise.all( promises ).then(
                function ( results ) {
                    console.timeEnd( 'promise textures' );


                    var matWithTextures = results[0].materials;
                    var intermediate;
                    var updated;
                    for ( name in scope.materials ) {
                        intermediate = scope.materials[name];
                        updated = matWithTextures[name];

                        // update stored materials with texture mapping information (= fully restoration)
                        if ( updated !== undefined ) {
                            intermediate.setValues( updated );
                        }
                    }

                    if ( scope.callbackMaterialsLoaded !== null ) {
                        scope.materials = scope.callbackMaterialsLoaded( scope.materials );
                    }
                }
            ).catch(
                function (error) {
                    console.log('The following error occurred: ', error);
                }
            );
        };

        if ( this.dataAvailable ) {

            processMaterials( scope.mtlLoader.parse( scope.mtlAsString ) );

        }
        else {

            scope.mtlLoader.load( scope.mtlFile, processMaterials );

        }
    };

    WWOBJLoaderFrontEnd.prototype.processData = function ( event ) {
        var payload = event.data;
        var material;

        switch ( payload.cmd ) {
            case 'objData':

                this.counter++;
                var bufferGeometry = new THREE.BufferGeometry();

                bufferGeometry.addAttribute( "position", new THREE.BufferAttribute( new Float32Array( payload.vertices ), 3 ) );
                if ( payload.normals !== undefined ) {
                    bufferGeometry.addAttribute( "normal", new THREE.BufferAttribute( new Float32Array( payload.normals ), 3 ) );
                }
                else {
                    bufferGeometry.computeVertexNormals();
                }
                if (payload.uvs !== undefined) {
                    bufferGeometry.addAttribute( "uv", new THREE.BufferAttribute( new Float32Array( payload.uvs ), 2 ) );
                }

                if ( payload.multiMaterial ) {

                    var materialNames = JSON.parse( payload.materialName );
                    var multiMaterials = [];
                    for ( var name of materialNames ) {
                        multiMaterials.push( this.materials[name] );
                    }

                    material = new THREE.MultiMaterial( multiMaterials );
                }
                else {
                    material = this.materials[ payload.materialName ];
                }

                if ( material === null || material === undefined ) {
                    material = this.defaultMaterial;
                }

                if ( payload.materialGroups !== null ) {

                    var materialGroups = JSON.parse( payload.materialGroups );

                    for ( var group, i = 0, length = materialGroups.length; i < length; i ++ ) {
                        group = materialGroups[ i ];
                        bufferGeometry.addGroup( group.start, group.count, group.index );
                    }
                }

                if ( this.callbackMeshLoaded !== null ) {

                    var materialOverride = this.callbackMeshLoaded( payload.meshName, material );

                    if ( materialOverride !== null  && materialOverride !== undefined ) {
                        material = materialOverride;
                    }
                }

                var mesh = new THREE.Mesh( bufferGeometry, material );
                mesh.name = payload.meshName;

                this.objGroup.add( mesh );

                var output = "(" + this.counter + "): " + payload.meshName;
                this.announceProgress( "Adding mesh", output );

                break;
            case 'complete':
                console.timeEnd( 'WWOBJLoaderFrontEnd' );

                if ( this.callbackCompletedLoading !== null ) {
                    this.callbackCompletedLoading();
                }

                break;
            default:
                console.error( 'Received unknown command: ' + payload.cmd );

                break;
        }
    };

    return WWOBJLoaderFrontEnd;

})();
