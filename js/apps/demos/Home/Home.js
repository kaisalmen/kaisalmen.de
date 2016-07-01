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
    var RTT_CAM_HEIGHT = -3;
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
            useScenePerspective : true,
            useCube : true
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
        this.textureTools = new KSX.apps.tools.TextureTools();

        this.rtt = null;
        this.textStorage = new KSX.apps.tools.text.Text();
        this.textureCube = null;

        this.useHwInstancing = true;
        this.pixelBoxesGenerator = null;
    }

    Home.prototype.initAsyncContent = function() {
        var scope = this;

        var callbackOnTextSuccess = function () {
            var promises = [];
            var cubeBasePath = KSX.globals.basedir + '/resource/textures/meadow';
            var imageFileNames = [ 'posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg' ];
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
        this.renderer.autoClear = false;

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

        this.rtt = initRtt( this.videoBuffer.width, this.videoBuffer.height, this.textStorage, false, this.textureCube );
        this.shader.textures['rtt'] = this.rtt.texture.texture;

        var material = this.shader.buildShaderMaterial();
        this.checkVideo(material);

        this.pixelBoxesGenerator = new KSX.apps.demos.home.PixelBoxesGenerator( KSX.globals.basedir );

        var dimension = {
            x: bowser.mobile ? 640 : 1920,
            y: bowser.mobile ? 268 : 804
        };
        if (this.useHwInstancing) {
            var meshInstance = this.pixelBoxesGenerator.buildInstanceBoxes( dimension, this.shader );
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
        var defaults = {
            posCamera: new THREE.Vector3( 0.0, -dimension.y * 1.15, dimension.x * 1.15 ),
            far: 100000
        };
        this.scenePerspective.setCameraDefaults( defaults );
        this.controls = new THREE.TrackballControls(this.scenePerspective.camera);
    };

    var initRtt = function ( width, height, textStorage, showHelpers, textureCube ) {
        var canvasRtt = new KSX.apps.core.Canvas( {
            offsetWidth: width,
            offsetHeight: height
        } );

        var rtt = new KSX.apps.core.ThreeJsApp.ScenePerspective( canvasRtt );
        rtt.useCube = true;
        rtt.showHelpers = showHelpers;
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
            sphere: new THREE.MeshStandardMaterial({
                color: 0xFF0000,
                envMap: textureCube,
                envMapIntensity: 0.5,
                roughness: 0.1
            }),
            cube: new THREE.MeshStandardMaterial({
                color: 0x00FF00
            }),
            text: new THREE.MeshStandardMaterial({
                envMap: textureCube,
                envMapIntensity: 0.5,
                roughness: 0.1
            }),
            env: new THREE.MeshStandardMaterial({
                envMap: textureCube,
                envMapIntensity: 0.5,
                roughness: 0.1
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
            sphere: new THREE.Mesh( new THREE.SphereBufferGeometry( 2, 32, 32 ), rtt.materials.sphere ),
            cube: new THREE.Mesh( new THREE.BoxBufferGeometry( 2, 2, 2 ), rtt.materials.cube ),
            env: new THREE.Mesh( new THREE.SphereBufferGeometry( 1, 64, 64 ), rtt.materials.env ),
            envCube: new THREE.Mesh( new THREE.BoxGeometry( 10000, 10000, 10000 ), rtt.materials.envCube ),
            textWelcome: textUnitWelcome.mesh,
            textDomain: textUnitDomain.mesh,
            textPivot: new THREE.Object3D(),
            lightPivot: new THREE.Object3D(),
            gridHelper: new THREE.GridHelper(20, 1, 0xFF4444, 0x404040),
            helperLight1: new THREE.DirectionalLightHelper( rtt.lights.directionalLight1, 2 ),
            helperLight2: new THREE.DirectionalLightHelper( rtt.lights.directionalLight2, 2 )
        };

        rtt.scene.add( rtt.meshes.sphere );
        rtt.scene.add( rtt.meshes.cube );
        rtt.scene.add( rtt.meshes.env );
        rtt.meshes.env.position.set( -10, 0, 0 );
        rtt.sceneCube.add( rtt.meshes.envCube );

        rtt.meshes.textPivot.add( rtt.meshes.textWelcome );
        rtt.meshes.textPivot.add( rtt.meshes.textDomain );
        rtt.meshes.lightPivot.add( rtt.lights.directionalLight1 );
        rtt.meshes.lightPivot.add( rtt.lights.directionalLight2 );

        rtt.scene.add( rtt.meshes.textPivot );
        rtt.scene.add( rtt.meshes.lightPivot );

        rtt.scene.add( rtt.meshes.gridHelper );
        rtt.scene.add( rtt.meshes.helperLight1 );
        rtt.scene.add( rtt.meshes.helperLight2 );

        rtt.meshes.gridHelper.visible = rtt.showHelpers;
        rtt.meshes.helperLight1.visible = rtt.showHelpers;
        rtt.meshes.helperLight2.visible = rtt.showHelpers;

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
        var scope = this;
        var ui = scope.uiTools.ui;

        var adjustHeightFactor = function (value) {
            scope.shader.uniforms.heightFactor.value = value / 3;
        };
        var adjustBoxScale = function (value) {
            scope.shader.uniforms.scaleBox.value = value;
        };
        var adjustBoxSpacing = function (value) {
            scope.shader.uniforms.spacing.value = value;
        };
        var invertShader = function (value) {
            scope.shader.uniforms.invert.value = value;
        };
        var resetView = function () {
            scope.scenePerspective.resetCamera();
            scope.controls.reset();
            scope.controls.target = scope.scenePerspective.cameraTarget;
            if ( scope.superBoxPivot !== undefined ) {
                scope.superBoxPivot.rotation.y = 0;
            }
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

        ui.add('title', { name: ' ' } );
        ui.add('title', { name: 'Projection Space Controls' } );
        if (scope.useHwInstancing) {
            ui.add('slide', {
                name: 'Box Scale',
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
            ui.add('slide', {
                name: 'Box Spacing',
                callback: adjustBoxSpacing,
                min: 0.01,
                max: 10.0,
                value: scope.shader.uniforms.spacing.value,
                precision: 3,
                step: 0.01,
                width: scope.uiTools.paramsDimension.slidesWidth,
                height: scope.uiTools.paramsDimension.slidesHeight,
                stype: scope.uiTools.paramsDimension.sliderType
            });
        }
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
            value: scope.shader.uniforms.invert.value,
            callback: invertShader,
            height: scope.uiTools.paramsDimension.boolHeight
        });

        ui.add('title', { name: ' ' } );
        ui.add('title', { name: 'Render Target Controls' } );
        ui.add('bool', {
            name: 'Animate',
            value: scope.rtt.animate,
            callback: animateRtt,
            height: scope.uiTools.paramsDimension.boolHeight
        });
        ui.add('bool', {
            name: 'Show Helpers',
            value: scope.rtt.showHelpers,
            callback: showHelpersRtt,
            height: scope.uiTools.paramsDimension.boolHeight
        });

        ui.add('title', { name: ' ' } );
        ui.add('bool', {
            name: 'Enable Video',
            value: scope.videoTextureEnabled,
            callback: enableVideo,
            height: scope.uiTools.paramsDimension.boolHeight
        });
        var groupVideo = ui.add('group', {
            name: 'Video Controls',
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
        ui.add('title', { name: ' ' } );
        ui.add('title', { name: 'Global Controls' } );
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
            var spherePosFactor = 5.0;

            this.rtt.meshes.sphere.position.set(
                spherePosFactor * Math.sin( this.frameNumber / RTT_POS_DIVIDER ),
                0,
                spherePosFactor * Math.cos( this.frameNumber / RTT_POS_DIVIDER )
            );
            this.rtt.meshes.lightPivot.rotateY( RTT_ROTATION_SPEED );
            this.rtt.meshes.cube.rotateX( -RTT_ROTATION_SPEED );
            this.rtt.meshes.cube.rotateY( -RTT_ROTATION_SPEED );

            this.rtt.camera.position.set(
                -RTT_CAM_ORBIT * Math.sin( this.frameNumber / 100 ),
                RTT_CAM_HEIGHT,
                RTT_CAM_ORBIT * Math.cos( this.frameNumber / 100 )
            );

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
