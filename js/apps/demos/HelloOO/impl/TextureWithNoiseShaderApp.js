0/**
 * Created by Kai Salmen.
 */

'use strict';

KSX.apps.demos.TextureWithNoiseShaderApp = (function () {

    function TextureWithNoiseShaderApp(elementToBindTo) {
        this.app = new KSX.apps.core.ThreeJsApp(this, 'TextureWithNoiseShaderApp', elementToBindTo, true, false);

        this.shader = new KSX.apps.shader.TextureWithNoiseShader();
    }

    TextureWithNoiseShaderApp.prototype.initAsyncContent = function() {
        var scope = this;

        var callbackOnSuccess = function () {
            scope.app.initSynchronuous();
        };
        this.shader.loadResources(callbackOnSuccess);
    };

    TextureWithNoiseShaderApp.prototype.initGL = function () {
        var camera = this.app.scenePerspective.camera;
        camera.position.set( 0, 0, 250 );

        var geometry = new THREE.TorusKnotGeometry(8, 2, 128, 24);
        var material = new THREE.ShaderMaterial({
            uniforms: this.shader.uniforms,
            vertexShader: this.shader.vertexShader,
            fragmentShader: this.shader.fragmentShader
        });
        this.mesh =  new THREE.Mesh(geometry, material);

        this.app.scenePerspective.scene.add(this.mesh);
        this.app.scenePerspective.camera.position.z = 25;
    };

    TextureWithNoiseShaderApp.prototype.render = function () {
        this.mesh.rotation.x += 0.01;
        this.mesh.rotation.y += 0.01;
    };

    return TextureWithNoiseShaderApp;
})();
