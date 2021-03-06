/**
 * @author Kai Salmen / www.kaisalmen.de
 */

'use strict';

KSX.shader.SphereSuperCubeShader = (function () {

    function SphereSuperCubeShader() {
        KSX.shader.ShaderBase.call(this);
    }

    SphereSuperCubeShader.prototype = Object.create(KSX.shader.ShaderBase.prototype, {
        constructor: {
            configurable: true,
            enumerable: true,
            value: SphereSuperCubeShader,
            writable: true
        }
    });

    SphereSuperCubeShader.prototype.loadResources = function (callbackOnSuccess) {
        var scope = this;

        var promises = [];
        promises.push( this.shaderTools.loadShader( this.baseDir + 'src/shader/instanceSimplest.glsl', false, 'VS: Instance Rendering Simple' ) );
        promises.push( this.shaderTools.loadShader( this.baseDir + 'src/shader/colorOnly.glsl', false,  'FS: Texture Only' ) );

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

    return SphereSuperCubeShader;
})();
