/**
 * Created by Kai Salmen.
 */

'use strict';

KSX.apps.shader.BlockShader = (function () {

    function BlockShader() {
        KSX.apps.shader.ShaderBase.call(this);

        this.uniforms['texture1'] = { type: 't', value: null };
    }

    BlockShader.prototype = Object.create(KSX.apps.shader.ShaderBase.prototype, {
        constructor: {
            configurable: true,
            enumerable: true,
            value: BlockShader,
            writable: true
        }
    });

    BlockShader.prototype.loadResources = function (callbackOnSuccess) {
        var scope = this;

        var promises = new Array(2);
        promises[0] = this.shaderTools.loadShader(this.baseDir + 'js/apps/shader/deformGeometryFromTexture.glsl', false, 'VS: Deform Geometry according Texture');
        promises[1] = this.shaderTools.loadShader(this.baseDir + 'js/apps/shader/pureNoise.glsl', false, 'FS: Pure Noise');
        promises[2] = this.textureTools.loadTexture(this.baseDir + 'resource/images/house02_pot.jpg');

        Promise.all( promises ).then(
            function (results) {
                scope.vertexShader = results[0];
                scope.shaderTools.printShader(scope.vertexShader, 'Vertex Shader');

                var shaders = Array(2);
                shaders['common'] = { name: 'common', value: THREE.ShaderChunk["common"] };
                shaders['pureNoise'] = { name: 'pureNoise', value: results[1] };
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

    return BlockShader;
})();