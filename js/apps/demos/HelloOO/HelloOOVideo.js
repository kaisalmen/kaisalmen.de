/**
 * Created by Kai Salmen.
 */

"use strict";

KSX.apps.demos.HelloOOVideo = (function () {

    function HelloOOVideo(elementToBindTo, elementNameVideo, elementNameVideoBuffer) {
        this.app = new KSX.apps.core.ThreeJsApp(this, "HelloOOVideo", elementToBindTo, true, false);

        this.shader = new KSX.apps.shader.SimpleTextureShader();
        
        this.video = document.getElementById(elementNameVideo);
        this.videoBuffer = document.getElementById(elementNameVideoBuffer);
        this.videoBufferContext = this.videoBuffer.getContext("2d");
        this.texture = null;
    }

    HelloOOVideo.prototype.initAsyncContent = function () {
        var scope = this;

        var callbackOnSuccess = function () {
            scope.app.initSynchronuous();
        };
        this.shader.loadResources(callbackOnSuccess);
    };


    HelloOOVideo.prototype.initGL = function () {
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

//        var material = this.shader.buildShaderMaterial();
        var mesh =  new THREE.Mesh(geometry, material);

        this.app.scenePerspective.scene.add(mesh);
        this.app.scenePerspective.camera.position.z = 150;
    };

    HelloOOVideo.prototype.render = function () {
        if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
            this.videoBufferContext.drawImage(this.video, 0, 0);
            this.texture.needsUpdate = true;
        }
    };

    return HelloOOVideo;
})();
