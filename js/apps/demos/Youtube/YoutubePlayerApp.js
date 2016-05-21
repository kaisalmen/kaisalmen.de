/**
 * Created by Kai Salmen.
 */

"use strict";

KSX.apps.demos.YoutubePlayerApp = (function () {

    function YoutubePlayerApp(elementToBindTo, elementNameVideo, elementNameVideoBuffer) {
        this.app = new KSX.apps.core.ThreeJsApp(this, "YoutubePlayerApp", elementToBindTo, true, true, false);
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

        this.cssRenderer = null;
        this.cssScene = null;
        this.cssCamera = null;

        this.once = false;
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

        var geometry = new THREE.PlaneGeometry(3712, 3712, 1, 1);
        var material = new THREE.MeshBasicMaterial({
            color: 0x000000,
            opacity: 0,
            blending: THREE.NoBlending
        });
        var mesh = new THREE.Mesh(geometry, material);

        this.app.scenePerspective.scene.add(mesh);
        this.app.scenePerspective.camera.position.set( 0, 0, 750 );


        var Element = function ( id, x, y, z, ry ) {
            var div = document.createElement( 'div' );
            div.style.width = '480px';
            div.style.height = '360px';
            div.style.backgroundColor = '#000';

            var iframe = document.createElement( 'iframe' );
            iframe.style.width = '480px';
            iframe.style.height = '360px';
            iframe.style.border = '0px';
            iframe.src = [ 'http://www.youtube.com/embed/', id, '?rel=0?version=3&origin=http://localhost:8080?enablejsapi=1' ].join( '' );

            div.appendChild( iframe );

            var object = new THREE.CSS3DObject( div );
            object.position.set( x, y, z );
            object.rotation.y = ry;

            return object;
        };

        var container = document.getElementById( 'player' );

        this.cssCamera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 5000 );
        this.cssCamera.position.set( 0, 0, 750 );

        this.cssScene = new THREE.Scene();

        this.cssRenderer = new THREE.CSS3DRenderer();
        this.cssRenderer.setSize( window.innerWidth, window.innerHeight );
        this.cssRenderer.domElement.style.position = 'absolute';
        this.cssRenderer.domElement.style.top = 0;

        container.appendChild( this.cssRenderer.domElement );

        var videoElem = new Element( 'M7lc1UVf-VE', 0, 0, 240, 0 );
        this.cssScene.add( videoElem );

        // Block iframe events when dragging camera
        var blocker = document.getElementById( 'blocker' );
        blocker.style.display = 'none';
        
        document.addEventListener( 'mousedown', function () { blocker.style.display = ''; } );
        document.addEventListener( 'mouseup', function () { blocker.style.display = 'none'; } );
    };

    YoutubePlayerApp.prototype.render = function () {
        this.cssRenderer.render(this.cssScene, this.cssCamera);
    };

    return YoutubePlayerApp;
})();
