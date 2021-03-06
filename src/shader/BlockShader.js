/**
 * @author Kai Salmen / www.kaisalmen.de
 */

'use strict';

KSX.shader.BlockShader = (function () {

    function BlockShader() {
        KSX.shader.ShaderBase.call(this);

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

    BlockShader.prototype = Object.create(KSX.shader.ShaderBase.prototype, {
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

    BlockShader.prototype.loadResources = function ( intermediate, callbackOnSuccess) {
        var scope = this;

        var promises = [];
        promises.push( this.shaderTools.loadShader(this.baseDir + 'src/shader/instancePosition.glsl', false, 'VS: Deform Geometry according Texture') );
        promises.push( this.shaderTools.loadShader(this.baseDir + 'src/shader/textureOnly.glsl', false, 'FS: Texture Only') );
        if ( intermediate ) {
            promises.push( this.textureTools.loadTexture(this.baseDir + 'resource/textures/PixelProtest.png') );
        }
        else {
            promises.push( this.textureTools.loadTexture(this.baseDir + 'resource/textures/PTV1Link.jpg') );
            promises.push( this.textureTools.loadTexture(this.baseDir + 'resource/textures/PixelProtestLink.png') );
            promises.push( this.textureTools.loadTexture(this.baseDir + 'resource/textures/teaserLink.jpg') );
            promises.push( this.textureTools.loadTexture(this.baseDir + 'resource/textures/ProjectionSpace.jpg') );
        }

        Promise.all( promises ).then(
            function (results) {
                scope.vertexShader = results[0];

                var shaders = [];
                shaders['common'] = { name: 'common', value: THREE.ShaderChunk["common"] };
                shaders['texture'] = { name: 'texture', value: results[1] };
                scope.fragmentShader = scope.shaderTools.combineShader(shaders, false);

                if ( intermediate ) {
                    scope.textures['pixelProtestImage'] = results[2];
                }
                else {
                    scope.textures['linkPTV1'] = results[2];
                    scope.textures['linkPixelProtest'] = results[3];
                    scope.textures['linkTeaser'] = results[4];
                    scope.textures['linkProjectionSpace'] = results[5];
                }

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