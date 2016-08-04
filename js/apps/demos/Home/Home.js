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
            user : this,
            name : 'Home',
            htmlCanvas : elementToBindTo,
            renderers : {
                regular : {
                    canvas : elementToBindTo,
                    antialias : true
                }
            },
            useScenePerspective : true,
            useCube : true
        });

        this.video = elementNameVideo;
        this.videoBuffer = elementNameVideoBuffer;
        this.videoBufferContext = this.videoBuffer.getContext("2d");
        this.videoTexture = null;
        this.videoTextureEnabled = true;

        this.controls = null;

        var uiParams = {
            css: 'top: 0px; left: 0px;',
            width: 384,
            center: false,
            color: 'rgba(224, 224, 224, 1.0)',
            bg: 'rgba(40, 40, 40, 0.66)'
        };
        var paramsDimension = {
            desktop: {
                maxValue: 64.0
            },
            mobile : {
                maxValue: 64.0,
            }
        };
        this.mobileDevice = mobileDevice;
        this.uiTools = new KSX.apps.tools.UiTools( uiParams, paramsDimension, this.mobileDevice );

        this.stats = new Stats();
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.left = '';
        this.stats.domElement.style.right = '0px';
        this.stats.domElement.style.top = '';
        this.stats.domElement.style.bottom = '0px';

        this.textureTools = new KSX.apps.tools.TextureTools();

        this.rtt = null;
        this.textStorage = new KSX.apps.tools.text.Text();
        this.textureCube = null;

        this.projectionSpace = new KSX.apps.demos.ProjectionSpace();
        this.projectionSpace.resetProjectionSpace();

        this.cameraDefaults = {
            posCamera: new THREE.Vector3( 0.0, -1.15 * this.projectionSpace.currentDimension.y, 0.85 * this.projectionSpace.currentDimension.x ),
            far: 100000
        };
    }

    Home.prototype.initAsyncContent = function() {
        var scope = this;

        var callbackOnTextSuccess = function () {
            var promises = [];
            var cubeBasePath = KSX.globals.basedir + '/resource/textures/meadow1024';
            var imageFileNames = [ 'px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg' ];
            promises.push( scope.textureTools.loadTextureCube( cubeBasePath, imageFileNames ) );

            Promise.all(promises).then(
                function (results) {
                    scope.textureCube = results[0];
                    scope.asyncDone = true;
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

    Home.prototype.initPreGL = function () {
        this.uiTools.createFeedbackAreaDynamic();
        this.uiTools.announceFeedback( 'Initializing' );

        this.stats.showPanel(0);
        document.body.appendChild(this.stats.domElement);
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

        this.rtt = initRtt( this.projectionSpace.currentDimension.x, this.projectionSpace.currentDimension.y, this.textStorage, this.textureCube );
        this.projectionSpace.initGL( this.rtt.texture.texture, this.videoTexture );
        this.checkVideo();

        this.scenePerspective.scene.add( this.projectionSpace.currentDimension.mesh );
        this.uiTools.announceFeedback( this.projectionSpace.printStats() );

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
        rtt.animate = true;

        return rtt;
    };

    Home.prototype.initPostGL = function () {
        buildUi( this );
        if ( this.mobileDevice ) {
            alert( 'Performance of mobile GPUs is likely not adequate for this site!' );
        }
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
        this.stats.update();
    };

    Home.prototype.checkVideo = function () {
        if ( this.videoTextureEnabled ) {
            this.projectionSpace.flipTexture( 'video' );

            if ( this.rtt.animate ) {
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
    };

    Home.prototype.resizeProjectionSpace = function ( index, force, forcedIndex ) {
        if ( this.projectionSpace.index === index && !force ) {
            return false;
        }
        var temp = this.projectionSpace.dimensions[ force ? forcedIndex : this.projectionSpace.index];
        this.projectionSpace.index = index;
        this.projectionSpace.currentDimension = this.projectionSpace.dimensions[this.projectionSpace.index];

        this.scenePerspective.scene.remove( temp.mesh );
        this.scenePerspective.scene.add( this.projectionSpace.currentDimension.mesh );

        this.rtt.canvas.resetWidth( this.projectionSpace.currentDimension.x, this.projectionSpace.currentDimension.y );
        this.rtt.texture.setSize( this.projectionSpace.currentDimension.x, this.projectionSpace.currentDimension.y );

        this.uiTools.announceFeedback( this.projectionSpace.printStats() );
        this.projectionSpace.shader.uniforms.heightFactor.value = this.projectionSpace.currentDimension.defaultHeightFactor;

        this.cameraDefaults.posCamera = new THREE.Vector3( 0.0, -1.15 * this.projectionSpace.currentDimension.y, 0.85 * this.projectionSpace.currentDimension.x );
        this.scenePerspective.setCameraDefaults( this.cameraDefaults );

        return true;
    };

    Home.prototype.resetViewAndParameters = function () {
        var forcedIndex = this.projectionSpace.index;
        this.projectionSpace.resetProjectionSpace();
        this.resizeProjectionSpace( this.projectionSpace.index, true, forcedIndex );

        this.controls.reset();
        this.controls.target = this.scenePerspective.cameraTarget;

        this.rtt.animate = true;
        this.videoTextureEnabled = false;
        this.checkVideo();
    };

    var buildUi = function ( scope ) {
        var ui = scope.uiTools.ui;

        var resetExtrusionSlide = function ( value ) {
            var group = ui.uis[0];
            var slide = group.uis[0];
            slide.value = value;
            slide.update();
        };
        var resetInvertExtrusionBool = function ( value ) {
            var group = ui.uis[0];
            var bool = group.uis[1];
            bool.value = value;
            bool.update();
        };
        var resetBoxScaleSlide = function ( value ) {
            var group = ui.uis[0];
            var slide = group.uis[2];
            slide.value = value;
            slide.update();
        };
        var resetBoxSpacingSlide = function ( value ) {
            var group = ui.uis[0];
            var slide = group.uis[3];
            slide.value = value;
            slide.update();
        };
        var resetInstantCountSlide = function ( value ) {
            var group = ui.uis[0];
            var slide = group.uis[4];
            slide.value = value;
            slide.update();
        };
        var resetAnimateBool = function ( value ) {
            var group = ui.uis[0];
            var bool = group.uis[5];
            bool.value = value;
            bool.update();
        };
        var resetVideoBool = function ( value ) {
            var group = ui.uis[0];
            var bool = group.uis[6];
            bool.value = value;
            bool.update();
        };
        var resetViewAndParams = function () {
            scope.resetViewAndParameters();

            resetBoxScaleSlide( scope.projectionSpace.shader.uniforms.scaleBox.value );
            resetBoxSpacingSlide( scope.projectionSpace.shader.uniforms.spacing.value );
            resetExtrusionSlide( scope.currentDimension.defaultHeightFactor );
            resetInvertExtrusionBool(scope.projectionSpace.shader.uniforms.invert.value );
            resetInstantCountSlide( scope.currentDimension.index );
            resetAnimateBool( scope.rtt.animate );
            resetVideoBool( scope.videoTextureEnabled );
        };


        var adjustHeightFactor = function (value) {
            scope.projectionSpace.shader.uniforms.heightFactor.value = value;
        };
        var invertShader = function (value) {
            scope.projectionSpace.shader.uniforms.invert.value = value;
        };
        var adjustBoxScale = function (value) {
            scope.projectionSpace.shader.uniforms.scaleBox.value = value;
        };
        var adjustBoxSpacing = function (value) {
            scope.projectionSpace.shader.uniforms.spacing.value = value;
        };
        var adjustBoxCount = function ( value ) {
            if ( scope.resizeProjectionSpace( value, false, 0 ) ) {
                resetExtrusionSlide( scope.currentDimension.defaultHeightFactor );
            }
        };
        var animate = function ( enabled ) {
            scope.rtt.animate = enabled;
            scope.checkVideo();
        };
        var enableVideo = function ( enabled ) {
            scope.videoTextureEnabled = enabled;
            scope.checkVideo();
        };


        var groupMain = ui.add('group', {
            name: 'Projection Space Controls',
            height: scope.uiTools.paramsDimension.groupHeight
        });
        groupMain.add('slide', {
            name: 'Extrusion',
            callback: adjustHeightFactor,
            min: scope.uiTools.paramsDimension.minValue,
            max: scope.uiTools.paramsDimension.maxValue,
            value: scope.projectionSpace.shader.uniforms.heightFactor.value,
            precision: 1,
            step: 1,
            width: scope.uiTools.paramsDimension.slidesWidth,
            height: scope.uiTools.paramsDimension.slidesHeight,
            stype: scope.uiTools.paramsDimension.sliderType
        });
        groupMain.add('bool', {
            name: 'Invert Ext.',
            value: scope.projectionSpace.shader.uniforms.invert.value,
            callback: invertShader,
            height: scope.uiTools.paramsDimension.boolHeight
        });
        groupMain.add('slide', {
            name: 'Box Scale',
            callback: adjustBoxScale,
            min: 0.01,
            max: 1.0,
            value: scope.projectionSpace.shader.uniforms.scaleBox.value,
            precision: 2,
            step: 0.01,
            width: scope.uiTools.paramsDimension.slidesWidth,
            height: scope.uiTools.paramsDimension.slidesHeight,
            stype: scope.uiTools.paramsDimension.sliderType
        });
        groupMain.add('slide', {
            name: 'Box Spacing',
            callback: adjustBoxSpacing,
            min: 0.01,
            max: 10.0,
            value: scope.projectionSpace.shader.uniforms.spacing.value,
            precision: 3,
            step: 0.01,
            width: scope.uiTools.paramsDimension.slidesWidth,
            height: scope.uiTools.paramsDimension.slidesHeight,
            stype: scope.uiTools.paramsDimension.sliderType
        });
        groupMain.add('slide', {
            name: 'Instance Count',
            callback: adjustBoxCount,
            min: 0,
            max: 4,
            value: scope.projectionSpace.currentDimension.index,
            precision: 1,
            step: 1,
            width: scope.uiTools.paramsDimension.slidesWidth,
            height: scope.uiTools.paramsDimension.slidesHeight,
            stype: scope.uiTools.paramsDimension.sliderType
        });
        groupMain.add('bool', {
            name: 'Animate/Play',
            value: scope.rtt.animate,
            callback: animate,
            height: scope.uiTools.paramsDimension.boolHeight
        });
        groupMain.add('bool', {
            name: 'Enable Video',
            value: scope.videoTextureEnabled,
            callback: enableVideo,
            height: scope.uiTools.paramsDimension.boolHeight
        });
        groupMain.open();
        ui.add('button', {
            name: 'Reset View and Parameters',
            callback: resetViewAndParams,
            width: scope.uiTools.paramsDimension.buttonWidth,
            height: scope.uiTools.paramsDimension.buttonHeight
        });

    };

    return Home;
})();
