0/**
 * Created by Kai Salmen.
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
            user : this,
            name : 'TextureWithNoiseShader',
            htmlCanvas : elementToBindTo,
            useScenePerspective : true
        });

        this.shader = new KSX.apps.shader.TextureWithNoiseShader();
    }

    TextureWithNoiseShader.prototype.initAsyncContent = function() {
        var scope = this;

        var callbackOnSuccess = function () {
            scope.asyncDone = true;
        };
        this.shader.loadResources(callbackOnSuccess);
    };

    TextureWithNoiseShader.prototype.initGL = function () {
        var camera = this.scenePerspective.camera;
        camera.position.set( 0, 0, 250 );

        var geometry = new THREE.TorusKnotGeometry(8, 2, 128, 24);
        var material = this.shader.buildShaderMaterial();
        this.mesh =  new THREE.Mesh(geometry, material);

        this.scenePerspective.scene.add(this.mesh);
        this.scenePerspective.camera.position.z = 25;
    };

    TextureWithNoiseShader.prototype.renderPre = function () {
        this.mesh.rotation.x += 0.01;
        this.mesh.rotation.y += 0.01;
    };

    return TextureWithNoiseShader;
})();
