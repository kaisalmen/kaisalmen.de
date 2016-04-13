/**
 * Created by Kai Salmen.
 */

"use strict";

KSX.apps.demos.YoutubePlayerApp = (function () {

    function YoutubePlayerApp(elementToBindTo, elementNameVideo, elementNameVideoBuffer) {
        this.app = new KSX.apps.core.ThreeJsApp(this, "YoutubePlayerApp", elementToBindTo, true, false);
        this.shaderTools = new KSX.apps.tools.ShaderTools();
        this.textureTools = new KSX.apps.tools.TextureTools();
        this.vertexShaderText = null;
        this.fragmentShaderText = null;
        this.uniforms = {
            blendFactor : { type: "f", value: 0.75 },
            colorFactor : { type: "fv1", value: [1.0, 1.0, 1.0] },
            texture1: { type: "t", value: null }
        };
//        this.video = document.getElementById('youtubeVideo');
        this.video = null;
        this.videoBuffer = document.getElementById(elementNameVideoBuffer);
        this.videoBufferContext = this.videoBuffer.getContext("2d");
        this.texture = null;
    }

    YoutubePlayerApp.prototype.initAsyncContent = function () {
        var scope = this;

        var promises = new Array(3);
        promises[0] = this.shaderTools.loadShader("../../js/apps/shader/passThrough.glsl", true, "VS: Pass Through");
        promises[1] = this.shaderTools.loadShader("../../js/apps/shader/simpleTextureEffect.glsl", true, "FS: Simple Texture");
        promises[2] = this.textureTools.loadTexture("../../resource/images/house02_pot.jpg");

        Promise.all( promises ).then(
            function (results) {
                scope.vertexShaderText = results[0];
                scope.fragmentShaderText = results[1];
                scope.uniforms.texture1.value = results[2];
                scope.app.initSynchronuous();
            }
        ).catch(
            function (error) {
                console.log('The following error occurred: ', error);
            }
        );
    };

    YoutubePlayerApp.prototype.initGL = function () {
        var camera = this.app.scenePerspective.camera;
        camera.position.set( 0, 0, 250 );

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

        this.app.scenePerspective.scene.add(mesh);
        this.app.scenePerspective.camera.position.z = 150;
    };

    YoutubePlayerApp.prototype.render = function () {
        if (this.video !== null && this.videoBufferContext !== null && this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
            this.videoBufferContext.drawImage(this.video, 0, 0);
            this.texture.needsUpdate = true;
        }

//        var youtubeObject = document.getElementById('youtubeVideo');
    };

    return YoutubePlayerApp;
})();
