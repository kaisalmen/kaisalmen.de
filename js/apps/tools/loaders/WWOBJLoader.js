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

        this.mtlLoader = new THREE.MTLLoader();

        this.basePath = '';
        this.objFile = '';
        this.mtlFile = '';
        this.texturePath = '';
        this.dataAvailable = false;
        this.objAsArrayBuffer = null;
        this.mtlAsString = null;

        this.setLoadAsArrayBuffer( true );
        this.setWorkInline( true );

        this.counter = 0;
    }

    WWOBJLoader.prototype.buildSingleMesh = function ( object, material ) {
        // Fast-Fail: Skip o/g line declarations that did not follow with any faces
        if ( object.geometry.vertices.length === 0 ) return null;

        var geometry = object.geometry;
        var objectMaterials = object.materials;

        var verticesOut = new Float32Array( geometry.vertices );
        var normalsOut = null;
        if ( geometry.normals.length > 0 ) {
            normalsOut = new Float32Array( geometry.normals );
        }
        var uvsOut = new Float32Array( geometry.uvs );


        var materialGroups = [];
        var multiMaterial = false;
        var materialNames =  [];
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
            // TODO: Gather all names
            materialNames.push( 'test' );
            multiMaterial = true;
        }

        this.counter++;
//        console.log( 'Count: ' + this.counter + ' name: ' + object.name );

        self.postMessage({
            cmd: 'objData',
            meshName: object.name,
            multiMaterial: multiMaterial,
            materialName: multiMaterial ? materialNames : material.name,
            materialGroups: multiMaterial ? JSON.stringify( materialGroups ) : null,
            vertices: verticesOut,
            normals: normalsOut,
            uvs: uvsOut,
        }, [verticesOut.buffer], [normalsOut.buffer], [uvsOut.buffer]);

        return null;
    };


    WWOBJLoader.prototype.init = function ( payload ) {
        this.cmdState = 'init';

        this.basePath = payload.basePath;
        this.texturePath = payload.texturePath;
        this.objFile = payload.objFile;
        this.mtlFile = payload.mtlFile;
        this.dataAvailable = payload.dataAvailable;

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
            this.mtlAsString = payload.mtlAsString;

        }

        // configure MTLLoader
        this.mtlLoader.setPath( this.texturePath );
    };

    WWOBJLoader.prototype.run = function ( payload ) {
        var scope = this;
        scope.cmdState = 'run';

        var materialsLoaded = function ( materials ) {
            materials.preload();
            scope.setMaterials( materials );

            self.postMessage({
                cmd: 'materials',
                materials: JSON.stringify( materials.materials ),
            });
        };

        if ( scope.dataAvailable ) {

            var materials = scope.mtlLoader.parse( scope.mtlAsString );

            materialsLoaded( materials );

            scope.parse( scope.objAsArrayBuffer );
        }
        else {

            scope.mtlLoader.load( scope.mtlFile, function( materials ) {

                materials.preload();
                scope.setMaterials( materials );

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

                scope.load( scope.objFile, onLoad, onProgress, onError );
            });
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
        case 'run':
            KSX.apps.tools.loaders.wwobj.static.implRef.run( payload );

            break;
        default:
            console.error( 'WWOBJLoader: Received unknown command: ' + payload.cmd );

            break;
    }

    console.log( 'Command state after: ' + KSX.apps.tools.loaders.wwobj.static.implRef.cmdState );
};

self.addEventListener( 'message', KSX.apps.tools.loaders.wwobj.static.runner, false );
