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

        var pixelBoxesBuilder = new KSX.apps.demos.home.PixelBoxesBuilder( KSX.globals.basedir, material, null );
        var boxBuildParams = {
            count : 0,
            cubeDimension : 1.0,
            xOffset : 0.0,
            yOffset : 0.0,
            zOffset : 0.0,
            uvLocalMinU : 0.0,
            uvLocalMaxU : 1.0,
            uvLocalMinV : 0.0,
            uvLocalMaxV : 1.0,
            vertices : [],
            normals : [],
            uvs : [],
            useIndices : true,
            indices : []
        };
        var singleBoxBufferGeometry = pixelBoxesBuilder.buildSingleBox( boxBuildParams );

        var geometry = new THREE.InstancedBufferGeometry();
        //geometry.copy( new THREE.BoxBufferGeometry( 1, 1, 1 ) );
        geometry.copy( singleBoxBufferGeometry );

        var dim = {
            x: 1920,
            y: 1080
        };
        var objectCount = dim.x * dim.y;
        var offsets = new THREE.InstancedBufferAttribute( new Float32Array( objectCount * 3 ), 3, 1 );
        var x = -dim.x / 2.0;
        var y = -dim.y / 2.0;

        var uvRanges = new THREE.InstancedBufferAttribute( new Float32Array( objectCount * 2 ), 2, 1 );
        var incU = 1.0 / dim.x;
        var incV = 1.0 / dim.y;
        this.shader.uniforms.uvScaleU.value = incU;
        this.shader.uniforms.uvScaleV.value = incV;
        var uRange = 0.0;
        var vRange = 0.0;
        var index = 0;

        var runX = 0;
        var runY = 0;
        while ( runY < dim.y ) {
            while ( runX < dim.x ) {
                offsets.setXYZ( index, x, y, 0 );
                uvRanges.setXY( index, uRange, vRange );
                index++;

                runX++;
                x += 1.0;

                uRange += incU;
            }
            runY++;
            runX = 0;

            x = -dim.x / 2.0;
            y += 1.0;

            uRange = 0.0;
            vRange += incV;
        }
        geometry.addAttribute( 'offset', offsets );
        geometry.addAttribute( 'uvRange', uvRanges );

        var shaderMaterial = this.shader.buildShaderMaterial();
        var meshInstances = new THREE.Mesh( geometry, shaderMaterial );
        this.scenePerspective.scene.add( meshInstances );
    };

    Intermediate.prototype.resizeDisplayGL = function () {
        this.controls.handleResize();
    };

    Intermediate.prototype.renderPre = function () {
        this.controls.update();
    };

    return Intermediate;
})();