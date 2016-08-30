/**
 * @author Kai Salmen / www.kaisalmen.de
 */

'use strict';

importScripts( '../../../lib/threejs/three.min.js' );
importScripts( '../../../lib/threejs/MTLLoader.js' );
importScripts( '../../../lib/threejs/OBJLoader2.js' );

var KSX = {
    apps: {
        learn: {
            ww: {
                static: {
                    runner: null,
                    impl: null,
                }
            }
        }
    }
};

KSX.apps.learn.ww.WWFeatureChecker = (function () {

    function WWFeatureChecker() {
        this.state = 'created';

        this.mtlLoader = new THREE.MTLLoader();
        this.objLoader = new THREE.OBJLoader()
    }

    WWFeatureChecker.prototype.sendObject = function ( object, allMaterials ) {
        var geometry = object.geometry;
        var objectMaterials = object.materials;
        var isLine = ( geometry.type === 'Line' );

        // Skip o/g line declarations that did not follow with any faces
        if ( geometry.vertices.length === 0 ) return null;


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
        var group;
        if (createdMaterials.length > 1) {
            for (var mi = 0, miLen = objectMaterials.length; mi < miLen; mi++) {
                var sourceMaterial = objectMaterials[mi];
                group = {
                    start: sourceMaterial.groupStart,
                    count: sourceMaterial.groupCount,
                    index: mi
                };
                // bufferGeometry.addGroup( group.start, group.count, group.index );

                materialGroups.push( group );
            }
        }

        self.postMessage({
            cmd: 'objData',
            meshName: object.name,
            material: JSON.stringify( materialJSON ),
            materialGroups: materialGroups,
            vertices: verticesOut,
            normals: normalsOut,
            uvs: uvsOut,
        }, [verticesOut.buffer], [normalsOut.buffer], [uvsOut.buffer]);

        return null;
    };

    WWFeatureChecker.prototype.init = function ( payload ) {
        this.state = 'init';

        var path = '../../../../resource/models/';
        this.mtlLoader.setPath( path );

        this.objLoader.setloadAsArrayBuffer( true );
        this.objLoader.setWorkInline( true ) ;
        this.objLoader.setPath( path );

        this.objLoader._buildSingleMesh = this.sendObject;
    };

    WWFeatureChecker.prototype.run = function ( payload ) {
        this.state = 'run';

        var onProgress = function ( xhr ) {
            if ( xhr.lengthComputable ) {
                var percentComplete = xhr.loaded / xhr.total * 100;
                console.log( Math.round(percentComplete, 2) + '% downloaded' );
            }
        };

        var onError = function ( xhr ) { };

        var scope = this;
        scope.mtlLoader.load( 'PTV1.mtl', function( materials ) {
            materials.preload();

            scope.objLoader.setMaterials( materials );
            scope.objLoader.load( 'PTV1.obj', function ( object ) {

                console.log( 'Loading complete: ' + object );
            }, onProgress, onError );
        });
    };

    return WWFeatureChecker;
})();


KSX.apps.learn.ww.static.runner = function ( event ) {
    var payload = event.data;

    console.log( 'State before: ' + KSX.apps.learn.ww.static.impl.state );

    switch ( payload.cmd ) {
        case 'init':
            KSX.apps.learn.ww.static.impl.init( payload );

            break;
        case 'run':
            KSX.apps.learn.ww.static.impl.run( payload );

            break;
        default:
            console.error( 'WWFeatureChecker: Received unknown command: ' + payload.cmd );

            break;
    }

    console.log( 'State after: ' + KSX.apps.learn.ww.static.impl.state );
};

KSX.apps.learn.ww.static.impl = new KSX.apps.learn.ww.WWFeatureChecker();

self.addEventListener( 'message', KSX.apps.learn.ww.static.runner, false );
