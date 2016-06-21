/**
 * @author Kai Salmen / www.kaisalmen.de
 */

'use strict';

if (KSX.apps.demos.home === undefined) {
    KSX.apps.demos.home = {};
}

KSX.apps.demos.home.Intermediate = (function () {

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

        var camera = this.scenePerspective.camera;
        camera.position.set( 0, 0, 10 );

        var material = new THREE.MeshBasicMaterial();
        var text = this.textStorage.addText('Test', 'ubuntu_mono_regular', 'www.kaisalmen.de is under reconstruction!', material, 50, 10);
        text.mesh.position.set( -700.0, 0.0, 0.0 );
        this.sceneOrtho.scene.add( text.mesh );


        var geometry = new THREE.InstancedBufferGeometry();
        geometry.copy( new THREE.BoxBufferGeometry( 1, 1, 1 ) );

        var objectCount = 12;
        var offsets = new THREE.InstancedBufferAttribute( new Float32Array( objectCount * 3 ), 3, 1 );
        var a = 0;
        for ( var i = 0; i < offsets.count; i++ ) {
            offsets.setXYZ( i, a * 0.25, a * 0.1, a * 0.1 );
            a++;
        }
        geometry.addAttribute( 'offset', offsets );

        var shaderMaterial = this.shader.buildShaderMaterial();
        var meshInstances = new THREE.Mesh( geometry, shaderMaterial );
        this.scenePerspective.scene.add( meshInstances );
    };

    return Intermediate;
})();