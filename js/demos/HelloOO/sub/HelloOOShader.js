0/**
 * Created by Kai Salmen.
 */

"use strict";

KSX.apps.demos.HelloOOShader = (function () {

    function HelloOOShader(elementToBindTo) {
        this.sceneApp = new KSX.apps.core.SceneAppPerspective(this, "HelloOOShader", elementToBindTo, false);
        this.shaderTools = new KSX.apps.tools.ShaderTools();
        this.vertexShaderText = null;
        this.fragmentShaderText = null;
    }

    HelloOOShader.prototype.initAsyncContent = function(refToMyself) {
        $.when(
            this.shaderTools.loadShader("../../resource/shader/passThrough.glsl", true, "VS: Pass Through"),
            this.shaderTools.loadShader("../../resource/shader/staticGreenColor.glsl", true, "FS: Simple Texture")
        ).done(
            function(vert, frag) {
                refToMyself.vertexShaderText = vert[0];
                refToMyself.fragmentShaderText = frag[0];
                refToMyself.sceneApp.initSynchronuous();
            }
        );
    };

    HelloOOShader.prototype.initGL = function () {
/*
        var uniforms = {
            texture1: { type: "t", texture: null }
        };

        var imageUrl = "../../resource/images/house02.jpg";
        var textureLoader = new THREE.TextureLoader();
        textureLoader.load(imageUrl, successfulLoading);

        function successfulLoading(texture) {
            console.log("Texture loading was completed successfully!");
            uniforms.texture1.value = texture;
        }
*/
        var geometry = new THREE.TorusKnotGeometry(8, 2, 128, 24);
        var material = new THREE.ShaderMaterial({
//            uniforms: uniforms,
            vertexShader: this.vertexShaderText,
            fragmentShader: this.fragmentShaderText,
            transparent: true,
            side: THREE.DoubleSide
        });
        this.mesh =  new THREE.Mesh(geometry, material);

        this.sceneApp.scene.add(this.mesh);
        this.sceneApp.camera.position.z = 25;
    };

    HelloOOShader.prototype.render = function () {
        this.mesh.rotation.x += 0.01;
        this.mesh.rotation.y += 0.01;
    };

    return HelloOOShader;
})();
