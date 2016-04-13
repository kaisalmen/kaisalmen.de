0/**
 * Created by Kai Salmen.
 */

'use strict';

KSX.apps.shader.TextureWithNoiseShader = (function () {

    function TextureWithNoiseShader() {
        
        KSX.apps.shader.ShaderBase.call(this);

        this.uniforms = {
            blendFactor : { type: 'f', value: 1.0 },
            colorFactor : { type: 'fv1', value: [1.0, 1.0, 1.0] },
            texture1: { type: 't', value: null }
        };
        this.vertexShader = null;
        this.fragmentShader = null;
    }

    TextureWithNoiseShader.prototype.loadResources = function (callbackOnSuccess) {
        var scope = this;

        var promises = new Array(3);
        promises[0] = this.shaderTools.loadShader('../../js/apps/shader/passThrough.glsl', true, 'VS: Pass Through');
        promises[1] = this.shaderTools.loadShader('../../js/apps/shader/simpleTextureEffect.glsl', true, 'FS: Simple Texture');
        promises[2] = this.textureTools.loadTexture('../../resource/images/house02_pot.jpg');

        Promise.all( promises ).then(
            function (results) {
                scope.vertexShader = results[0];
                scope.fragmentShader = results[1];
                scope.uniforms.texture1.value = results[2];

                callbackOnSuccess();
            }
        ).catch(
            function (error) {
                console.log('The following error occurred: ', error);
            }
        );
    };

    return TextureWithNoiseShader;
})();

KSX.apps.demos.TextureWithNoiseShaderApp = (function () {

    function TextureWithNoiseShaderApp(elementToBindTo) {
        this.app = new KSX.apps.core.ThreeJsApp(this, 'TextureWithNoiseShaderApp', elementToBindTo, true, false);

        this.vertexShaderText = null;
        this.fragmentShaderText = null;
        this.shader = new KSX.apps.shader.TextureWithNoiseShader();
    }

    TextureWithNoiseShaderApp.prototype.initAsyncContent = function() {
        var scope = this;

        var callbackOnSuccess = function () {
            scope.app.initSynchronuous();
        };
        this.shader.loadResources(callbackOnSuccess);
    };

    TextureWithNoiseShaderApp.prototype.initGL = function () {
        var camera = this.app.scenePerspective.camera;
        camera.position.set( 0, 0, 250 );

        var geometry = new THREE.TorusKnotGeometry(8, 2, 128, 24);
        var material = new THREE.ShaderMaterial({
            uniforms: this.shader.uniforms,
            vertexShader: this.shader.vertexShader,
            fragmentShader: this.shader.fragmentShader
        });
        this.mesh =  new THREE.Mesh(geometry, material);

        this.app.scenePerspective.scene.add(this.mesh);
        this.app.scenePerspective.camera.position.z = 25;
    };

    TextureWithNoiseShaderApp.prototype.render = function () {
        this.mesh.rotation.x += 0.01;
        this.mesh.rotation.y += 0.01;
    };

    return TextureWithNoiseShaderApp;
})();
