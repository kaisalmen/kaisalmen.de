/**
 * @author Kai Salmen / www.kaisalmen.de
 */

'use strict';

KSX.apps.shader.SimpleTextureShader = (function () {

    function SimpleTextureShader() {
        KSX.apps.shader.ShaderBase.call(this);

        this.uniforms['blendFactor'] = { type: 'f', value: 1.0 };
        this.uniforms['colorFactor'] = { type: 'fv1', value: [1.0, 1.0, 1.0] };
        this.uniforms['texture1'] = { type: 't', value: null };
    }

    SimpleTextureShader.prototype = Object.create(KSX.apps.shader.ShaderBase.prototype, {
        constructor: {
            configurable: true,
            enumerable: true,
            value: SimpleTextureShader,
            writable: true
        }
    });

    SimpleTextureShader.prototype.loadResources = function (callbackOnSuccess) {
        var scope = this;

        var promises = [];
        promises.push( this.shaderTools.loadShader(this.baseDir + 'js/apps/shader/passThrough.glsl', true, 'VS: Pass Through') );
        promises.push( this.shaderTools.loadShader(this.baseDir + 'js/apps/shader/simpleTextureEffect.glsl', true, 'FS: Simple Texture') );
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

    return SimpleTextureShader;
})();
