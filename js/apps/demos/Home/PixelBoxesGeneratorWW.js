/**
 * @author Kai Salmen / www.kaisalmen.de
 */

'use strict';

var KSX = {
    apps: {
        demos: {
            home: {

            }
        }
    }
};
importScripts( 'BoxCreator.js' );

var buildSuperBox = function ( gridParams ) {

    var boxBuildParams = {
        count : 0,
        cubeDimension : gridParams.cubeEdgeLength,
        xOffset : gridParams.posStartX,
        yOffset : gridParams.posStartY,
        zOffset : 0.0,
        uVar : gridParams.uMin,
        vVar : gridParams.vMin,
        uvLocalMinU : gridParams.uMin,
        uvLocalMaxU : gridParams.uMin,
        uvLocalMinV : gridParams.vMin,
        uvLocalMaxV : gridParams.vMin,
        vertices : [],
        normals : [],
        uvs : [],
        useIndices : gridParams.useIndices,
        indices : []
    };

    var i = 0;
    var j = 0;
    var uDiff = (gridParams.uMax - gridParams.uMin);
    var vDiff = (gridParams.vMax - gridParams.vMin);
    while (i < gridParams.sizeX) {
        while (j < gridParams.sizeY) {
            boxBuildParams.uvLocalMinU = boxBuildParams.uVar;
            boxBuildParams.uvLocalMaxU = boxBuildParams.uVar;
            boxBuildParams.uvLocalMinV = boxBuildParams.vVar;
            boxBuildParams.uvLocalMaxV = boxBuildParams.vVar;
            KSX.apps.demos.home.buildBox( boxBuildParams, false );
            boxBuildParams.uVar += uDiff / gridParams.sizeY;
            boxBuildParams.xOffset += gridParams.cubeEdgeLength;
            boxBuildParams.count++;
            j++;
        }

        boxBuildParams.uVar = gridParams.uMin;
        boxBuildParams.vVar += vDiff / gridParams.sizeX;
        boxBuildParams.xOffset = gridParams.posStartX;
        boxBuildParams.yOffset += gridParams.cubeEdgeLength;
        j = 0;
        i++;
    }

    var verticesOut = new Float32Array(boxBuildParams.vertices);
    var uvsOut = new Float32Array(boxBuildParams.uvs);
    var indicesOut = new Float32Array(boxBuildParams.indices);

    if (boxBuildParams.useIndices) {
        self.postMessage({
            'cmd': 'objData',
            useIndices: true,
            translationX: gridParams.translationX,
            translationY: gridParams.translationY,
            translationZ: gridParams.translationZ,
            vertices: verticesOut,
            uvs: uvsOut,
            indices: indicesOut
        }, [verticesOut.buffer], [uvsOut.buffer], [indicesOut.buffer]);
    }
    else {
        self.postMessage({
            'cmd': 'objData',
            useIndices: false,
            translationX: gridParams.translationX,
            translationY: gridParams.translationY,
            translationZ: gridParams.translationZ,
            vertices: verticesOut,
            uvs: uvsOut
        }, [verticesOut.buffer], [uvsOut.buffer] );
    }
};

var createBoxes = function ( event ) {
    var payload = event.data;

    switch ( payload.cmd ) {
        case 'build':
            var gridParams = {
                sizeX: payload.sizeX,
                sizeY: payload.sizeY,
                uMin: payload.uMin,
                vMin: payload.vMin,
                uMax: payload.uMax,
                vMax: payload.vMax,
                cubeEdgeLength: payload.cubeEdgeLength,
                posStartX: payload.posStartX,
                posStartY: payload.posStartY,
                useIndices: payload.useIndices,
                translationX: payload.translationX,
                translationY: payload.translationY,
                translationZ: payload.translationZ
            };

            buildSuperBox( gridParams );

            break;
        default:
            console.error( "PixelBoxGeneratorWW: Received unknown command: " + payload.cmd );

            break;
    }
};


self.addEventListener( 'message', createBoxes, false );
