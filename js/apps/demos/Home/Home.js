/**
 * @author Kai Salmen / www.kaisalmen.de
 */

'use strict';

if (KSX.apps.demos.home === undefined) {
    KSX.apps.demos.home = {};
}

KSX.apps.demos.home.Main = (function () {

    var MAIN_CLEAR_COLOR = 0x202020;
    var RTT_CLEAR_COLOR = 0x0B0B0B;

    Home.prototype = Object.create(KSX.apps.core.ThreeJsApp.prototype, {
        constructor: {
            configurable: true,
            enumerable: true,
            value: Home,
            writable: true
        }
    });

    function Home(elementToBindTo, elementNameVideo, elementNameVideoBuffer) {
        KSX.apps.core.ThreeJsApp.call(this);

        this.configure({
            user : this,
            name : 'Home',
            htmlCanvas : elementToBindTo,
            renderers : {
                regular : {
                    canvas : elementToBindTo,
                    antialias : false
                }
            },
            useScenePerspective : true
        });

        this.shader = new KSX.apps.shader.BlockShader();

        this.video = elementNameVideo;
        this.videoBuffer = elementNameVideoBuffer;
        this.videoBufferContext = this.videoBuffer.getContext("2d");
        this.videoTexture = null;
        this.videoTextureEnabled = false;

        this.animate = false;
        this.invert = false;

        this.controls = null;

        var uiParams = {
            css: 'top: 0px; left: 0px;',
            size: 384,
            center: false,
            color: 'rgba(224, 224, 224, 1.0)',
            bg: 'rgba(40, 40, 40, 0.66)'
        };
        var paramsDimension = {
            mobile : {
                slidesHeight : 96
            }
        };
        this.uiTools = new KSX.apps.tools.UiTools(uiParams, paramsDimension, bowser.mobile);
        
        this.stats = new Stats();
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.left = '';
        this.stats.domElement.style.right = '0px';
        this.stats.domElement.style.top = '0px';

        this.gridParams = {
            sizeX : 360,
            sizeY : 640,
            uMin : 0.0,
            vMin : 0.0,
            uMax : 1.0,
            vMax : 1.0,
            cubeEdgeLength : 0.5,
            posStartX : 0.0,
            posStartY : 0.0,
            useIndices : false
        };

        if (bowser.mobile) {
            this.gridParams.sizeX = 128;
            this.gridParams.sizeY = 128;
        }

        this.superBoxGroup = null;

        this.rtt = {
            scene : null,
            camera : null,
            directionalLight : null,
            helper : null,
            mesh : null,
            texture : null,
            textStorage : new KSX.apps.tools.text.Text()
        };

        this.debug = false;
        this.pixelBoxesBuilder = null;
    }

    Home.prototype.initAsyncContent = function() {
        var scope = this;

        var callbackOnSuccess = function () {
            var listOfFonts = [];
            listOfFonts['ubuntu_mono_regular'] = 'resource/fonts/ubuntu_mono_regular.json';
            listOfFonts['droid_sans_mono_regular'] = 'resource/fonts/droid_sans_mono_regular.typeface.json';

            var callbackOnSuccess = function () {
                scope.asyncDone = true;
            };
            scope.rtt.textStorage.loadListOfFonts(KSX.globals.basedir, listOfFonts, callbackOnSuccess);
        };

        scope.shader.loadResources(callbackOnSuccess);
    };

    Home.prototype.initPreGL = function () {
        var scope = this;
        var ui = scope.uiTools.ui;

        scope.stats.showPanel(0);
        document.body.appendChild(scope.stats.domElement);

        var adjustHeightFactor = function (value) {
            scope.shader.uniforms.heightFactor.value = value;
        };
        var invertShader = function (value) {
            scope.shader.uniforms.invert.value = value;
        };
        var enableAnimation = function (enabled) {
            scope.animate = enabled;
        };
        var resetView = function () {
            scope.scenePerspective.resetCamera();
            scope.controls.reset();
            scope.controls.target = scope.scenePerspective.cameraTarget;
            scope.superBoxPivot.rotation.y = 0;
        };
        var enableVideo = function (enabled) {
            scope.videoTextureEnabled = enabled;
            scope.checkVideo();
        };
        var playVideo = function () {
            if (scope.videoTextureEnabled) {
                scope.video.play();
            }
            scope.checkVideo();
        };
        var pauseVideo = function () {
            if (scope.videoTextureEnabled) {
                scope.video.pause();
            }            
        };

        ui.add('slide', {
            name: 'heightFactor',
            callback: adjustHeightFactor,
            min: scope.uiTools.paramsDimension.minValue,
            max: scope.uiTools.paramsDimension.maxValue,
            value: scope.shader.uniforms.heightFactor.value,
            precision: 1,
            step: 1,
            width: scope.uiTools.paramsDimension.slidesWidth,
            height: scope.uiTools.paramsDimension.slidesHeight,
            stype: scope.uiTools.paramsDimension.sliderType
        });
        ui.add('bool', {
            name: 'Invert',
            value: scope.invert,
            callback: invertShader,
            height: scope.uiTools.paramsDimension.boolHeight
        });
        ui.add('bool', {
            name: 'Animate',
            value: scope.animate,
            callback: enableAnimation,
            height: scope.uiTools.paramsDimension.boolHeight
        });
        ui.add('button', {
            name: 'Reset View',
            callback: resetView,
            width: scope.uiTools.paramsDimension.buttonWidth,
            height: scope.uiTools.paramsDimension.buttonHeight
        });
        var groupVideo = ui.add('group', {
            name: 'Video Control',
            height: scope.uiTools.paramsDimension.groupHeight
        });
        groupVideo.add('bool', {
            name: 'Enable Video',
            value: scope.videoTextureEnabled,
            callback: enableVideo,
            height: scope.uiTools.paramsDimension.boolHeight
        });
        groupVideo.add('button', {
            name: 'Play Video',
            callback: playVideo,
            width: scope.uiTools.paramsDimension.buttonWidth,
            height: scope.uiTools.paramsDimension.buttonHeight
        });
        groupVideo.add('button', {
            name: 'Pause Video',
            callback: pauseVideo,
            width: scope.uiTools.paramsDimension.buttonWidth,
            height: scope.uiTools.paramsDimension.buttonHeight
        });
        groupVideo.open();
    };

    Home.prototype.initGL = function () {
        var gl = this.renderer.getContext();

        var result = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
        if (result != 0) {
            console.log("Vertex shader is able to read texture: " + result);
        }
        else {
            alert("Vertex shader is unable to access textures. Aborting...");
            this.initError = true;
            return;
        }
        this.renderer.setClearColor(MAIN_CLEAR_COLOR);

        // init camera and bind to controls
        var camPos = new THREE.Vector3(0.0, -this.gridParams.sizeY * 0.25, this.gridParams.sizeY * 0.75);
        this.scenePerspective.setCameraDefaults(camPos);
        this.controls = new THREE.TrackballControls(this.scenePerspective.camera);


        // init video texture and params
        this.videoBuffer.width = 1920;
        this.videoBuffer.height = 804;
        this.videoBufferContext.fillStyle = "#000000";
        this.videoBufferContext.fillRect(0, 0, 1920, 804);

        this.videoTexture = new THREE.Texture(this.videoBuffer);
        this.videoTexture.minFilter = THREE.LinearFilter;
        this.videoTexture.magFilter = THREE.LinearFilter;
        this.videoTexture.format = THREE.RGBFormat;


        // setup RTT
        this.rtt.scene = new THREE.Scene();
        this.rtt.camera = new THREE.PerspectiveCamera();
        this.rtt.camera.position.set(0, 10, 20);
        this.rtt.camera.lookAt(new THREE.Vector3(0, 0, 0));

        var lightColor = 0xE0E0E0;
        var lightPos = new THREE.Vector3(100, 100, 100);
        this.rtt.directionalLight = new THREE.DirectionalLight(lightColor);
        this.rtt.directionalLight.position.set(lightPos.x, lightPos.y, lightPos.z);
        this.rtt.scene.add(this.rtt.directionalLight);

        if (this.debug) {
            this.rtt.helper = new THREE.GridHelper(20, 1, 0xFF4444, 0x404040);
            this.rtt.scene.add(this.rtt.helper);
        }

        var textWelcome = this.rtt.textStorage.addText('Welcome', 'ubuntu_mono_regular', 'Welcome back to', new THREE.MeshStandardMaterial(), 1, 10);
        textWelcome.mesh.position.set(-5, 3, 0);
        var textDomain = this.rtt.textStorage.addText('Domain', 'ubuntu_mono_regular', 'www.kaisalmen.de', new THREE.MeshStandardMaterial(), 1, 10);
        textDomain.mesh.position.set(-5, -3, 0);
        this.rtt.scene.add(textWelcome.mesh);
        this.rtt.scene.add(textDomain.mesh);

        var geometry = new THREE.SphereGeometry(1, 32, 32);
        var material = new THREE.MeshNormalMaterial();
        this.rtt.mesh = new THREE.Mesh(geometry, material);
        this.rtt.scene.add(this.rtt.mesh);

        this.rtt.texture = new THREE.WebGLRenderTarget(
            this.videoBuffer.width,
            this.videoBuffer.height,
            {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.NearestFilter,
                format: THREE.RGBFormat
            }
        );
        this.shader.textures['rtt'] = this.rtt.texture.texture;


        var material = this.shader.buildShaderMaterial();
//        material.wireframe = true;
        this.checkVideo(material);


        if (this.debug) {
            var helper = new THREE.GridHelper(1000, 10, 0xFF4444, 0x404040);
            this.scenePerspective.scene.add(helper);
        }

        this.superBoxPivot = new THREE.Object3D();
        this.superBoxGroup = new THREE.Group();
        this.superBoxGroup.translateX(-320);
        this.superBoxGroup.translateY(-180);
        this.superBoxPivot.add(this.superBoxGroup);
        this.scenePerspective.scene.add(this.superBoxPivot);

        this.pixelBoxesBuilder = new KSX.apps.demos.home.PixelBoxesBuilder( KSX.globals.basedir, material, this.superBoxGroup );
        this.pixelBoxesBuilder.buildSuperBoxSeries( 1280, 720, 48, 30, 0.5 );
    };

    Home.prototype.addEventHandlers = function () {
        var scope = this;

        var eatComplete =  function ( event ) {
            console.log( 'Received event "complete"!' );
            scope.renderingEnabled = true;
        };
        document.addEventListener( 'complete', eatComplete, false );
    };

    Home.prototype.initPostGL = function() {
        return false;
    };

    Home.prototype.resizeDisplayGL = function () {
        this.controls.handleResize();
    };

    Home.prototype.renderPre = function () {
        if (this.animate && this.superBoxGroup !== undefined) {
            this.superBoxPivot.rotateY(0.005);
        }
        this.controls.update();

        if (this.videoTextureEnabled && this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
            this.videoBufferContext.drawImage(this.video, 0, 0);
            this.videoTexture.needsUpdate = true;
        }

        this.renderer.setClearColor(RTT_CLEAR_COLOR);
        this.rtt.mesh.position.set(3 * Math.sin(this.frameNumber / 10), 0, 3 * Math.cos(this.frameNumber / 10));
        this.renderer.render( this.rtt.scene, this.rtt.camera, this.rtt.texture, false );

        this.renderer.setClearColor(MAIN_CLEAR_COLOR);
    };

    Home.prototype.renderPost = function () {
        this.stats.update();
    };

    Home.prototype.checkVideo = function () {
        if (this.videoTextureEnabled) {
            this.video.play();
            this.shader.uniforms.texture1.value = this.videoTexture;
        }
        else {
            this.video.pause();
            this.shader.uniforms.texture1.value = this.shader.textures['rtt'];
        }
    };

    Home.prototype.flipTexture = function (name) {
        var texture = this.shader.textures[name];
        if (texture !== undefined) {
            this.shader.uniforms.texture1.value = texture;
        }
    };

    return Home;
})();
