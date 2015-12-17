0/**
 * Created by Kai Salmen.
 */

"use strict";

KSX.apps.demos.HelloOOShader = (function () {

    function HelloOOShader(elementToBindTo) {
        this.sceneApp = new KSX.apps.core.SceneAppPerspective(this, "HelloOOShader", elementToBindTo, false);
        this.shaderTools = new KSX.apps.tools.ShaderTools();
        this.vertexShaderText = null;
        this.fragmentShaderText = null;
        this.uniforms = {
            blendFactor : { type: "f", value: 0.75 },
            colorFactor : { type: "fv1", value: [1.0, 1.0, 1.0] },
            texture1: { type: "t", texture: null }
        };
    }

    HelloOOShader.prototype.initAsyncContent = function(refToMyself) {
        $.when(
            this.shaderTools.loadShader("../../resource/shader/passThrough.glsl", true, "VS: Pass Through"),
            this.shaderTools.loadShader("../../resource/shader/simpleTextureEffect.glsl", true, "FS: Simple Texture")
        ).done(
            function(vert, frag) {
                refToMyself.vertexShaderText = vert[0];
                refToMyself.fragmentShaderText = frag[0];
                refToMyself.sceneApp.initSynchronuous();
            }
        );
    };

    HelloOOShader.prototype.initGL = function () {
        var imageUrl = "../../resource/images/house02.jpg";
        var textureLoader = new THREE.TextureLoader();

        this.uniforms.texture1.value = textureLoader.load(imageUrl,
            function (texture) {
                console.log("Loading of texture was completed successfully!");
            },
            function (xhr) {
                console.log((xhr.loaded / xhr.total * 100) + "% loaded");
            },
            function (xhr) {
                console.log("An error occured!");
            }
        );

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
