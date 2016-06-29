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
                    antialias : true
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

        this.superBoxGroup = null;

        this.rtt = null;
        this.textStorage = new KSX.apps.tools.text.Text();

        this.useHwInstancing = true;
        this.pixelBoxesGenerator = null;
    }

    Home.prototype.initAsyncContent = function() {
        var scope = this;

        var callbackOnShaderSuccess = function () {
            var listOfFonts = [];
            listOfFonts['ubuntu_mono_regular'] = 'resource/fonts/ubuntu_mono_regular.json';
            listOfFonts['droid_sans_mono_regular'] = 'resource/fonts/droid_sans_mono_regular.typeface.json';

            var callbackOnSuccess = function () {
                scope.asyncDone = true;
            };
            scope.textStorage.loadListOfFonts(KSX.globals.basedir, listOfFonts, callbackOnSuccess);
        };

        scope.shader.loadResources(callbackOnShaderSuccess);
    };

    Home.prototype.initPreGL = function () {
        this.stats.showPanel(0);
        document.body.appendChild(this.stats.domElement);
    };

    Home.prototype.initGL = function () {
        if ( !this.platformVerification.verifyVertexShaderTextureAccess( this.renderer, true ) ) {
            this.initOk = false;
            return;
        }
        this.renderer.setClearColor(MAIN_CLEAR_COLOR);

        if ( !this.platformVerification.verifyHwInstancingSupport( this.renderer, false ) ) {
            this.useHwInstancing = false;
        }

        // init video texture and params
        this.videoBuffer.width = 1920;
        this.videoBuffer.height = 804;
        this.videoBufferContext.fillStyle = "#000000";
        this.videoBufferContext.fillRect(0, 0, 1920, 804);

        this.videoTexture = new THREE.Texture(this.videoBuffer);
        this.videoTexture.minFilter = THREE.LinearFilter;
        this.videoTexture.magFilter = THREE.LinearFilter;
        this.videoTexture.format = THREE.RGBFormat;

        initRtt( this, false );

        var material = this.shader.buildShaderMaterial();
//        material.wireframe = true;
        this.checkVideo(material);

        this.pixelBoxesGenerator = new KSX.apps.demos.home.PixelBoxesGenerator( KSX.globals.basedir );

        var dimension = {
            x: bowser.mobile ? 640 : 1920,
            y: bowser.mobile ? 268 : 804
        };
        if (this.useHwInstancing) {
            var meshInstance = this.pixelBoxesGenerator.buildInstanceBoxes(dimension, 1.0, this.shader);
            this.scenePerspective.scene.add(meshInstance);
        }
        else {
            this.superBoxPivot = new THREE.Object3D();
            this.superBoxGroup = new THREE.Group();
            this.superBoxGroup.translateX(-320);
            this.superBoxGroup.translateY(-180);
            this.superBoxPivot.add(this.superBoxGroup);
            this.scenePerspective.scene.add(this.superBoxPivot);

            this.shader.uniforms.useUvRange.value = false;
            this.shader.uniforms.scaleBox.value = 1.0;
            this.pixelBoxesGenerator.setObjGroup(this.superBoxGroup);
            this.pixelBoxesGenerator.setMaterial(material);
            this.pixelBoxesGenerator.buildSuperBoxSeries(dimension.x, dimension.y, 48, 30);
        }

        // init camera and bind to controls
        var camPos = new THREE.Vector3( 0.0, -dimension.y, dimension.x * 1.15 );
        this.scenePerspective.setCameraDefaults(camPos);
        this.controls = new THREE.TrackballControls(this.scenePerspective.camera);
    };

    var initRtt = function ( scope, showHelpers ) {

        // setup RTT
        var canvasRtt = new KSX.apps.core.Canvas( {
            offsetWidth: scope.videoBuffer.width,
            offsetHeight: scope.videoBuffer.height
        } );
        // manual init required
        scope.rtt = new KSX.apps.core.ThreeJsApp.ScenePerspective( canvasRtt );
        scope.rtt.showHelpers = showHelpers;
        scope.rtt.initGL();

        scope.rtt.setCameraDefaults( new THREE.Vector3( 0, 5, 20 ) );

        scope.rtt.lights = {
            ambientLight: new THREE.AmbientLight( 0x696856 ),
            directionalLight1: new THREE.DirectionalLight( 0xE0E0E0 ),
            directionalLight2: new THREE.DirectionalLight( 0x0000AA ),

        };
        scope.rtt.lights.directionalLight1.position.set(  10, 10, 10 );
        scope.rtt.lights.directionalLight2.position.set( -10, 5, 5 );

        scope.rtt.scene.add( scope.rtt.lights.ambientLight );
        scope.rtt.scene.add( scope.rtt.lights.directionalLight1 );
        scope.rtt.scene.add( scope.rtt.lights.directionalLight2 );

        scope.rtt.materials = {
            sphere: new THREE.MeshStandardMaterial({
                color: 0xFF0000
            }),
            cube: new THREE.MeshStandardMaterial({
                color: 0x00FF00
            }),
            text: new THREE.MeshStandardMaterial()
        };

        var textUnitWelcome = scope.textStorage.addText( 'Welcome', 'ubuntu_mono_regular', 'Welcome back to', scope.rtt.materials.text, 2, 10 );
        var textUnitDomain = scope.textStorage.addText( 'Domain', 'ubuntu_mono_regular', 'www.kaisalmen.de', scope.rtt.materials.text, 2, 10 );
        textUnitWelcome.mesh.position.set( -10, 3, 0 );
        textUnitDomain.mesh.position.set( -10, -3, 0 );

        scope.rtt.meshes = {
            sphere: new THREE.Mesh( new THREE.SphereBufferGeometry(1, 32, 32), scope.rtt.materials.sphere ),
            cube: new THREE.Mesh( new THREE.BoxBufferGeometry( 1, 1, 1), scope.rtt.materials.cube ),
            textWelcome: textUnitWelcome.mesh,
            textDomain: textUnitDomain.mesh,
            textPivot: new THREE.Object3D(),
            lightPivot: new THREE.Object3D(),
            gridHelper: new THREE.GridHelper(20, 1, 0xFF4444, 0x404040),
            helperLight1: new THREE.DirectionalLightHelper( scope.rtt.lights.directionalLight1, 2 ),
            helperLight2: new THREE.DirectionalLightHelper( scope.rtt.lights.directionalLight2, 2 )
        };

        scope.rtt.scene.add( scope.rtt.meshes.sphere );
        scope.rtt.scene.add( scope.rtt.meshes.cube );
        scope.rtt.meshes.textPivot.add( scope.rtt.meshes.textWelcome );
        scope.rtt.meshes.textPivot.add( scope.rtt.meshes.textDomain );
        scope.rtt.meshes.lightPivot.add( scope.rtt.lights.directionalLight1 );
        scope.rtt.meshes.lightPivot.add( scope.rtt.lights.directionalLight2 );

        scope.rtt.scene.add( scope.rtt.meshes.textPivot );
        scope.rtt.scene.add( scope.rtt.meshes.lightPivot );

        scope.rtt.scene.add( scope.rtt.meshes.gridHelper );
        scope.rtt.scene.add( scope.rtt.meshes.helperLight1 );
        scope.rtt.scene.add( scope.rtt.meshes.helperLight2 );

        scope.rtt.meshes.gridHelper.visible = scope.rtt.showHelpers;
        scope.rtt.meshes.helperLight1.visible = scope.rtt.showHelpers;
        scope.rtt.meshes.helperLight2.visible = scope.rtt.showHelpers;

        scope.rtt.texture = new THREE.WebGLRenderTarget(
            scope.rtt.canvas.getWidth(),
            scope.rtt.canvas.getHeight(),
            {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.NearestFilter,
                format: THREE.RGBFormat
            }
        );
        scope.shader.textures['rtt'] = scope.rtt.texture.texture;
        scope.rtt.animate = true;
    };

    Home.prototype.initPostGL = function () {
        var scope = this;
        var ui = scope.uiTools.ui;

        var adjustHeightFactor = function (value) {
            scope.shader.uniforms.heightFactor.value = value / 3;
        };
        var adjustBoxScale = function (value) {
            scope.shader.uniforms.scaleBox.value = value;
        };
        var invertShader = function (value) {
            scope.shader.uniforms.invert.value = value;
        };
        var resetView = function () {
            scope.scenePerspective.resetCamera();
            scope.controls.reset();
            scope.controls.target = scope.scenePerspective.cameraTarget;
            scope.superBoxPivot.rotation.y = 0;
        };
        var enableVideo = function ( enabled ) {
            scope.videoTextureEnabled = enabled;
            scope.checkVideo();
        };
        var animateRtt = function ( enabled ) {
            scope.rtt.animate = enabled;
        };
        var showHelpersRtt = function ( enabled ) {
            scope.rtt.showHelpers = enabled;
            scope.rtt.meshes.gridHelper.visible = enabled;
            scope.rtt.meshes.helperLight1.visible = enabled;
            scope.rtt.meshes.helperLight2.visible = enabled;
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
        if (scope.useHwInstancing) {
            ui.add('slide', {
                name: 'boxScale',
                callback: adjustBoxScale,
                min: 0.01,
                max: 0.99,
                value: scope.shader.uniforms.scaleBox.value,
                precision: 2,
                step: 0.01,
                width: scope.uiTools.paramsDimension.slidesWidth,
                height: scope.uiTools.paramsDimension.slidesHeight,
                stype: scope.uiTools.paramsDimension.sliderType
            });
        }
        ui.add('bool', {
            name: 'Invert',
            value: scope.shader.uniforms.invert.value,
            callback: invertShader,
            height: scope.uiTools.paramsDimension.boolHeight
        });

        var groupRtt = ui.add('group', {
            name: 'Render Target',
            height: scope.uiTools.paramsDimension.groupHeight
        });
        groupRtt.add('bool', {
            name: 'Animate',
            value: scope.rtt.animate,
            callback: animateRtt,
            height: scope.uiTools.paramsDimension.boolHeight
        });
        groupRtt.add('bool', {
            name: 'Show Helpers',
            value: scope.rtt.showHelpers,
            callback: showHelpersRtt,
            height: scope.uiTools.paramsDimension.boolHeight
        });
        groupRtt.open();

        ui.add('bool', {
            name: 'Enable Video',
            value: scope.videoTextureEnabled,
            callback: enableVideo,
            height: scope.uiTools.paramsDimension.boolHeight
        });
        var groupVideo = ui.add('group', {
            name: 'Video Control',
            height: scope.uiTools.paramsDimension.groupHeight
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
        ui.add('button', {
            name: 'Reset View',
            callback: resetView,
            width: scope.uiTools.paramsDimension.buttonWidth,
            height: scope.uiTools.paramsDimension.buttonHeight
        });

        return true;
    };

    Home.prototype.addEventHandlers = function () {
        var scope = this;

        var eatComplete =  function ( event ) {
            console.log( 'Received event "complete"!' );
            scope.renderingEnabled = true;
        };
        document.addEventListener( 'complete', eatComplete, false );
    };

    Home.prototype.resizeDisplayGL = function () {
        this.controls.handleResize();
    };

    Home.prototype.renderPre = function () {
        this.controls.update();

        if (this.videoTextureEnabled && this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
            this.videoBufferContext.drawImage(this.video, 0, 0);
            this.videoTexture.needsUpdate = true;
        }

        this.renderer.setClearColor(RTT_CLEAR_COLOR);
        if ( this.rtt.animate ) {
            this.rtt.meshes.sphere.position.set( 3 * Math.sin( this.frameNumber / 10 ), 0, 3 * Math.cos( this.frameNumber / 10 ) );
            this.rtt.meshes.lightPivot.rotateY( 0.01 );
//            this.rtt.camera.position.set( 10 * Math.sin( this.frameNumber / 50 ), 5, 10 * Math.cos( this.frameNumber / 50 ) );
            this.rtt.updateCamera();
        }
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
