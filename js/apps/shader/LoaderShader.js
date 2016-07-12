/**
 * @author Kai Salmen / www.kaisalmen.de
 */

'use strict';

KSX.apps.shader.LoaderShader = (function () {

    function LoaderShader() {
        KSX.apps.shader.ShaderBase.call(this);

        this.uniforms['color'] = { type : 'fv1', value : [1.0, 1.0, 1.0] };
        this.uniforms['texture1'] = { type: 't', value: null };
    }

    LoaderShader.prototype = Object.create(KSX.apps.shader.ShaderBase.prototype, {
        constructor: {
            configurable: true,
            enumerable: true,
            value: LoaderShader,
            writable: true
        }
    });

    LoaderShader.prototype.loadResources = function (callbackOnSuccess) {
        var scope = this;

        var promises = new Array(3);
        promises[0] = this.shaderTools.loadShader( this.baseDir + 'js/apps/shader/instanceSimplest.glsl', false, 'VS: Instance Rendering Simple' );
        promises[1] = this.shaderTools.loadShader( this.baseDir + 'js/apps/shader/colorOnly.glsl', false,  'FS: Texture Only' );

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

    return LoaderShader;
})();
