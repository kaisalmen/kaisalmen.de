/**
 * @author Kai Salmen / www.kaisalmen.de
 */

'use strict';

if (KSX.apps.demos.home === undefined) {
    KSX.apps.demos.home = {};
}

KSX.apps.demos.home.Intermediate = (function () {

    var TWO_TIMES_PI = 2 * Math.PI;

    Intermediate.prototype = Object.create(KSX.apps.core.ThreeJsApp.prototype, {
        constructor: {
            configurable: true,
            enumerable: true,
            value: Intermediate,
            writable: true
        }
    });

    function Intermediate(elementToBindTo) {
        KSX.apps.core.ThreeJsApp.call(this);

        this.configure({
            user : this,
            name : 'Intermediate',
            htmlCanvas : elementToBindTo,
            useScenePerspective : true,
            useSceneOrtho : true
        });

        this.textStorage = new KSX.apps.tools.text.Text();
        this.shader = new KSX.apps.shader.BoxInstancesShader();
        this.controls = null;

        this.pixelBoxesGenerator = null;
        this.meshes = {
            pixels: null,
            text: null
        }

        this.stats = new Stats();
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.left = '';
        this.stats.domElement.style.right = '0px';
        this.stats.domElement.style.top = '0px';
    }

    Intermediate.prototype.initAsyncContent = function() {
        var scope = this;

        var callbackOnShaderSuccess = function () {
            var listOfFonts = [];
            listOfFonts['ubuntu_mono_regular'] = 'resource/fonts/ubuntu_mono_regular.json';

            var callbackOnSuccess = function () {
                scope.asyncDone = true;
            };
            scope.textStorage.loadListOfFonts(KSX.globals.basedir, listOfFonts, callbackOnSuccess);
        };

        scope.shader.loadResources(callbackOnShaderSuccess);
    };

    Intermediate.prototype.initPreGL = function () {
        this.stats.showPanel(0);
        document.body.appendChild(this.stats.domElement);
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

        var camDefaultPos = new THREE.Vector3( 0, -1800, 1400 );
        this.scenePerspective.setCameraDefaults( camDefaultPos );
        this.controls = new THREE.TrackballControls(this.scenePerspective.camera);

        this.superBoxPivot = new THREE.Object3D();

        var material = new THREE.MeshBasicMaterial();
        this.meshes.text = this.textStorage.addText('Test', 'ubuntu_mono_regular', 'www.kaisalmen.de is under reconstruction!', material, 50, 10);
        this.meshes.text.mesh.position.set( -700.0, -500, 0.0 );
        this.superBoxPivot.add( this.meshes.text.mesh );

        this.pixelBoxesGenerator = new KSX.apps.demos.home.PixelBoxesGenerator( KSX.globals.basedir );
        var dimension = {
            x: 120,
            y: 68
        };
        this.meshes.pixels = this.pixelBoxesGenerator.buildInstanceBoxes( dimension, 12.0, this.shader );
        this.superBoxPivot.add( this.meshes.pixels );

        this.scenePerspective.scene.add( this.superBoxPivot );
    };

    Intermediate.prototype.resizeDisplayGL = function () {
        this.controls.handleResize();
    };

    Intermediate.prototype.renderPost = function () {
        this.stats.update();
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