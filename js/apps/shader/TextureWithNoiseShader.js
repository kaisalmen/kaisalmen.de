/**
 * Created by Kai Salmen.
 */

'use strict';

KSX.apps.shader.TextureWithNoiseShader = (function () {

    function TextureWithNoiseShader() {
        KSX.apps.shader.ShaderBase.call(this);

        this.uniforms = {
            blendFactor : { type: 'f', value: 1.0 },
            colorFactor : { type: 'fv1', value: [1.0, 1.0, 1.0] },
            texture1: { type: 't', value: null }
        };
        this.vertexShader = null;
        this.fragmentShader = null;
    }

    TextureWithNoiseShader.prototype = Object.create(KSX.apps.shader.ShaderBase.prototype, {
        constructor: {
            configurable: true,
            enumerable: true,
            value: TextureWithNoiseShader,
            writable: true
        }
    });

    TextureWithNoiseShader.prototype.loadResources = function (callbackOnSuccess) {
        var scope = this;

        var promises = new Array(3);
        promises[0] = this.shaderTools.loadShader('../../js/apps/shader/passThrough.glsl', true, 'VS: Pass Through');
        promises[1] = this.shaderTools.loadShader('../../js/apps/shader/noiseTextureEffect.glsl', true, 'FS: Simple Texture');
        promises[2] = this.textureTools.loadTexture('../../resource/images/house02_pot.jpg');

        Promise.all( promises ).then(
            function (results) {
                scope.vertexShader = results[0];
                scope.fragmentShader = results[1];
                scope.uniforms.texture1.value = results[2];

                callbackOnSuccess();
            }
        ).catch(
            function (error) {
                console.log('The following error occurred: ', error);
            }
        );
    };

    return TextureWithNoiseShader;
})();
