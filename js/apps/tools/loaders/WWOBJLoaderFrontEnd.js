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

        this.counter = 0;
        this.scene = null;
    }

    WWOBJLoaderFrontEnd.prototype.setScene = function ( scene ) {
        this.scene = scene;
    };

    WWOBJLoaderFrontEnd.prototype.processData = function ( event ) {
        var payload = event.data;

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

                var materialJSON = JSON.parse( payload.material );
                var material = this.materialLoader.parse( materialJSON );
                var materialGroups = JSON.parse( payload.materialGroups );
/*
                 if ( materialGroups.length > 0 ) {
                 console.log( this.counter + ' materialGroups: ' + materialGroups );
                 }
*/
                for ( var group, i = 0, length = materialGroups.length; i < length; i++ ) {
                    group = materialGroups[i];
                    bufferGeometry.addGroup( group.start, group.count, group.index );
                }

                var mesh = new THREE.Mesh( bufferGeometry, material );
                mesh.name = payload.meshName;

                this.scene.add( mesh );

                break;
            case 'complete':
                console.timeEnd( 'WWOBJLoaderFrontEnd' );

                break;
            default:
                console.error( 'Received unknown command: ' + payload.cmd );
                break;
        }
    };

    WWOBJLoaderFrontEnd.prototype.postInit = function ( basePath, objFile, mtlFile, texturePath ) {
        this.worker.postMessage({
            cmd: 'init',
            basePath: basePath,
            objFile: objFile,
            mtlFile: mtlFile,
            texturePath: texturePath
        });

        console.time( 'WWOBJLoaderFrontEnd' );
    };

    WWOBJLoaderFrontEnd.prototype.postRun = function (  ) {
        this.worker.postMessage({
            cmd: 'run',
        });
    };

    return WWOBJLoaderFrontEnd;

})();
