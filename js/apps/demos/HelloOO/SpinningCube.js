0/**
 * Created by Kai Salmen.
 */

"use strict";

KSX.apps.demos.SpinningCube = (function () {

    SpinningCube.prototype = Object.create(KSX.apps.core.ThreeJsApp.prototype, {
        constructor: {
            configurable: true,
            enumerable: true,
            value: SpinningCube,
            writable: true
        }
    });

    function SpinningCube(elementToBindTo, loader) {
        KSX.apps.core.ThreeJsApp.call(this);

        this.configure({
            user : this,
            name : 'SpinningCube',
            htmlCanvas : elementToBindTo,
            useScenePerspective : true,
            loader: loader
        });

        this.shader = new KSX.apps.shader.SpinningCubeShader();
    }

    SpinningCube.prototype.initAsyncContent = function() {
        var scope = this;

        var callbackOnSuccess = function () {
            scope.asyncDone = true;
        };
        this.shader.loadResources(callbackOnSuccess);
        
        this.initSynchronuous();
    };

    SpinningCube.prototype.initGL = function () {
        var camera = this.scenePerspective.camera;
        camera.position.set( 0, 0, 250 );

        var geometry = new THREE.BoxGeometry(10, 10, 10);
        var material = this.shader.buildShaderMaterial();
        this.mesh =  new THREE.Mesh(geometry, material);

        this.scenePerspective.scene.add(this.mesh);
        this.scenePerspective.camera.position.z = 25;
    };

    SpinningCube.prototype.renderPre = function () {
        this.mesh.rotation.x += 0.01;
        this.mesh.rotation.y += 0.01;
    };

    return SpinningCube;
})();
