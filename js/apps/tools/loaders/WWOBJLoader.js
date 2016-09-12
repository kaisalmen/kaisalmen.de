/**
 * @author Kai Salmen / www.kaisalmen.de
 */

'use strict';

importScripts( '../../../lib/threejs/three.min.js' );
importScripts( '../../../lib/threejs/MTLLoader.js' );
importScripts( '../../../lib/threejs/OBJLoader.js' );

var KSX = {
    apps: {
        tools: {
            loaders: {
                wwobj: {
                    static: {
                        runner: null,
                        implRef: null
                    }
                }
            }
        }
    }
};

KSX.apps.tools.loaders.wwobj.WWOBJLoader = (function () {

    WWOBJLoader.prototype = Object.create( THREE.OBJLoader.prototype, {
        constructor: {
            configurable: true,
            enumerable: true,
            value: WWOBJLoader,
            writable: true
        }
    });

    function WWOBJLoader() {
        THREE.OBJLoader.call( this );
        this.cmdState = 'created';
        this.debug = false;

        this.basePath = '';
        this.objFile = '';
        this.dataAvailable = false;
        this.objAsArrayBuffer = null;

        this.setLoadAsArrayBuffer( true );
        this.setWorkInline( true );

        this.counter = 0;
    }

    WWOBJLoader.prototype.buildSingleMesh = function ( object, material ) {
        // Fast-Fail: Skip o/g line declarations that did not follow with any faces
        if ( object.geometry.vertices.length === 0 ) return null;

        this.counter++;

        var geometry = object.geometry;
        var objectMaterials = object.materials;

        var verticesOut = new Float32Array( geometry.vertices );
        var normalsOut = null;
        if ( geometry.normals.length > 0 ) {
            normalsOut = new Float32Array( geometry.normals );
        }
        var uvsOut = new Float32Array( geometry.uvs );


        var materialGroups = [];
        var materialNames =  [];
        var multiMaterial = false;
        if ( material instanceof  THREE.MultiMaterial ) {
            for ( var objectMaterial, group, i = 0, length = objectMaterials.length; i < length; i++ ) {
                objectMaterial = objectMaterials[i];
                group = {
                    start: objectMaterial.groupStart,
                    count: objectMaterial.groupCount,
                    index: i
                };
                materialGroups.push( group );
            }

            for ( var multiMaterial of material.materials ) {
                materialNames.push( multiMaterial.name );
            }
            multiMaterial = true;
        }


        self.postMessage({
            cmd: 'objData',
            meshName: object.name,
            multiMaterial: multiMaterial,
            materialName: multiMaterial ? JSON.stringify( materialNames ) : material.name,
            materialGroups: multiMaterial ? JSON.stringify( materialGroups ) : null,
            vertices: verticesOut,
            normals: normalsOut,
            uvs: uvsOut,
        }, [verticesOut.buffer], [normalsOut.buffer], [uvsOut.buffer]);

        return null;
    };


    WWOBJLoader.prototype.init = function ( payload ) {
        this.cmdState = 'init';

        this.debug = payload.debug;
        this.dataAvailable = payload.dataAvailable;
        this.basePath = payload.basePath === null ? '' : payload.basePath;
        this.objFile = payload.objFile === null ? '' : payload.objFile;

        // configure OBJLoader
        if ( payload.loadAsArrayBuffer !== undefined ) {

            this.setLoadAsArrayBuffer( payload.loadAsArrayBuffer );

        }
        if ( payload.workInline !== undefined ) {

            this.setWorkInline( payload.workInline ) ;

        }
        this.setPath( this.basePath );

        if ( this.dataAvailable ) {

            // this must be the case, otherwise loading will fail
            this.setLoadAsArrayBuffer( true );
            this.objAsArrayBuffer = payload.objAsArrayBuffer;
        }

    };

    WWOBJLoader.prototype.initMaterials = function ( payload ) {
        this.cmdState = 'initMaterials';

        var materialsJSON = JSON.parse( payload.materials );
        var materialCreator = new THREE.MTLLoader.MaterialCreator( payload.baseUrl, payload.options );
        materialCreator.setMaterials( materialsJSON );
        materialCreator.preload();

        this.setMaterials( materialCreator );
    };

    WWOBJLoader.prototype.run = function () {
        this.cmdState = 'run';

        if ( this.dataAvailable ) {

            this.parse( this.objAsArrayBuffer );

        }
        else {

            var scope = this;
            var onLoad = function () {
                console.log( 'Loading complete!' );

                self.postMessage({
                    cmd: 'complete'
                });

                scope.dispose();
            };

            var onProgress = function ( xhr ) {
                if ( xhr.lengthComputable ) {
                    var percentComplete = xhr.loaded / xhr.total * 100;
                    console.log( Math.round(percentComplete, 2) + '% downloaded' );
                }
            };

            var onError = function ( xhr ) {
                console.error( xhr );
            };

            this.load( this.objFile, onLoad, onProgress, onError );

        }
    };

    return WWOBJLoader;
})();

KSX.apps.tools.loaders.wwobj.static.implRef = new KSX.apps.tools.loaders.wwobj.WWOBJLoader( this );

KSX.apps.tools.loaders.wwobj.static.runner = function ( event ) {
    var payload = event.data;

    console.log( 'Command state before: ' + KSX.apps.tools.loaders.wwobj.static.implRef.cmdState );

    switch ( payload.cmd ) {
        case 'init':
            KSX.apps.tools.loaders.wwobj.static.implRef.init( payload );

            break;
        case 'initMaterials':
            KSX.apps.tools.loaders.wwobj.static.implRef.initMaterials( payload );

            break;
        case 'run':
            KSX.apps.tools.loaders.wwobj.static.implRef.run();

            break;
        default:
            console.error( 'WWOBJLoader: Received unknown command: ' + payload.cmd );

            break;
    }

    console.log( 'Command state after: ' + KSX.apps.tools.loaders.wwobj.static.implRef.cmdState );
};

self.addEventListener( 'message', KSX.apps.tools.loaders.wwobj.static.runner, false );
