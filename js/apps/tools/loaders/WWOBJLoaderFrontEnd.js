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

        this.materialLoader = new THREE.MaterialLoader();
        this.materials = [];

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

    WWOBJLoaderFrontEnd.prototype.processData = function ( event ) {
        var payload = event.data;
        var material;

        switch ( payload.cmd ) {
            case 'materials':

                var materialsJSON = JSON.parse( payload.materials );
                for ( var name in materialsJSON ) {
                    material = this.materialLoader.parse( materialsJSON[name] );
                    this.materials[name] = material;
                }

                if ( this.callbackMaterialsLoaded !== null ) {
                    this.materials = this.callbackMaterialsLoaded( this.materials );
                }

                break;
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

                if ( payload.materialGroups !== null ) {

                    var materialGroups = JSON.parse( payload.materialGroups );
                    /*
                     if ( materialGroups.length > 0 ) {
                     console.log( this.counter + ' materialGroups: ' + materialGroups );
                     }
                     */
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

    WWOBJLoaderFrontEnd.prototype.postInitWithFiles = function ( basePath, objFile, mtlFile, texturePath ) {
        this.worker.postMessage({
            cmd: 'init',
            dataAvailable: false,
            basePath: basePath,
            objFile: objFile,
            mtlFile: mtlFile,
            texturePath: texturePath,
            mtlAsString: null,
            objAsArrayBuffer: null
        });

        console.time( 'WWOBJLoaderFrontEnd' );
    };

    WWOBJLoaderFrontEnd.prototype.postInitWithData = function ( texturePath, objAsArrayBuffer, mtlAsString ) {
        this.worker.postMessage({
            cmd: 'init',
            dataAvailable: true,
            basePath: null,
            objFile: null,
            mtlFile: null,
            texturePath: texturePath,
            mtlAsString: mtlAsString === undefined ? null : mtlAsString,
            objAsArrayBuffer: objAsArrayBuffer === undefined ? null : objAsArrayBuffer
        }, [objAsArrayBuffer.buffer] );

        console.time( 'WWOBJLoaderFrontEnd' );
    };

    WWOBJLoaderFrontEnd.prototype.postRun = function (  ) {
        this.worker.postMessage({
            cmd: 'run',
        });
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

    return WWOBJLoaderFrontEnd;

})();
