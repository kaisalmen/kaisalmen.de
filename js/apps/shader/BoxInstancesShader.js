/**
 * @author Kai Salmen / www.kaisalmen.de
 */

'use strict';

KSX.apps.shader.BoxInstancesShader = (function () {

    function BoxInstancesShader() {
        KSX.apps.shader.ShaderBase.call(this);

        this.uniforms['blendFactor'] = { type: 'f', value: 1.0 };
        this.uniforms['colorFactor'] = { type: 'fv1', value: [1.0, 1.0, 1.0] };
        this.uniforms['texture1'] = { type: 't', value: null };
    }

    BoxInstancesShader.prototype = Object.create(KSX.apps.shader.ShaderBase.prototype, {
        constructor: {
            configurable: true,
            enumerable: true,
            value: BoxInstancesShader,
            writable: true
        }
    });

    BoxInstancesShader.prototype.loadResources = function (callbackOnSuccess) {
        var scope = this;

        var promises = new Array(3);
        promises[0] = this.shaderTools.loadShader(this.baseDir + 'js/apps/shader/instancePosition.glsl', true, 'VS: Pass Through');
        promises[1] = this.shaderTools.loadShader(this.baseDir + 'js/apps/shader/simpleTextureEffect.glsl', true, 'FS: Simple Texture');
        promises[2] = this.textureTools.loadTexture(this.baseDir + 'resource/images/house02_pot.jpg');

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

    return BoxInstancesShader;
})();