/**
 * Created by Kai Salmen.
 */

'use strict';

KSX.apps.shader.PixelProtestShader = (function () {

    function PixelProtestShader() {
        KSX.apps.shader.ShaderBase.call(this);

        this.uniforms = {
        };
        this.vertexShader = null;
        this.fragmentShader = null;
    }

    PixelProtestShader.prototype = Object.create(KSX.apps.shader.ShaderBase.prototype, {
        constructor: {
            configurable: true,
            enumerable: true,
            value: PixelProtestShader,
            writable: true
        }
    });

    PixelProtestShader.prototype.loadResources = function (callbackOnSuccess) {
        var scope = this;

        var promises = new Array(2);
        promises[0] = this.shaderTools.loadShader(this.baseDir + 'js/apps/shader/passThrough.glsl', true, 'VS: Pass Through');
        promises[1] = this.shaderTools.loadShader(this.baseDir + 'js/apps/shader/pureNoise.glsl', true, 'FS: Pure Noise');

        Promise.all( promises ).then(
            function (results) {
                scope.vertexShader = results[0];
                scope.fragmentShader = results[1];

                callbackOnSuccess();
            }
        ).catch(
            function (error) {
                console.log('The following error occurred: ', error);
            }
        );
    };

    return PixelProtestShader;
})();