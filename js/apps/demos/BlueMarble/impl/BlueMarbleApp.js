/**
 * Created by Kai Salmen.
 */

"use strict";


KSX.apps.demos.impl.BlueMarbleApp = class {

    constructor(elementToBindTo) {
        this.sceneApp = new KSX.apps.core.SceneAppPerspective(this, "BlueMarbleApp", elementToBindTo, true);

        this.textureTools = new KSX.apps.tools.TextureTools();

        this.uniforms = {
            blendFactor : { type : "f", value : 0.75 },
            colorFactor : { type : "fv1", value : [1.0, 1.0, 1.0] },
            textureMarble : { type : "t", value : null },
            textureSat : { type : "t", value : null }
        };
    }

    initAsyncContent () {
        this.sceneApp.initSynchronuous();

        var scope = this;

        var promises = new Set();
        promises.add(this.textureTools.loadTexture('./../resource/images/BlueMarble/bluemarble_rgba.png'));
        promises.add(this.textureTools.loadTexture('./../resource/images/BlueMarble/sat_rgba.png'));

        Promise.all( promises ).then(
            function (results) {
                scope.uniforms.textureMarble.value = results[0];
                scope.uniforms.textureSat.value = results[1];
                scope.sceneApp.initSynchronuous();
            }
        ).catch(
            function (error) {
                console.log('The following error occurred: ', error);
            }
        );
    }

    initGL () {
        var gl = this.sceneApp.renderer.getContext();

        var result = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
        if (result != 0) {
            console.log('Vertex shader is able to read texture (gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS= ' + result + ')');
        }
    }

    render () {
    }
}
