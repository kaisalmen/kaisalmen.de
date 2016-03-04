/**
 * Created by Kai Salmen.
 */

'use strict';


KSX.apps.demos.impl.BlueMarbleApp = class {

    constructor(elementToBindTo) {
        this.app = new KSX.apps.core.ThreeJsApp(this, 'BlueMarbleApp', elementToBindTo, true, true);
        this.app.setVerbose(true);

        this.textureTools = new KSX.apps.tools.TextureTools();
        this.shaderTools = new KSX.apps.tools.ShaderTools();

        this.uniforms = {
            blendFactor : { type : 'f', value : 0.75 },
            colorFactor : { type : 'fv1', value : [1.0, 1.0, 1.0] },
            texture1 : { type : 't', value : null },
            textureSat : { type : 't', value : null }
        };

        this.vertexShaderText = null;
        this.fragmentShaderText = null;
    }

    initAsyncContent () {
        var scope = this;

        var promises = new Set();
        promises.add(this.textureTools.loadTexture('../../resource/images/BlueMarble/bluemarble_rgba.png'));
        promises.add(this.textureTools.loadTexture('../../resource/images/BlueMarble/sat_rgba.png'));

        promises.add(this.shaderTools.loadShader('../../resource/shader/passThrough.glsl', true, 'VS: Pass Through'));
        promises.add(this.shaderTools.loadShader('../../resource/shader/simpleTextureEffect.glsl', true, 'FS: Simple Texture'));

        Promise.all( promises ).then(
            function (results) {
                scope.uniforms.texture1.value = results[0];
                scope.uniforms.textureSat.value = results[1];
                scope.vertexShaderText = results[2];
                scope.fragmentShaderText = results[3];
                scope.app.initSynchronuous();
            }
        ).catch(
            function (error) {
                console.log('The following error occurred: ', error);
            }
        );
    }

    initGL () {
        var gl = this.app.renderer.getContext();

        var result = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
        if (result != 0) {
            console.log('Vertex shader is able to read texture (gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS= ' + result + ')');
        }

        var geometry = new THREE.PlaneGeometry(3712, 3712, 1, 1);
        var material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: this.vertexShaderText,
            fragmentShader: this.fragmentShaderText
        });
        //material = new THREE.MeshNormalMaterial();
        this.mesh =  new THREE.Mesh(geometry, material);

//        sceneOrtho.camera.position.set(new THREE.Vector3(0, 0, 1000));
//        sceneOrtho.updateCamera();

        this.app.sceneOrtho.scene.add(this.mesh);

    }

    render () {

    }
}
