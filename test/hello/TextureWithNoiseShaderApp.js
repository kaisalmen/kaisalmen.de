/**
 * @author Kai Salmen / www.kaisalmen.de
 */

'use strict';

if ( KSX.test.hello === undefined ) KSX.test.hello = {};

KSX.test.hello.TextureWithNoiseShader = (function () {

    TextureWithNoiseShader.prototype = Object.create(KSX.core.ThreeJsApp.prototype, {
        constructor: {
            configurable: true,
            enumerable: true,
            value: TextureWithNoiseShader,
            writable: true
        }
    });

    function TextureWithNoiseShader(elementToBindTo) {
        KSX.core.ThreeJsApp.call(this);

        this.configure({
            name: 'TextureWithNoiseShader',
            htmlCanvas: elementToBindTo,
            useScenePerspective: true
        });

        this.shader = new KSX.shader.TextureWithNoiseShader();
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
