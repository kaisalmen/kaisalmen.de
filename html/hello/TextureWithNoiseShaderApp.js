/**
 * @author Kai Salmen / www.kaisalmen.de
 */

'use strict';

KSX.apps.demos.TextureWithNoiseShader = (function () {

    TextureWithNoiseShader.prototype = Object.create(KSX.apps.core.ThreeJsApp.prototype, {
        constructor: {
            configurable: true,
            enumerable: true,
            value: TextureWithNoiseShader,
            writable: true
        }
    });

    function TextureWithNoiseShader(elementToBindTo) {
        KSX.apps.core.ThreeJsApp.call(this);

        this.configure({
            name: 'TextureWithNoiseShader',
            htmlCanvas: elementToBindTo,
            useScenePerspective: true
        });

        this.shader = new KSX.apps.shader.TextureWithNoiseShader();
    }

    TextureWithNoiseShader.prototype.initPreGL = function() {
        var scope = this;

        var callbackOnSuccess = function () {
            scope.preloadDone = true;
        };
        this.shader.loadResources(callbackOnSuccess);
    };

    TextureWithNoiseShader.prototype.initGL = function () {
        var cameraDefaults = {
            posCamera: new THREE.Vector3( 0.0, 0.0, 25.0 ),
        };
        this.scenePerspective.setCameraDefaults( cameraDefaults );

        var geometry = new THREE.TorusKnotGeometry(8, 2, 128, 24);
        var material = this.shader.buildShaderMaterial();
        this.mesh =  new THREE.Mesh(geometry, material);

        this.scenePerspective.scene.add(this.mesh);
};

    TextureWithNoiseShader.prototype.renderPre = function () {
        this.mesh.rotation.x += 0.01;
        this.mesh.rotation.y += 0.01;
    };

    return TextureWithNoiseShader;
})();
