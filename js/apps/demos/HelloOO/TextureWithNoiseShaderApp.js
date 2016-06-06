0/**
 * Created by Kai Salmen.
 */

'use strict';

KSX.apps.demos.TextureWithNoiseShader = (function () {

    function TextureWithNoiseShader(elementToBindTo) {
        var userDefinition = {
            user : this,
            name : 'TextureWithNoiseShader',
            htmlCanvas : elementToBindTo,
            useScenePerspective : true
        };
        this.app = new KSX.apps.core.ThreeJsApp(userDefinition);

        this.shader = new KSX.apps.shader.TextureWithNoiseShader();
    }

    TextureWithNoiseShader.prototype.initAsyncContent = function() {
        var scope = this;

        var callbackOnSuccess = function () {
            scope.app.initSynchronuous();
        };
        this.shader.loadResources(callbackOnSuccess);
    };

    TextureWithNoiseShader.prototype.initGL = function () {
        var camera = this.app.scenePerspective.camera;
        camera.position.set( 0, 0, 250 );

        var geometry = new THREE.TorusKnotGeometry(8, 2, 128, 24);
        var material = this.shader.buildShaderMaterial();
        this.mesh =  new THREE.Mesh(geometry, material);

        this.app.scenePerspective.scene.add(this.mesh);
        this.app.scenePerspective.camera.position.z = 25;
    };

    TextureWithNoiseShader.prototype.renderPre = function () {
        this.mesh.rotation.x += 0.01;
        this.mesh.rotation.y += 0.01;
    };

    return TextureWithNoiseShader;
})();
