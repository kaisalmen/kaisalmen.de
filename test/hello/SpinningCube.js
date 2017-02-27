/**
 * @author Kai Salmen / www.kaisalmen.de
 */

'use strict';

if ( KSX.test.hello === undefined ) KSX.test.hello = {};

KSX.test.hello.SpinningCube = (function () {

    SpinningCube.prototype = Object.create(KSX.core.ThreeJsApp.prototype, {
        constructor: {
            configurable: true,
            enumerable: true,
            value: SpinningCube,
            writable: true
        }
    });

    function SpinningCube(elementToBindTo, loader) {
        KSX.core.ThreeJsApp.call(this);

        this.configure({
            name: 'SpinningCube',
            htmlCanvas: elementToBindTo,
            useScenePerspective: true,
            loader: loader
        });

        this.shader = new KSX.shader.SpinningCubeShader();
    }

    SpinningCube.prototype.initPreGL = function() {
        var scope = this;

        var callbackOnSuccess = function () {
            scope.preloadDone = true;
        };
        this.shader.loadResources(callbackOnSuccess);
    };

    SpinningCube.prototype.initGL = function () {
        var cameraDefaults = {
            posCamera: new THREE.Vector3( 0.0, 0.0, 25.0 ),
        };
        this.scenePerspective.setCameraDefaults( cameraDefaults );

        var geometry = new THREE.BoxGeometry(10, 10, 10);
        var material = this.shader.buildShaderMaterial();
        this.mesh =  new THREE.Mesh(geometry, material);

        this.scenePerspective.scene.add(this.mesh);
    };

    SpinningCube.prototype.renderPre = function () {
        this.mesh.rotation.x += 0.01;
        this.mesh.rotation.y += 0.01;
    };

    return SpinningCube;
})();
