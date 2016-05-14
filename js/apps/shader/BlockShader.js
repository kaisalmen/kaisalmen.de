/**
 * Created by Kai Salmen.
 */

'use strict';

KSX.apps.shader.BlockShader = (function () {

    function BlockShader() {
        KSX.apps.shader.ShaderBase.call(this);

        this.uniforms = {
        };
        this.vertexShader = null;
        this.fragmentShader = null;
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
        promises[0] = this.shaderTools.loadShader(this.baseDir + 'js/apps/shader/passThrough.glsl', false, 'VS: Pass Through');
        promises[1] = this.shaderTools.loadShader(this.baseDir + 'js/apps/shader/pureNoise.glsl', false, 'FS: Pure Noise');

        Promise.all( promises ).then(
            function (results) {
                scope.vertexShader = results[0];
                var shaders = Array(2);
                shaders['common'] = { name: 'common', value: THREE.ShaderChunk["common"] };
                shaders['pureNoise'] = { name: 'pureNoise', value: results[1] };
                scope.fragmentShader = scope.shaderTools.combineShader(shaders, true);

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