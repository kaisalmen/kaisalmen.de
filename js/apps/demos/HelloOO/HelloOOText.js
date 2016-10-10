/**
 * @author Kai Salmen / www.kaisalmen.de
 */

'use strict';

KSX.apps.demos.HelloOOText = (function () {

    HelloOOText.prototype = Object.create(KSX.apps.core.ThreeJsApp.prototype, {
        constructor: {
            configurable: true,
            enumerable: true,
            value: HelloOOText,
            writable: true
        }
    });

    function HelloOOText(elementToBindTo) {
        KSX.apps.core.ThreeJsApp.call(this);

        this.configure({
            name: 'HelloOOText',
            htmlCanvas: elementToBindTo,
            useScenePerspective: true
        });

        this.textStorage = new KSX.apps.tools.text.Text();
    }

    HelloOOText.prototype.initPreGL = function() {
        var scope = this;
        var listOfFonts = [];
        listOfFonts['ubuntu_mono_regular'] = 'resource/fonts/ubuntu_mono_regular.json';
        listOfFonts['droid_sans_mono_regular'] = 'resource/fonts/droid_sans_mono_regular.typeface.json';

        var callbackOnSuccess = function () {
            scope.asyncDone = true;
        };
        scope.textStorage.loadListOfFonts(KSX.globals.basedir, listOfFonts, callbackOnSuccess);
    };

    HelloOOText.prototype.initGL = function () {
        var cameraDefaults = {
            posCamera: new THREE.Vector3( 0.0, 0.0, 250.0 ),
        };
        this.scenePerspective.setCameraDefaults( cameraDefaults );

        var geometry = new THREE.BoxGeometry(1, 2, 1);
        var material = new THREE.MeshNormalMaterial();
        this.mesh = new THREE.Mesh(geometry, material);

        this.scenePerspective.scene.add(this.mesh);
        this.scenePerspective.camera.position.z = 5;

        var text = this.textStorage.addText('Hello', 'droid_sans_mono_regular', 'Hello world. This text fills the line as much as possible!', new THREE.MeshBasicMaterial(), 0.1, 10);
        text.mesh.position.set(-3, 0.25, 0);
        var textUbuntu = this.textStorage.addText('Test', 'ubuntu_mono_regular', 'This is the Ubuntu font.', new THREE.MeshBasicMaterial(), 0.1, 10);
        textUbuntu.mesh.position.set(-3, -0.25, 0);
        this.scenePerspective.scene.add(text.mesh);
        this.scenePerspective.scene.add(textUbuntu.mesh);
    };

    HelloOOText.prototype.renderPre = function () {
        this.mesh.rotation.x += 0.02;
        this.mesh.rotation.y += 0.02;
    };

    return HelloOOText;
})();