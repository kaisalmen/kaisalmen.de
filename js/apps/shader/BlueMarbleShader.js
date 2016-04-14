/**
 * Created by Kai Salmen.
 */

'use strict';

KSX.apps.shader.BlueMarbleShader = (function () {

    function BlueMarbleShader() {
        KSX.apps.shader.ShaderBase.call(this);

        this.uniforms = {
            blendFactor : { type : 'f', value : 1.0 },
            alphaColor : { type : 'fv1', value : [1.0, 1.0, 1.0] },
            lowerBoundary : { type: 'f', value: 50.0 / MAX_VALUE },
            upperBoundary : { type: 'f', value: 127.0 / MAX_VALUE },
            textureMarble : { type : 't', value : null },
            textureSat : { type : 't', value : null }
        };
        this.vertexShader = null;
        this.fragmentShader = null;
    }

    BlueMarbleShader.prototype = Object.create(KSX.apps.shader.ShaderBase.prototype, {
        constructor: {
            configurable: true,
            enumerable: true,
            value: BlueMarbleShader,
            writable: true
        }
    });

    BlueMarbleShader.prototype.loadResources = function (callbackOnSuccess) {
        var scope = this;

        var promises = new Array(4);
        promises[0] = this.textureTools.loadTexture('../../resource/images/BlueMarble/bluemarble_rgba.png');
        promises[1] = this.textureTools.loadTexture('../../resource/images/BlueMarble/sat_rgba.png');

        promises[2] = this.shaderTools.loadShader('../../js/apps/shader/passThrough.glsl', false, 'VS: Pass Through');
        promises[3] = this.shaderTools.loadShader('../../js/apps/shader/blueMarble.glsl', false, 'FS: BlueMarble');

        Promise.all(promises).then(
            function (results) {
                scope.uniforms.textureMarble.value = results[0];
                scope.uniforms.textureSat.value = results[1];
                scope.vertexShader = results[2];
                scope.fragmentShader = results[3];

                callbackOnSuccess();
            }
        ).catch(
            function (error) {
                console.log('The following error occurred: ', error);
            }
        );
    };

    return BlueMarbleShader;
})();
