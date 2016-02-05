0/**
 * Created by Kai Salmen.
 */

"use strict";

KSX.apps.demos.ImageBasedGeometryTransform = (function () {

    function ImageBasedGeometryTransform(elementToBindTo) {
        this.sceneApp = new KSX.apps.core.SceneAppPerspective(this, "ImageBasedGeometryTransform", elementToBindTo, false);
        this.shaderTools = new KSX.apps.tools.ShaderTools();
        this.textureTools = new KSX.apps.tools.TextureTools();
        this.vertexShaderText = null;
        this.fragmentShaderText = null;
        this.uniforms = {
            blendFactor : { type: "f", value: 0.75 },
            colorFactor : { type: "fv1", value: [1.0, 1.0, 1.0] },
            texture1: { type: "t", texture: null }
        };
    }

    ImageBasedGeometryTransform.prototype.initAsyncContent = function() {
        var scope = this;
        $.when(
            this.shaderTools.loadShader("../../resource/shader/passThrough.glsl", true, "VS: Pass Through"),
            this.shaderTools.loadShader("../../resource/shader/simpleTextureEffect.glsl", true, "FS: Simple Texture")
        ).done(
            function(vert, frag) {
                scope.vertexShaderText = vert[0];
                scope.fragmentShaderText = frag[0];
                scope.sceneApp.initSynchronuous();
            }
        );
    };

    ImageBasedGeometryTransform.prototype.initGL = function () {
        this.uniforms.texture1.value = this.textureTools.loadTexture("../../resource/images/house02_pot.jpg");

        var geometry = new THREE.BoxGeometry(10, 10, 10);
        var material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: this.vertexShaderText,
            fragmentShader: this.fragmentShaderText
        });
        this.mesh =  new THREE.Mesh(geometry, material);

        this.sceneApp.scene.add(this.mesh);
        this.sceneApp.camera.position.z = 25;
    };

    ImageBasedGeometryTransform.prototype.render = function () {
        this.mesh.rotation.x += 0.01;
        this.mesh.rotation.y += 0.01;
    };

    return ImageBasedGeometryTransform;
})();