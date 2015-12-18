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
        this.video = document.getElementById("DivGL3Video");
        this.videoBuffer = document.getElementById("DivGL3VideoBuffer");
        this.videoBufferContext = this.videoBuffer.getContext("2d");
        this.texture = null;
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

        this.videoBuffer.width = 1920;
        this.videoBuffer.height = 1080;
        this.videoBufferContext.fillStyle = "#000000";
        this.videoBufferContext.fillRect(0, 0, 1920, 1080);

        this.texture = new THREE.Texture(this.videoBuffer);
        this.texture.minFilter = THREE.LinearFilter;
        this.texture.magFilter = THREE.LinearFilter;
        this.texture.format = THREE.RGBFormat;

//        var geometry = new THREE.TorusGeometry(7, 2, 16, 100);
        var geometry = new THREE.BoxGeometry(192, 108, 10);
        var material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            map: this.texture
        });
/*
        var material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: this.vertexShaderText,
            fragmentShader: this.fragmentShaderText
        });
*/
        var mesh =  new THREE.Mesh(geometry, material);

        this.sceneApp.scene.add(mesh);
        this.sceneApp.camera.position.z = 150;
    };

    HelloOOVideo.prototype.render = function () {
        if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
            this.videoBufferContext.drawImage(this.video, 0, 0);
            this.texture.needsUpdate = true;
        }
    };

    return HelloOOVideo;
})();
