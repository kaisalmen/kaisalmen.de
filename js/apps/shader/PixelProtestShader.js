/**
 * Created by Kai Salmen.
 */

'use strict';

KSX.apps.shader.PixelProtestShader = (function () {

    function PixelProtestShader(width, height) {
        KSX.apps.shader.ShaderBase.call(this);

        this.uniforms['offsetR'] = { type : 'f', value : Math.random() };
        this.uniforms['offsetG'] = { type : 'f', value : Math.random() };
        this.uniforms['offsetB'] = { type : 'f', value : Math.random() };
        this.uniforms['width'] = { type : 'f', value : width / 4.0 };
        this.uniforms['height'] = { type : 'f', value : height / 4.0 };
        this.uniforms['useR'] = { type : 'b', value : true };
        this.uniforms['useG'] = { type : 'b', value : true };
        this.uniforms['useB'] = { type : 'b', value : true };
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

    return PixelProtestShader;
})();