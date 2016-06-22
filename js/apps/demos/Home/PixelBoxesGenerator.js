/**
 * @author Kai Salmen / www.kaisalmen.de
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

        this.count = 0;
        this.processList = [];
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
                mesh.translateX( payload.translationX );
                mesh.translateY( payload.translationY );
                mesh.translateZ( payload.translationZ );

                this.objGroup.add( mesh );
                this.count++;

                this.workOnProcessList();

                break;
            default:
                console.error('Received unknown command: ' + payload.cmd);
                break;
        }
    };


    PixelBoxesBuilder.prototype.buildSuperBoxSeries = function ( pixelU, pixelV, countU, countV, cubeEdgeLength ) {
        if ( countU % 2 !== 0 ) {
            console.error( 'countU cannot be divided by 2! Aborting...' );
            return;
        }
        if ( countV % 2 !== 0 ) {
            console.error( 'countV cannot be divided by 2! Aborting...' );
            return;
        }
        var uAdd = 1.0 / countU;
        var vAdd = 1.0 / countV;

         // initial parameters
         var gridParams = {
             sizeX : Math.round(pixelV / countV),
             sizeY : Math.round(pixelU / countU),
             uMin : 0.0,
             uMax : uAdd,
             vMin : 0.0,
             vMax : vAdd,
             cubeEdgeLength : cubeEdgeLength,
             posStartX : 0.0,
             posStartY : 0.0,
             useIndices : false
         };

        var translateXAdd = gridParams.sizeY * cubeEdgeLength;
        var translateYAdd = gridParams.sizeX * cubeEdgeLength;
        var translation = {
            x: 0.0,
            y: 0.0,
            z: 0.0
        };

        for ( var j = 0; j < countV; j++ ) {
            for ( var i = 0; i < countU; i++ ) {
                var localGridParams = copyObjectValues( gridParams );
                var localTranslation = copyObjectValues( translation );
                this.processList.push({
                    gridParams: localGridParams,
                    translation: localTranslation
                });

                gridParams.uMin += uAdd;
                gridParams.uMax += uAdd;
                translation.x += translateXAdd;
            }
            gridParams.uMin = 0.0;
            gridParams.uMax = uAdd;
            gridParams.vMin += vAdd;
            gridParams.vMax += vAdd;
            translation.x = 0.0;
            translation.y += translateYAdd;
        }

        console.log( 'Created process list with ' + this.processList.length + ' entries. Box size is: ' + gridParams.sizeX + 'x' + gridParams.sizeY);
        this.workOnProcessList();
    };

    var copyObjectValues = function ( params ) {
        var localParams = {};
        for ( var param in params ) {
            if ( params.hasOwnProperty( param )) {
                localParams[param] = params[param];
            }
        }

        return localParams;
    };

    PixelBoxesBuilder.prototype.workOnProcessList = function () {
        if ( this.count < this.processList.length ) {
            var processObj = this.processList[this.count];
            this.buildSuperBox( processObj.gridParams, processObj.translation );
        }
        else {
            var event = new Event( 'complete' );
            document.dispatchEvent( event );
        }
    };

    PixelBoxesBuilder.prototype.buildSuperBox = function ( gridParams, translation ) {
        if ( translation !== undefined ) {
            translation.x = translation.x === undefined ? 0.0 : translation.x;
            translation.y = translation.y === undefined ? 0.0 : translation.y;
            translation.z = translation.z === undefined ? 0.0 : translation.z;
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
            "useIndices": gridParams.useIndices,
            "translationX": translation.x,
            "translationY": translation.y,
            "translationZ": translation.z
        });
    };

    PixelBoxesBuilder.prototype.buildSingleBox = function ( boxBuildParams ) {
        var vertexValue = boxBuildParams.cubeDimension / 2.0;
        var v0x = -vertexValue + boxBuildParams.xOffset;
        var v0y = -vertexValue + boxBuildParams.yOffset;
        var v0z =  vertexValue + boxBuildParams.zOffset;
        var v1x =  vertexValue + boxBuildParams.xOffset;
        var v1y = -vertexValue + boxBuildParams.yOffset;
        var v1z =  vertexValue + boxBuildParams.zOffset;
        var v2x =  vertexValue + boxBuildParams.xOffset;
        var v2y =  vertexValue + boxBuildParams.yOffset;
        var v2z =  vertexValue + boxBuildParams.zOffset;
        var v3x = -vertexValue + boxBuildParams.xOffset;
        var v3y =  vertexValue + boxBuildParams.yOffset;
        var v3z =  vertexValue + boxBuildParams.zOffset;
        var v4x =  vertexValue + boxBuildParams.xOffset;
        var v4y = -vertexValue + boxBuildParams.yOffset;
        var v4z = -vertexValue + boxBuildParams.zOffset;
        var v5x = -vertexValue + boxBuildParams.xOffset;
        var v5y = -vertexValue + boxBuildParams.yOffset;
        var v5z = -vertexValue + boxBuildParams.zOffset;
        var v6x = -vertexValue + boxBuildParams.xOffset;
        var v6y =  vertexValue + boxBuildParams.yOffset;
        var v6z = -vertexValue + boxBuildParams.zOffset;
        var v7x =  vertexValue + boxBuildParams.xOffset;
        var v7y =  vertexValue + boxBuildParams.yOffset;
        var v7z = -vertexValue + boxBuildParams.zOffset;

        if (boxBuildParams.useIndices) {
            boxBuildParams.vertices.push(
                v0x, v0y, v0z,
                v1x, v1y, v1z,
                v2x, v2y, v2z,
                v3x, v3y, v3z,
                v4x, v4y, v4z,
                v5x, v5y, v5z,
                v6x, v6y, v6z,
                v7x, v7y, v7z
            );

            boxBuildParams.normals.push();

            boxBuildParams.uvs.push(
                boxBuildParams.uvLocalMinU, boxBuildParams.uvLocalMinV,
                boxBuildParams.uvLocalMaxU, boxBuildParams.uvLocalMinV,
                boxBuildParams.uvLocalMaxU, boxBuildParams.uvLocalMaxV,
                boxBuildParams.uvLocalMinU, boxBuildParams.uvLocalMaxV,
                boxBuildParams.uvLocalMaxU, boxBuildParams.uvLocalMinV,
                boxBuildParams.uvLocalMinU, boxBuildParams.uvLocalMinV,
                boxBuildParams.uvLocalMinU, boxBuildParams.uvLocalMaxV,
                boxBuildParams.uvLocalMaxU, boxBuildParams.uvLocalMaxV
            );

            var i0 = 8 * boxBuildParams.count;
            var i1 = 1 + 8 * boxBuildParams.count;
            var i2 = 2 + 8 * boxBuildParams.count;
            var i3 = 3 + 8 * boxBuildParams.count;
            var i4 = 4 + 8 * boxBuildParams.count;
            var i5 = 5 + 8 * boxBuildParams.count;
            var i6 = 6 + 8 * boxBuildParams.count;
            var i7 = 7 + 8 * boxBuildParams.count;
            boxBuildParams.indices.push(
                // front
                i0, i1, i2,
                i0, i2, i3,

                // back
                i4, i5, i6,
                i4, i6, i7,

                // left
                i5, i0, i3,
                i5, i3, i6,

                // right
                i1, i4, i7,
                i1, i7, i2,

                // top
                i3, i2, i7,
                i3, i7, i6,

                // bottom
                i0, i4, i1,
                i0, i5, i4
            );
        }
        else {
            boxBuildParams.vertices.push(
                v0x, v0y, v0z,
                v1x, v1y, v1z,
                v2x, v2y, v2z,
                v0x, v0y, v0z,
                v2x, v2y, v2z,
                v3x, v3y, v3z,

                v4x, v4y, v4z,
                v5x, v5y, v5z,
                v6x, v6y, v6z,
                v4x, v4y, v4z,
                v6x, v6y, v6z,
                v7x, v7y, v7z,

                v5x, v5y, v5z,
                v0x, v0y, v0z,
                v3x, v3y, v3z,
                v5x, v5y, v5z,
                v3x, v3y, v3z,
                v6x, v6y, v6z,

                v1x, v1y, v1z,
                v4x, v4y, v4z,
                v7x, v7y, v7z,
                v1x, v1y, v1z,
                v7x, v7y, v7z,
                v2x, v2y, v2z,

                v3x, v3y, v3z,
                v2x, v2y, v2z,
                v7x, v7y, v7z,
                v3x, v3y, v3z,
                v7x, v7y, v7z,
                v6x, v6y, v6z,

                v0x, v0y, v0z,
                v4x, v4y, v4z,
                v1x, v1y, v1z,
                v0x, v0y, v0z,
                v5x, v5y, v5z,
                v4x, v4y, v4z
            );

            boxBuildParams.uvs.push(
                boxBuildParams.uvLocalMinU, boxBuildParams.uvLocalMinV,
                boxBuildParams.uvLocalMaxU, boxBuildParams.uvLocalMinV,
                boxBuildParams.uvLocalMaxU, boxBuildParams.uvLocalMaxV,
                boxBuildParams.uvLocalMinU, boxBuildParams.uvLocalMinV,
                boxBuildParams.uvLocalMaxU, boxBuildParams.uvLocalMaxV,
                boxBuildParams.uvLocalMinU, boxBuildParams.uvLocalMaxV,
                boxBuildParams.uvLocalMaxU, boxBuildParams.uvLocalMinV,
                boxBuildParams.uvLocalMinU, boxBuildParams.uvLocalMinV,
                boxBuildParams.uvLocalMinU, boxBuildParams.uvLocalMaxV,
                boxBuildParams.uvLocalMaxU, boxBuildParams.uvLocalMinV,
                boxBuildParams.uvLocalMinU, boxBuildParams.uvLocalMaxV,
                boxBuildParams.uvLocalMaxU, boxBuildParams.uvLocalMaxV,
                boxBuildParams.uvLocalMinU, boxBuildParams.uvLocalMinV,
                boxBuildParams.uvLocalMinU, boxBuildParams.uvLocalMinV,
                boxBuildParams.uvLocalMinU, boxBuildParams.uvLocalMaxV,
                boxBuildParams.uvLocalMinU, boxBuildParams.uvLocalMinV,
                boxBuildParams.uvLocalMinU, boxBuildParams.uvLocalMaxV,
                boxBuildParams.uvLocalMinU, boxBuildParams.uvLocalMaxV,
                boxBuildParams.uvLocalMaxU, boxBuildParams.uvLocalMinV,
                boxBuildParams.uvLocalMaxU, boxBuildParams.uvLocalMinV,
                boxBuildParams.uvLocalMaxU, boxBuildParams.uvLocalMaxV,
                boxBuildParams.uvLocalMaxU, boxBuildParams.uvLocalMinV,
                boxBuildParams.uvLocalMaxU, boxBuildParams.uvLocalMaxV,
                boxBuildParams.uvLocalMaxU, boxBuildParams.uvLocalMaxV,
                boxBuildParams.uvLocalMinU, boxBuildParams.uvLocalMaxV,
                boxBuildParams.uvLocalMaxU, boxBuildParams.uvLocalMaxV,
                boxBuildParams.uvLocalMaxU, boxBuildParams.uvLocalMaxV,
                boxBuildParams.uvLocalMinU, boxBuildParams.uvLocalMaxV,
                boxBuildParams.uvLocalMaxU, boxBuildParams.uvLocalMaxV,
                boxBuildParams.uvLocalMinU, boxBuildParams.uvLocalMaxV,
                boxBuildParams.uvLocalMinU, boxBuildParams.uvLocalMinV,
                boxBuildParams.uvLocalMaxU, boxBuildParams.uvLocalMinV,
                boxBuildParams.uvLocalMaxU, boxBuildParams.uvLocalMinV,
                boxBuildParams.uvLocalMinU, boxBuildParams.uvLocalMinV,
                boxBuildParams.uvLocalMinU, boxBuildParams.uvLocalMinV,
                boxBuildParams.uvLocalMaxU, boxBuildParams.uvLocalMinV
            );
        }

        var bufferGeometry = new THREE.BufferGeometry();
        bufferGeometry.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array(boxBuildParams.vertices), 3 ) );
        bufferGeometry.addAttribute( 'uv', new THREE.BufferAttribute( new Float32Array(boxBuildParams.uvs), 2 ) );
        if (boxBuildParams.useIndices) {
            bufferGeometry.setIndex(new THREE.BufferAttribute(new Uint32Array(boxBuildParams.indices), 1));
        }

        return bufferGeometry;
    };

    return PixelBoxesBuilder;

})();
