/**
 * Created by Kai Salmen.
 */

'use strict';

if (KSX.apps.demos.home === undefined) {
    KSX.apps.demos.home = {};
}

KSX.apps.demos.home.PixelBoxesBuilder = (function () {

    function PixelBoxesBuilder( basedir, material, objGroup ) {
        this.basedir = basedir;
        this.material = material;
        this.objGroup = objGroup;

        this.worker = new Worker( basedir + "/js/apps/demos/Home/PixelBoxesGeneratorWW.js" );

        var scope = this;
        var scopeFunction = function (e) {
            scope.processObjData(e);
        };
        this.worker.addEventListener( 'message', scopeFunction, false );

        this.translation = {
            x: 0,
            y: 0,
            z: 0
        };

        this.count = 0;
        this.complete = false;
    }

    PixelBoxesBuilder.prototype.processObjData = function ( event ) {
        var payload = event.data;

        switch ( payload.cmd ) {
            case "objData":
                var geometry = new THREE.BufferGeometry();
                geometry.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array( payload.vertices ), 3 ));
                geometry.addAttribute( 'uv', new THREE.BufferAttribute( new Float32Array( payload.uvs ), 2 ));
                if ( payload.useIndices ) {
                    geometry.setIndex( new THREE.BufferAttribute( new Uint32Array( payload.indices ), 1 ));
                }
                var mesh = new THREE.Mesh( geometry, this.material );
                mesh.translateX( this.translation.x );
                mesh.translateY( this.translation.y );
                mesh.translateZ( this.translation.z );

                this.objGroup.add( mesh );
                this.count++;

                var event;
                if ( this.complete ) {
                    event = new Event( 'complete' );
                }
                else {
                    event = new Event( 'intermediate' );
                    event.count = this.count;
                }
                document.dispatchEvent( event );
                break;
            default:
                console.error('Received unknown command: ' + payload.cmd);
                break;
        }
    };


    PixelBoxesBuilder.prototype.buildSuperBox = function ( gridParams, translation ) {
        if ( translation !== undefined ) {
            this.translation = {
                x: translation.x === undefined ? 0 : translation.x,
                y: translation.y === undefined ? 0 : translation.y,
                z: translation.z === undefined ? 0 : translation.z
            }
        }

        this.worker.postMessage({
            "cmd": "build",
            "sizeX": gridParams.sizeX,
            "sizeY": gridParams.sizeY,
            "uMin": gridParams.uMin,
            "vMin": gridParams.vMin,
            "uMax": gridParams.uMax,
            "vMax": gridParams.vMax,
            "cubeEdgeLength": gridParams.cubeEdgeLength,
            "posStartX": gridParams.posStartX,
            "posStartY": gridParams.posStartY,
            "useIndices": gridParams.useIndices
        });
    };

    PixelBoxesBuilder.prototype.setComplete = function () {
        this.complete = true;
    };

    return PixelBoxesBuilder;

})();
