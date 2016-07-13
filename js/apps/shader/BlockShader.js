/**
 * @author Kai Salmen / www.kaisalmen.de
 */

'use strict';

KSX.apps.shader.BlockShader = (function () {

    function BlockShader() {
        KSX.apps.shader.ShaderBase.call(this);

        this.uniforms['heightFactor'] = { type: 'f', value: 1.0 };
        this.uniforms['uvRandom'] = { type: 'f', value: 1.0 };
        this.uniforms['scaleBox'] = { type: 'f', value: 1.0 };
        this.uniforms['spacing'] = { type: 'f', value: 1.0 };
        this.uniforms['useUvRange'] = { type : 'b', value : false };
        this.uniforms['invert'] = { type : 'b', value : false };
        this.uniforms['texture1'] = { type: 't', value: null };
        this.textures = [];

        this.resetUniforms();
    }

    BlockShader.prototype = Object.create(KSX.apps.shader.ShaderBase.prototype, {
        constructor: {
            configurable: true,
            enumerable: true,
            value: BlockShader,
            writable: true
        }
    });

    BlockShader.prototype.resetUniforms = function ( textureName, heightFactor ) {
        if ( textureName === undefined ) {
            textureName = 'default';
        }
        if ( heightFactor === undefined ) {
            heightFactor = 12.0;
        }
        this.uniforms.heightFactor.value = heightFactor;
        this.uniforms.uvRandom.value = 1.0;
        this.uniforms.scaleBox.value = 0.66;
        this.uniforms.spacing.value = 1.0;
        this.uniforms.useUvRange.value = true;
        this.uniforms.invert.value = false;

        var texture = this.textures[textureName];
        if ( texture !== undefined && texture !== null ) {
            this.uniforms.texture1.value = texture;
        }
    };

    BlockShader.prototype.loadResources = function (callbackOnSuccess) {
        var scope = this;

        var promises = new Array(5);
        promises[0] = this.shaderTools.loadShader(this.baseDir + 'js/apps/shader/instancePosition.glsl', false, 'VS: Deform Geometry according Texture');
        promises[1] = this.shaderTools.loadShader(this.baseDir + 'js/apps/shader/textureOnly.glsl', false, 'FS: Texture Only');
        promises[2] = this.textureTools.loadTexture(this.baseDir + 'resource/images/PixelProtest.png');
        promises[3] = this.textureTools.loadTexture(this.baseDir + 'resource/textures/PTV1Link.jpg');
        promises[4] = this.textureTools.loadTexture(this.baseDir + 'resource/textures/PixelProtestLink.png');
        promises[5] = this.textureTools.loadTexture(this.baseDir + 'resource/textures/teaserLink.jpg');
        promises[6] = this.textureTools.loadTexture(this.baseDir + 'resource/textures/LoaderTestLink.png');

        Promise.all( promises ).then(
            function (results) {
                scope.vertexShader = results[0];

                var shaders = Array(2);
                shaders['common'] = { name: 'common', value: THREE.ShaderChunk["common"] };
                shaders['texture'] = { name: 'texture', value: results[1] };
                scope.fragmentShader = scope.shaderTools.combineShader(shaders, false);

                scope.textures['pixelProtestImage'] = results[2];
                scope.textures['linkPTV1'] = results[3];
                scope.textures['linkPixelProtest'] = results[4];
                scope.textures['linkTeaser'] = results[5];
                scope.textures['linkLoader'] = results[6];

                scope.uniforms.texture1.value = scope.textures['default'];

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