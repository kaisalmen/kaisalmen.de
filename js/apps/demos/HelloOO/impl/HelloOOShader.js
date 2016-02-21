0/**
 * Created by Kai Salmen.
 */

"use strict";

KSX.apps.demos.HelloOOShader = (function () {

    function HelloOOShader(elementToBindTo) {
        this.sceneApp = new KSX.apps.core.SceneAppPerspective(this, "HelloOOShader", elementToBindTo, false);
        this.shaderTools = new KSX.apps.tools.ShaderTools();
        this.textureTools = new KSX.apps.tools.TextureTools();
        this.vertexShaderText = null;
        this.fragmentShaderText = null;
        this.uniforms = {
            blendFactor : { type: "f", value: 0.75 },
            colorFactor : { type: "fv1", value: [1.0, 1.0, 1.0] },
            texture1: { type: "t", texture: null }
        };
    }

    HelloOOShader.prototype.initAsyncContent = function() {
        var scope = this;

        var promises = new Array(3);
        promises[0] = this.shaderTools.loadShader("../../resource/shader/passThrough.glsl", true, "VS: Pass Through");
        promises[1] = this.shaderTools.loadShader("../../resource/shader/simpleTextureEffect.glsl", true, "FS: Simple Texture");
        promises[2] = this.textureTools.loadTexture("../../resource/images/house02_pot.jpg");

        Promise.all( promises ).then(
            function (results) {
                scope.vertexShaderText = results[0];
                scope.fragmentShaderText = results[1];
                scope.uniforms.texture1.value = results[2];
                scope.sceneApp.initSynchronuous();
            }
        ).catch(
            function (error) {
                console.log('The following error occurred: ', error);
            }
        );
    };

    HelloOOShader.prototype.initGL = function () {
        var geometry = new THREE.TorusKnotGeometry(8, 2, 128, 24);
        var material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: this.vertexShaderText,
            fragmentShader: this.fragmentShaderText
        });
        this.mesh =  new THREE.Mesh(geometry, material);

        this.sceneApp.scene.add(this.mesh);
        this.sceneApp.camera.position.z = 25;
    };

    HelloOOShader.prototype.render = function () {
        this.mesh.rotation.x += 0.01;
        this.mesh.rotation.y += 0.01;
    };

    return HelloOOShader;
})();
