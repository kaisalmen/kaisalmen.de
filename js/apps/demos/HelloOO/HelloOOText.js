/**
 * Created by Kai Salmen.
 */

"use strict";

KSX.apps.demos.HelloOOText = (function () {

    function HelloOOText(elementToBindTo) {
        var userDefinition = {
            user : this,
            name : 'HelloOOText',
            htmlCanvas : elementToBindTo,
            useScenePerspective : true
        };
        this.app = new KSX.apps.core.ThreeJsApp(userDefinition);

        this.textStorage = new KSX.apps.tools.text.Text();
    }

    HelloOOText.prototype.initAsyncContent = function() {
        var scope = this;
        var listOfFonts = [];
        listOfFonts['ubuntu_mono_regular'] = 'resource/fonts/ubuntu_mono_regular.json';
        listOfFonts['helvetiker_regular'] = 'resource/fonts/helvetiker_regular.typeface.json';

        var callbackOnSuccess = function () {
            scope.app.initSynchronuous();
        };
        scope.textStorage.loadListOfFonts(KSX.globals.basedir, listOfFonts, callbackOnSuccess);
    };

    HelloOOText.prototype.initGL = function () {
        var camera = this.app.scenePerspective.camera;
        camera.position.set( 0, 0, 250 );

        var geometry = new THREE.BoxGeometry(1, 2, 1);
        var material = new THREE.MeshNormalMaterial();
        this.mesh = new THREE.Mesh(geometry, material);

        this.app.scenePerspective.scene.add(this.mesh);
        this.app.scenePerspective.camera.position.z = 5;

        var text = this.textStorage.addText('Hello', 'helvetiker_regular', 'Hello world. This text fills the line as much as possible!', new THREE.MeshBasicMaterial(), 0.1, 10);
        text.mesh.position.set(-3, 0.25, 0);
        var textUbuntu = this.textStorage.addText('Test', 'ubuntu_mono_regular', 'This is the Ubuntu font.', new THREE.MeshBasicMaterial(), 0.1, 10);
        textUbuntu.mesh.position.set(-3, -0.25, 0);
        this.app.scenePerspective.scene.add(text.mesh);
        this.app.scenePerspective.scene.add(textUbuntu.mesh);
    };

    HelloOOText.prototype.renderPre = function () {
        this.mesh.rotation.x += 0.02;
        this.mesh.rotation.y += 0.02;
    };

    return HelloOOText;
})();