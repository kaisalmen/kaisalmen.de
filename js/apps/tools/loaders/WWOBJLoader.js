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

KSX.apps.tools.loaders.wwobj.WWOBJLoader = (function ( wwScope ) {

    function WWOBJLoader() {
        this.state = 'created';

        this.mtlLoader = new THREE.MTLLoader();
        this.objLoader = new THREE.OBJLoader();

        this.basePath = '';
        this.objFile = '';
        this.mtlFile = '';
        this.texturePath = '';
    }

    WWOBJLoader.prototype.sendObject = function ( object, allMaterials ) {
        // Fast-Fail: Skip o/g line declarations that did not follow with any faces
        if ( object.geometry.vertices.length === 0 ) return null;

        var geometry = object.geometry;
        var objectMaterials = object.materials;
        var isLine = ( geometry.type === 'Line' );


        // Create materials
        var createdMaterials = [];
        for ( var mi = 0, miLen = objectMaterials.length; mi < miLen ; mi++ ) {

            var sourceMaterial = objectMaterials[mi];
            var material = undefined;

            if ( allMaterials !== null ) {

                material = allMaterials.create( sourceMaterial.name );

                // mtl etc. loaders probably can't create line materials correctly, copy properties to a line material.
                if ( isLine && material && ! ( material instanceof THREE.LineBasicMaterial ) ) {

                    var materialLine = new THREE.LineBasicMaterial();
                    materialLine.copy( material );
                    material = materialLine;
                }
            }

            if ( ! material ) {
                material = ( ! isLine ? new THREE.MeshPhongMaterial() : new THREE.LineBasicMaterial() );
                material.name = sourceMaterial.name;
            }
            material.shading = sourceMaterial.smooth ? THREE.SmoothShading : THREE.FlatShading;

            createdMaterials.push( material );
        }


        var targetMaterial;
        if ( createdMaterials.length > 1 ) {
            targetMaterial = new THREE.MultiMaterial( createdMaterials );
        }
        else {
            targetMaterial = createdMaterials[ 0 ];
        }

        var verticesOut = new Float32Array( geometry.vertices );
        var normalsOut = null;
        if ( geometry.normals.length > 0 ) {
            normalsOut = new Float32Array( geometry.normals );
        }
        var uvsOut = new Float32Array( geometry.uvs );


        var materialJSON = targetMaterial.toJSON();
        var materialGroups = [];
        if (createdMaterials.length > 1) {
            for ( var i = 0, sourceMaterial, group, length = objectMaterials.length; i < length; i++ ) {
                sourceMaterial = objectMaterials[i];
                group = {
                    start: sourceMaterial.groupStart,
                    count: sourceMaterial.groupCount,
                    index: i
                };
                materialGroups.push( group );
            }
        }

        this.counter++;
//        console.log( 'Count: ' + this.counter + ' name: ' + object.name );

        self.postMessage({
            cmd: 'objData',
            meshName: object.name,
            material: JSON.stringify( materialJSON ),
            materialGroups: JSON.stringify( materialGroups ),
            vertices: verticesOut,
            normals: normalsOut,
            uvs: uvsOut,
        }, [verticesOut.buffer], [normalsOut.buffer], [uvsOut.buffer]);

        return null;
    };


    WWOBJLoader.prototype.init = function ( payload ) {
        this.state = 'init';

        this.basePath = payload.basePath;
        this.texturePath = payload.texturePath;
        this.objFile = payload.objFile;
        this.mtlFile = payload.mtlFile;

        this.mtlLoader.setPath( this.texturePath );

        this.objLoader.setLoadAsArrayBuffer( true );
        this.objLoader.setWorkInline( true ) ;
        this.objLoader.setPath( this.basePath );

        // alter OBJLoader
        if ( typeof this.objLoader._buildSingleMesh === 'function' ) {
            this.objLoader._buildSingleMesh = this.sendObject;
        }
        if ( this.objLoader.counter === undefined ) {
            this.objLoader.counter = 0;
        }
    };

    WWOBJLoader.prototype.run = function ( payload ) {
        var scope = this;
        scope.state = 'run';

        var onProgress = function ( xhr ) {
            if ( xhr.lengthComputable ) {
                var percentComplete = xhr.loaded / xhr.total * 100;
                console.log( Math.round(percentComplete, 2) + '% downloaded' );
            }
        };

        var onError = function ( xhr ) { };


        scope.mtlLoader.load( scope.mtlFile, function( materials ) {
            materials.preload();

            scope.objLoader.setMaterials( materials );
            scope.objLoader.load( scope.objFile, function () {

                console.log( 'Loading complete!' );

                self.postMessage({
                    cmd: 'complete'
                });
            }, onProgress, onError );
        });
    };

    return WWOBJLoader;
})();

KSX.apps.tools.loaders.wwobj.static.implRef = new KSX.apps.tools.loaders.wwobj.WWOBJLoader( this );

KSX.apps.tools.loaders.wwobj.static.runner = function ( event ) {
    var payload = event.data;

    console.log( 'State before: ' + KSX.apps.tools.loaders.wwobj.static.implRef.state );

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

    console.log( 'State after: ' + KSX.apps.tools.loaders.wwobj.static.implRef.state );
};

self.addEventListener( 'message', KSX.apps.tools.loaders.wwobj.static.runner, false );
