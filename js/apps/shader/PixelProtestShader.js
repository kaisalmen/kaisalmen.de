/**
 * Created by Kai Salmen.
 */

'use strict';

KSX.apps.shader.PixelProtestShader = (function () {

    function PixelProtestShader(width, height) {
        KSX.apps.shader.ShaderBase.call(this);

        var baseValue = Math.random();
        this.uniforms = {
            offsetR : { type : 'f', value : baseValue },
            offsetG : { type : 'f', value : baseValue },
            offsetB : { type : 'f', value : baseValue },
            width : { type : 'f', value : width },
            height : { type : 'f', value : height }
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

        var promises = new Array(3);
        promises[0] = this.shaderTools.loadShader(this.baseDir + 'js/apps/shader/passThrough.glsl', false, 'VS: Pass Through');
        promises[1] = this.shaderTools.loadShader(this.baseDir + 'js/apps/shader/noise2D.glsl', false, 'FS: Pure Noise');
        promises[2] = this.shaderTools.loadShader(this.baseDir + 'js/apps/shader/pureNoise.glsl', false, 'FS: Pure Noise');

        Promise.all( promises ).then(
            function (results) {
                scope.vertexShader = results[0];
                scope.fragmentShader = THREE.ShaderChunk[ "common" ] + '\n' + results[2];

                console.log('Combined FS:\n' + scope.fragmentShader);
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