0/**
 * Created by Kai Salmen.
 */

"use strict";

KSX.apps.demos.ImageBasedGeometryTransform = (function () {

    function ImageBasedGeometryTransform(elementToBindTo) {
        this.app = new KSX.apps.core.ThreeJsApp(this, "ImageBasedGeometryTransform", elementToBindTo, true, false);

        this.shader = new KSX.apps.shader.ImageBaseGeometryTransformShader();
    }

    ImageBasedGeometryTransform.prototype.initAsyncContent = function() {
        var scope = this;

        var callbackOnSuccess = function () {
            scope.app.initSynchronuous();
        };
        this.shader.loadResources(callbackOnSuccess);
    };

    ImageBasedGeometryTransform.prototype.initGL = function () {
        var camera = this.app.scenePerspective.camera;
        camera.position.set( 0, 0, 250 );

        var geometry = new THREE.BoxGeometry(10, 10, 10);
        var material = this.shader.buildShaderMaterial();
        this.mesh =  new THREE.Mesh(geometry, material);

        this.app.scenePerspective.scene.add(this.mesh);
        this.app.scenePerspective.camera.position.z = 25;
    };

    ImageBasedGeometryTransform.prototype.render = function () {
        this.mesh.rotation.x += 0.01;
        this.mesh.rotation.y += 0.01;
    };

    return ImageBasedGeometryTransform;
})();
