/**
 * @author Kai Salmen / www.kaisalmen.de
 */

'use strict';

KSX.apps.shader.PixelProtestShader = (function () {

    function PixelProtestShader( maxWidth, maxHeight ) {
        KSX.apps.shader.ShaderBase.call(this);

        this.uniforms['offsetR'] = { type : 'f', value : Math.random() };
        this.uniforms['offsetG'] = { type : 'f', value : Math.random() };
        this.uniforms['offsetB'] = { type : 'f', value : Math.random() };
        this.uniforms['width'] = { type : 'f', value : 1.0 };
        this.uniforms['height'] = { type : 'f', value : 1.0 };
        this.uniforms['useR'] = { type : 'b', value : true };
        this.uniforms['useG'] = { type : 'b', value : true };
        this.uniforms['useB'] = { type : 'b', value : true };

        this.updateDimensions( this.uniforms.width.value, maxWidth, this.uniforms.height.value, maxHeight );
    }

    PixelProtestShader.prototype = Object.create(KSX.apps.shader.ShaderBase.prototype, {
        constructor: {
            configurable: true,
            enumerable: true,
            value: PixelProtestShader,
            writable: true
        }
    });

    PixelProtestShader.prototype.updateDimensions = function ( width, maxWidth, height, maxHeight ) {
        this.maxWidth = maxWidth;
        this.maxHeight = maxHeight;
        if (width > this.maxWidth) {
            width = this.maxWidth;
        }
        if (height > this.maxHeight) {
            height = this.maxHeight;
        }
        this.uniforms.width.value = Math.round(width);
        this.uniforms.height.value = Math.round(height);
    };

    PixelProtestShader.prototype.loadResources = function (callbackOnSuccess) {
        var scope = this;

        var promises = [];
        promises.push( this.shaderTools.loadShader(this.baseDir + 'js/apps/shader/passThrough.glsl', false, 'VS: Pass Through') );
        promises.push( this.shaderTools.loadShader(this.baseDir + 'html/pixelprotest/pureNoise.glsl', false, 'FS: Pure Noise') );

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