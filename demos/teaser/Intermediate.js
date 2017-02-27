/**
 * @author Kai Salmen / www.kaisalmen.de
 */

'use strict';

if (KSX.demos.home === undefined) {
    KSX.demos.home = {};
}

KSX.demos.home.Intermediate = (function () {

    Intermediate.prototype = Object.create(KSX.core.ThreeJsApp.prototype, {
        constructor: {
            configurable: true,
            enumerable: true,
            value: Intermediate,
            writable: true
        }
    });

    function Intermediate(elementToBindTo) {
        KSX.core.ThreeJsApp.call(this);

        this.configure({
            name: 'Intermediate',
            htmlCanvas: elementToBindTo,
            useScenePerspective: true,
        });
        this.platformVerification = new KSX.core.PlatformVerification();

        this.textStorage = new KSX.tools.text.Text();
        this.shader = new KSX.shader.BlockShader();
        this.controls = null;

        this.pixelBoxesGenerator = null;
        this.meshes = {
            pixels: null,
            text: null
        };

        var uiToolsConfig = {
            useUil: false,
            useStats: true
        };
        this.uiTools = new KSX.tools.UiTools( uiToolsConfig );
    }

    Intermediate.prototype.initPreGL = function() {
        var scope = this;

        scope.uiTools.enableStats();

        var callbackOnShaderSuccess = function () {
            var listOfFonts = [];
            listOfFonts['ubuntu_mono_regular'] = 'resource/fonts/ubuntu_mono_regular.json';

            var callbackOnSuccess = function () {
                scope.preloadDone = true;
            };
            scope.textStorage.loadListOfFonts(KSX.globals.basedir, listOfFonts, callbackOnSuccess);
        };

        scope.shader.loadResources( true, callbackOnShaderSuccess );
    };

    Intermediate.prototype.initGL = function () {
        if ( !this.platformVerification.verifyVertexShaderTextureAccess( this.renderer, true ) ) {
            this.initOk = false;
            return;
        }
        if ( !this.platformVerification.verifyHwInstancingSupport( this.renderer, true ) ) {
            this.initOk = false;
            return;
        }

        var defaults = {
            posCamera: new THREE.Vector3( 0, -1800, 1400 )
        };
        this.scenePerspective.setCameraDefaults( defaults );

        this.controls = new THREE.TrackballControls(this.scenePerspective.camera);

        this.superBoxPivot = new THREE.Object3D();

        var material = new THREE.MeshBasicMaterial();
        this.meshes.text = this.textStorage.addText('Test', 'ubuntu_mono_regular', 'www.kaisalmen.de is under reconstruction!', material, 50, 10);
        this.meshes.text.mesh.position.set( -700.0, -500, 0.0 );
        this.superBoxPivot.add( this.meshes.text.mesh );

        var dimension = { name: 'custom', x: 120, y: 68, defaultHeightFactor: 12.0, mesh: null };
        var shaderMaterial = this.shader.buildShaderMaterial();
        this.shader.uniforms.texture1.value = this.shader.textures['pixelProtestImage'];
        this.shader.uniforms.spacing.value = dimension.defaultHeightFactor;
        this.shader.uniforms.scaleBox.value = 3.0;

        this.pixelBoxesGenerator = new KSX.instancing.PixelBoxesGenerator( KSX.globals.basedir );
        this.pixelBoxesGenerator.buildInstanceBoxes( dimension, shaderMaterial );
        this.meshes.pixels = dimension.mesh;

        this.superBoxPivot.add( this.meshes.pixels );
        this.scenePerspective.scene.add( this.superBoxPivot );
    };

    Intermediate.prototype.resizeDisplayGL = function () {
        this.controls.handleResize();
    };

    Intermediate.prototype.renderPost = function () {
        this.uiTools.updateStats();
    };

    Intermediate.prototype.renderPre = function () {
        this.controls.update();
        this.superBoxPivot.rotation.z += 0.001;
        if (this.frameNumber % 60 === 0) {

            var getRandomArbitrary = function (min, max) {
                return Math.random() * (max - min) + min;
            };
            this.shader.uniforms.uvRandom.value = getRandomArbitrary(0.66, 1.0);
            this.shader.uniforms.heightFactor.value = getRandomArbitrary(12, 24);
        }
    };

    return Intermediate;
})();