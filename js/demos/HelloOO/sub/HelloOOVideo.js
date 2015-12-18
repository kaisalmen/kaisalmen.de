/**
 * Created by Kai Salmen.
 */

"use strict";

KSX.apps.demos.HelloOOVideo = (function () {

    function HelloOOVideo(elementToBindTo) {
        this.sceneApp = new KSX.apps.core.SceneAppPerspective(this, "HelloOOVideo", elementToBindTo, false);
        this.shaderTools = new KSX.apps.tools.ShaderTools();
        this.vertexShaderText = null;
        this.fragmentShaderText = null;
        this.uniforms = {
            blendFactor : { type: "f", value: 0.75 },
            colorFactor : { type: "fv1", value: [1.0, 1.0, 1.0] },
            texture1: { type: "t", texture: null }
        };
    }

    HelloOOVideo.prototype.initAsyncContent = function (refToMyself) {
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
    }

    HelloOOVideo.prototype.initGL = function () {
        this.uniforms.texture1.value = this.shaderTools.loadTexture("../../resource/images/house02.jpg");

        var geometry = new THREE.TorusGeometry(7, 2, 16, 100);
        var material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: this.vertexShaderText,
            fragmentShader: this.fragmentShaderText
        });
        this.mesh =  new THREE.Mesh(geometry, material);

        this.sceneApp.scene.add(this.mesh);
        this.sceneApp.camera.position.z = 15;
    };

    HelloOOVideo.prototype.render = function () {
        this.mesh.rotation.x += 0.025;
        this.mesh.rotation.y += 0.025;
    };

    return HelloOOVideo;
})();
