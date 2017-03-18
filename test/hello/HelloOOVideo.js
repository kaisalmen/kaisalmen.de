/**
 * @author Kai Salmen / www.kaisalmen.de
 */

'use strict';

if ( KSX.test.hello === undefined ) KSX.test.hello = {};

KSX.test.hello.HelloOOVideo = (function () {

    HelloOOVideo.prototype = Object.create(KSX.core.ThreeJsApp.prototype, {
        constructor: {
            configurable: true,
            enumerable: true,
            value: HelloOOVideo,
            writable: true
        }
    });

    function HelloOOVideo(elementToBindTo, elementNameVideo, elementNameVideoBuffer) {
        KSX.core.ThreeJsApp.call(this);

        this.configure({
            name: 'HelloOOVideo',
            htmlCanvas: elementToBindTo,
            useScenePerspective: true
        });

        this.video = document.getElementById(elementNameVideo);
        this.videoBuffer = document.getElementById(elementNameVideoBuffer);
        this.videoBufferContext = this.videoBuffer.getContext("2d");
        this.texture = null;
    }

    HelloOOVideo.prototype.initGL = function () {
        var cameraDefaults = {
            posCamera: new THREE.Vector3( 0.0, 0.0, 150.0 ),
        };
        this.scenePerspective.setCameraDefaults( cameraDefaults );

        this.videoBuffer.width = 1920;
        this.videoBuffer.height = 1080;
        this.videoBufferContext.fillStyle = "#000000";
        this.videoBufferContext.fillRect(0, 0, 1920, 1080);

        this.texture = new THREE.Texture(this.videoBuffer);
        this.texture.minFilter = THREE.LinearFilter;
        this.texture.magFilter = THREE.LinearFilter;
        this.texture.format = THREE.RGBFormat;

        var geometry = new THREE.BoxGeometry(192, 108, 10);
        var material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            map: this.texture
        });
        var mesh =  new THREE.Mesh(geometry, material);

        this.scenePerspective.scene.add(mesh);
    };

    HelloOOVideo.prototype.renderPre = function () {
        if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
            this.videoBufferContext.drawImage(this.video, 0, 0);
            this.texture.needsUpdate = true;
        }
    };

    return HelloOOVideo;
})();
