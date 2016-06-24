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

    Intermediate.prototype.initGL = function () {
        if ( !this.verifyHwInstancingSupport( true ) ) {
            return;
        }

        var camDefaultPos = new THREE.Vector3( 0, 0, 1000 );
        this.scenePerspective.setCameraDefaults( camDefaultPos );
        this.controls = new THREE.TrackballControls(this.scenePerspective.camera);


        var material = new THREE.MeshBasicMaterial();
        var text = this.textStorage.addText('Test', 'ubuntu_mono_regular', 'www.kaisalmen.de is under reconstruction!', material, 50, 10);
        text.mesh.position.set( -700.0, 0.0, 0.0 );
        this.sceneOrtho.scene.add( text.mesh );

        
        this.pixelBoxesGenerator = new KSX.apps.demos.home.PixelBoxesGenerator( KSX.globals.basedir );

        var dimension = {
            x: bowser.mobile ? 1024 : 512,
            y: bowser.mobile ? 1024 : 512
        };

        var meshInstance = this.pixelBoxesGenerator.buildInstanceBoxes( dimension, 2.0, this.shader );
        this.scenePerspective.scene.add( meshInstance );
    };

    Intermediate.prototype.resizeDisplayGL = function () {
        this.controls.handleResize();
    };

    Intermediate.prototype.renderPre = function () {
        this.controls.update();
    };

    return Intermediate;
})();