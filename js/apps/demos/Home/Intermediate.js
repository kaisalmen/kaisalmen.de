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

        this.mesh3d = null;
        this.textStorage = new KSX.apps.tools.text.Text();
    }

    Intermediate.prototype.initAsyncContent = function() {
        var scope = this;
        var listOfFonts = [];
        listOfFonts['ubuntu_mono_regular'] = 'resource/fonts/ubuntu_mono_regular.json';

        var callbackOnSuccess = function () {
            scope.asyncDone = true;
        };
        scope.textStorage.loadListOfFonts(KSX.globals.basedir, listOfFonts, callbackOnSuccess);
    };

    Intermediate.prototype.initGL = function () {
        var camera = this.scenePerspective.camera;
        camera.position.set( 0, 0, 10 );

        var geometry = new THREE.BoxGeometry(1, 2, 1);
        var material = new THREE.MeshNormalMaterial();
        this.mesh3d = new THREE.Mesh(geometry, material);
        this.scenePerspective.scene.add( this.mesh3d );

        var text = this.textStorage.addText('Test', 'ubuntu_mono_regular', 'www.kaisalmen.de is under reconstruction!', new THREE.MeshBasicMaterial(), 50, 10);
        text.mesh.position.set( -700.0, 0.0, 0.0 );
        this.sceneOrtho.scene.add( text.mesh );
/*
        var geometry = new THREE.PlaneGeometry(10, 10, 1, 1);
        var material = new THREE.MeshNormalMaterial();
        var mesh2d =  new THREE.Mesh(geometry, material);
        this.sceneOrtho.scene.add( mesh2d );
*/
    };

    Intermediate.prototype.renderPre = function () {
        this.mesh3d.rotation.x += 0.02;
        this.mesh3d.rotation.y += 0.02;
    };

    return Intermediate;
})();