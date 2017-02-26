/**
 * @author Kai Salmen / www.kaisalmen.de
 */

'use strict';

if (KSX.apps.demos.home === undefined) {
    KSX.apps.demos.home = {};
}

KSX.apps.demos.home.Main = (function () {

    var MAIN_CLEAR_COLOR = 0x101010;
    var RTT_CLEAR_COLOR = 0x0B0B0B;
    var RTT_CAM_HEIGHT = -2.5;
    var RTT_CAM_ORBIT = 16;
    var RTT_POS_DIVIDER = 50;
    var RTT_ROTATION_SPEED = 0.01;

    Home.prototype = Object.create(KSX.apps.core.ThreeJsApp.prototype, {
        constructor: {
            configurable: true,
            enumerable: true,
            value: Home,
            writable: true
        }
    });

    function Home( elementToBindTo, elementNameVideo, elementNameVideoBuffer, mobileDevice ) {
        KSX.apps.core.ThreeJsApp.call(this);

        this.configure({
            name: 'Home',
            htmlCanvas: elementToBindTo,
            renderers: {
                regular: {
                    canvas: elementToBindTo,
                    antialias: true
                }
            },
            useScenePerspective: true,
            useCube: true
        });
        this.platformVerification = new KSX.apps.core.PlatformVerification();
        this.mobileDevice = mobileDevice;

        this.video = elementNameVideo;
        this.videoBuffer = elementNameVideoBuffer;
        this.videoBufferContext = this.videoBuffer.getContext("2d");
        this.videoTexture = null;

        this.controls = null;
        this.textureTools = new KSX.apps.tools.TextureTools();
        this.rtt = null;

        this.textStorage = new KSX.apps.tools.text.Text();
        this.textureCube = null;

        this.projectionSpace = new KSX.apps.demos.ProjectionSpace({
            low: { index: 0, name: 'Low', x: 240, y: 100, defaultHeightFactor: 15, mesh: null },
            medium: { index: 1, name: 'Medium', x: 720, y: 302, defaultHeightFactor: 20, mesh: null },
            high: { index: 2, name: 'High', x: 1280, y: 536, defaultHeightFactor: 25, mesh: null },
            extreme: { index: 3, name: 'Extreme', x: 1920, y: 804, defaultHeightFactor: 30, mesh: null },
            insane: { index: 4, name: 'Insane', x: 3840, y: 1608, defaultHeightFactor: 35, mesh: null }
        }, 0);

        var scope = this;
        this.uiModel = {
            videoTextureEnabled: false,
            animate: true,
            projectionSpace: scope.projectionSpace,
            callbacks: {
                resetViewAndParameters: function () { scope.resetViewAndParameters() },
                resizeProjectionSpace: function ( index, force ) {
                    scope.resizeProjectionSpace( index, force );
                },
                checkVideo: function () { scope.checkVideo() }
            }
        };
        this.homeUi = new KSX.apps.demos.home.Ui( this.mobileDevice, this.uiModel );

        this.cameraDefaults = {
            posCamera: new THREE.Vector3( 0.0, -1.15 * this.projectionSpace.getHeight(), 0.85 * this.projectionSpace.getWidth() ),
            far: 100000
        };
    }

    Home.prototype.initPreGL = function() {
        var scope = this;

        scope.homeUi.initPreGL();

        var callbackOnTextSuccess = function () {
            var promises = [];
            var cubeBasePath = KSX.globals.basedir + '/resource/textures/meadow';
            promises.push( scope.textureTools.loadTextureCube( cubeBasePath ) );

            Promise.all(promises).then(
                function (results) {
                    scope.textureCube = results[0];
                    scope.preloadDone = true;
                }
            ).catch(
                function (error) {
                    console.log('The following error occurred: ', error);
                }
            );
        };

        var callbackOnShaderSuccess = function () {
            var listOfFonts = [];
            listOfFonts['droid_sans_mono_regular'] = 'resource/fonts/droid_sans_mono_regular.typeface.json';

            scope.textStorage.loadListOfFonts(KSX.globals.basedir, listOfFonts, callbackOnTextSuccess);
        };

        scope.projectionSpace.loadAsyncResources( callbackOnShaderSuccess );
    };

    Home.prototype.initGL = function () {
        if ( !this.platformVerification.verifyVertexShaderTextureAccess( this.renderer, true ) ) {
            this.initOk = false;
            return;
        }
        if ( !this.platformVerification.verifyHwInstancingSupport( this.renderer, true ) ) {
            this.initOk = false;
            return;
        }

        this.renderer.setClearColor(MAIN_CLEAR_COLOR);
        this.renderer.autoClear = false;

        // init video texture and params
        this.videoBuffer.width = 1920;
        this.videoBuffer.height = 804;
        this.videoBufferContext.fillStyle = "#000000";
        this.videoBufferContext.fillRect(0, 0, 1920, 804);

        this.videoTexture = new THREE.Texture(this.videoBuffer);
        this.videoTexture.minFilter = THREE.LinearFilter;
        this.videoTexture.magFilter = THREE.LinearFilter;
        this.videoTexture.format = THREE.RGBFormat;

        this.rtt = initRtt( this.projectionSpace.getWidth(), this.projectionSpace.getHeight(), this.textStorage, this.textureCube );
        this.projectionSpace.initGL();
        this.projectionSpace.shader.textures['rtt'] = this.rtt.texture.texture;
        this.projectionSpace.shader.textures['video'] = this.videoTexture;

        this.resizeProjectionSpace( this.mobileDevice ? 0 : 1, true );
        this.scenePerspective.scene.add( this.projectionSpace.pivot );
        this.checkVideo();

        this.homeUi.announceFeedback( this.projectionSpace.printStats() );

        // init camera and bind to controls
        this.scenePerspective.setCameraDefaults( this.cameraDefaults );
        this.controls = new THREE.TrackballControls( this.scenePerspective.camera );
    };

    var initRtt = function ( width, height, textStorage, textureCube ) {
        var canvasRtt = new KSX.apps.core.Canvas( {
            offsetWidth: width,
            offsetHeight: height
        } );

        var rtt = new KSX.apps.core.ThreeJsApp.ScenePerspective( canvasRtt );
        rtt.useCube = true;
        rtt.count = 0;
        // manual init required
        rtt.initGL();

        var defaults = {
            posCamera: new THREE.Vector3( 0, RTT_CAM_HEIGHT, RTT_CAM_ORBIT )
        };
        rtt.setCameraDefaults( defaults );

        rtt.lights = {
            ambientLight: new THREE.AmbientLight( 0x696856 ),
            directionalLight1: new THREE.DirectionalLight( 0xE0E0E0 ),
            directionalLight2: new THREE.DirectionalLight( 0x0000AA )
        };
        rtt.lights.directionalLight1.position.set(  10, 10, 10 );
        rtt.lights.directionalLight2.position.set( -10, 5, 5 );

        rtt.scene.add( rtt.lights.ambientLight );
        rtt.scene.add( rtt.lights.directionalLight1 );
        rtt.scene.add( rtt.lights.directionalLight2 );

        // Skybox shader
        var skyboxShader = THREE.ShaderLib[ "cube" ];
        skyboxShader.uniforms[ "tCube" ].value = textureCube;

        rtt.materials = {
            sphereRed: new THREE.MeshStandardMaterial({
                color: 0xFF0000,
                envMap: textureCube,
                envMapIntensity: 0.33,
                roughness: 0.4,
                metalness: 0.66
            }),
            sphereYellow: new THREE.MeshStandardMaterial({
                color: 0xFFFF00,
                envMap: textureCube,
                envMapIntensity: 0.5,
                roughness: 0.1,
                metalness: 0.9
            }),
            boxCenter: new THREE.MeshStandardMaterial({
                color: 0x00FF00,
                envMap: textureCube,
                envMapIntensity: 0.66
            }),
            text: new THREE.MeshStandardMaterial({
                envMap: textureCube,
                envMapIntensity: 0.75,
                metalness: 1.0
            }),
            envCube: new THREE.ShaderMaterial({
                fragmentShader: skyboxShader.fragmentShader,
                vertexShader: skyboxShader.vertexShader,
                uniforms: skyboxShader.uniforms,
                depthWrite: false,
                side: THREE.BackSide
            })
        };

        var textUnitWelcome = textStorage.addText( 'Welcome', 'droid_sans_mono_regular', 'Welcome back to', rtt.materials.text, 1.5, 10, 1, 0.1 );
        var textUnitDomain = textStorage.addText( 'Domain', 'droid_sans_mono_regular', 'www.kaisalmen.de', rtt.materials.text, 1.5, 10, 1, 0.1 );
        textUnitWelcome.mesh.position.set( -10, 4, 0 );
        textUnitDomain.mesh.position.set( -10, -5, 0 );

        rtt.meshes = {
            sphereRed: new THREE.Mesh( new THREE.SphereBufferGeometry( 2, 32, 32 ), rtt.materials.sphereRed ),
            sphereYellow: new THREE.Mesh( new THREE.SphereBufferGeometry( 1, 64, 64 ), rtt.materials.sphereYellow ),
            boxCenter: new THREE.Mesh( new THREE.BoxBufferGeometry( 2, 2, 2 ), rtt.materials.boxCenter ),
            envCube: new THREE.Mesh( new THREE.BoxGeometry( 10000, 10000, 10000 ), rtt.materials.envCube ),
            textWelcome: textUnitWelcome.mesh,
            textDomain: textUnitDomain.mesh,
            textPivot: new THREE.Object3D(),
            sphereYellowPivot: new THREE.Object3D(),
            lightPivot: new THREE.Object3D(),
        };

        rtt.scene.add( rtt.meshes.sphereRed );
        rtt.scene.add( rtt.meshes.boxCenter );
        rtt.meshes.sphereYellow.position.set( -12, 0, 0 );
        rtt.meshes.sphereYellowPivot.add( rtt.meshes.sphereYellow );
        rtt.scene.add( rtt.meshes.sphereYellowPivot );
        rtt.meshes.sphereYellowPivot.rotateZ( Math.PI / 9 );
        rtt.sceneCube.add( rtt.meshes.envCube );

        rtt.meshes.textPivot.add( rtt.meshes.textWelcome );
        rtt.meshes.textPivot.add( rtt.meshes.textDomain );
        rtt.meshes.lightPivot.add( rtt.lights.directionalLight1 );
        rtt.meshes.lightPivot.add( rtt.lights.directionalLight2 );

        rtt.scene.add( rtt.meshes.textPivot );
        rtt.scene.add( rtt.meshes.lightPivot );

        rtt.texture = new THREE.WebGLRenderTarget(
            rtt.canvas.getWidth(),
            rtt.canvas.getHeight(),
            {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.NearestFilter,
                format: THREE.RGBFormat
            }
        );

        return rtt;
    };

    Home.prototype.initPostGL = function () {
        var scope = this;
        scope.homeUi.buildUi();

        if ( scope.mobileDevice ) {

            alert( 'Performance of mobile GPUs is likely not adequate for this site!' );

        }
        return true;
    };

    Home.prototype.resizeDisplayGL = function () {
        this.controls.handleResize();
    };

    Home.prototype.renderPre = function () {
        this.controls.update();

        if (this.uiModel.videoTextureEnabled && this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
            this.videoBufferContext.drawImage(this.video, 0, 0);
            this.videoTexture.needsUpdate = true;
        }

        this.renderer.setClearColor(RTT_CLEAR_COLOR);
        if ( this.uiModel.animate ) {
            var spherePosFactor = 5.0;

            this.rtt.meshes.sphereRed.position.set(
                spherePosFactor * Math.sin( this.rtt.count / RTT_POS_DIVIDER ),
                0,
                spherePosFactor * Math.cos( this.rtt.count / RTT_POS_DIVIDER )
            );
            this.rtt.meshes.lightPivot.rotateY( RTT_ROTATION_SPEED );
            this.rtt.meshes.boxCenter.rotateX( -RTT_ROTATION_SPEED );
            this.rtt.meshes.boxCenter.rotateY( -RTT_ROTATION_SPEED );

            this.rtt.meshes.sphereYellowPivot.rotateY( - 2 * RTT_ROTATION_SPEED );

            this.rtt.camera.position.set(
                -RTT_CAM_ORBIT * Math.sin( this.rtt.count / 100 ),
                RTT_CAM_HEIGHT,
                RTT_CAM_ORBIT * Math.cos( this.rtt.count / 100 )
            );

            this.rtt.count++;
            this.rtt.updateCamera();
        }

        this.rtt.cameraCube.rotation.copy( this.rtt.camera.rotation );
        this.renderer.render( this.rtt.sceneCube, this.rtt.cameraCube, this.rtt.texture, true );
        this.renderer.render( this.rtt.scene, this.rtt.camera, this.rtt.texture, false );
        this.renderer.setClearColor(MAIN_CLEAR_COLOR);
    };

    Home.prototype.renderPost = function () {
        this.homeUi.render();
    };

    Home.prototype.checkVideo = function () {
        if ( this.uiModel.videoTextureEnabled ) {
            this.projectionSpace.flipTexture( 'video' );

            if ( this.uiModel.animate ) {
                this.video.play();
            }
            else {
                this.video.pause();
            }
        }
        else {
            this.projectionSpace.flipTexture( 'rtt' );

            if ( !this.video.paused ) {
                this.video.pause();
            }
        }
//        this.projectionSpace.flipTexture( 'linkPixelProtest' );
    };

    Home.prototype.resizeProjectionSpace = function ( index, force ) {
        var success = true;
        if ( index === this.projectionSpace.index ) {
            success = false;
        }
        if ( force ) {
            this.projectionSpace.resetProjectionSpace( index );
            success = true;
        }

        if ( success ) {
            this.projectionSpace.switchDimensionMesh( index );

            this.rtt.canvas.resetWidth( this.projectionSpace.getWidth(), this.projectionSpace.getHeight() );
            this.rtt.texture.setSize( this.projectionSpace.getWidth(), this.projectionSpace.getHeight() );

            this.homeUi.announceFeedback( this.projectionSpace.printStats() );

            this.cameraDefaults.posCamera = new THREE.Vector3( 0.0, -1.15 * this.projectionSpace.getHeight(), 0.85 * this.projectionSpace.getWidth() );
            this.scenePerspective.setCameraDefaults( this.cameraDefaults );
        }

        return success;
    };

    Home.prototype.resetViewAndParameters = function () {
        this.resizeProjectionSpace( this.mobileDevice ? 0 : 1, true );

        this.controls.reset();
        this.controls.target = this.scenePerspective.cameraTarget;

        this.uiModel.animate = true;
        this.uiModel.videoTextureEnabled = false;
        this.checkVideo();
    };

    return Home;
})();
