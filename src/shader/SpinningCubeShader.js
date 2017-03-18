/**
 * @author Kai Salmen / www.kaisalmen.de
 */

'use strict';

KSX.shader.SpinningCubeShader = (function () {

    function SpinningCubeShader() {
        KSX.shader.ShaderBase.call(this);

        this.uniforms['blendFactor'] = { type: 'f', value: 1.0 };
        this.uniforms['colorFactor'] = { type: 'fv1', value: [1.0, 1.0, 1.0] };
        this.uniforms['texture1'] = { type: 't', value: null };
    }

    SpinningCubeShader.prototype = Object.create(KSX.shader.ShaderBase.prototype, {
        constructor: {
            configurable: true,
            enumerable: true,
            value: SpinningCubeShader,
            writable: true
        }
    });

    SpinningCubeShader.prototype.loadResources = function (callbackOnSuccess) {
        var scope = this;

        var promises = [];
        promises.push( this.shaderTools.loadShader(this.baseDir + 'src/shader/passThrough.glsl', false, 'VS: Pass Through') );
        promises.push( this.shaderTools.loadShader(this.baseDir + 'src/shader/simpleTextureEffect.glsl', false, 'FS: Simple Texture') );
        promises.push( this.textureTools.loadTexture(this.baseDir + 'resource/textures/Wald.jpg') );

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

    return SpinningCubeShader;
})();
