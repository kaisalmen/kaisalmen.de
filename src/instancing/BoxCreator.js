/**
 * @author Kai Salmen / www.kaisalmen.de
 */

'use strict';

if (KSX.instancing === undefined) KSX.instancing = {};

KSX.instancing.buildBox = function ( boxBuildParams ) {
    var vertexValue = 0.5;
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
};
