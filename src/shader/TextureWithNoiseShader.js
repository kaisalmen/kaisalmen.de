/**
 * @author Kai Salmen / www.kaisalmen.de
 */

'use strict';

KSX.shader.TextureWithNoiseShader = (function () {

    function TextureWithNoiseShader() {
        KSX.shader.ShaderBase.call(this);

        this.uniforms['blendFactor'] = { type: 'f', value: 1.0 };
        this.uniforms['colorFactor'] = { type: 'fv1', value: [1.0, 1.0, 1.0] };
        this.uniforms['texture1'] = { type: 't', value: null };
    }

    TextureWithNoiseShader.prototype = Object.create(KSX.shader.ShaderBase.prototype, {
        constructor: {
            configurable: true,
            enumerable: true,
            value: TextureWithNoiseShader,
            writable: true
        }
    });

    TextureWithNoiseShader.prototype.loadResources = function (callbackOnSuccess) {
        var scope = this;

        var promises = [];
        promises.push( this.shaderTools.loadShader(this.baseDir + 'src/shader/passThrough.glsl', true, 'VS: Pass Through') );
        promises.push( this.shaderTools.loadShader(this.baseDir + 'src/shader/noiseTextureEffect.glsl', true, 'FS: Simple Texture') );
        promises.push( this.textureTools.loadTexture(this.baseDir + 'resource/textures/Wald.jpg') );

        Promise.all( promises ).then(
            function (results) {
                scope.vertexShader = results[0];

                var shaders = Array(2);
                shaders['common'] = { name: 'common', value: THREE.ShaderChunk["common"] };
                shaders['textureNoise'] = { name: 'textureNoise', value: results[1] };
                scope.fragmentShader = scope.shaderTools.combineShader(shaders, false);
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
