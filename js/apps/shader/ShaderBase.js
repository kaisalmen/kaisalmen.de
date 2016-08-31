/**
 * @author Kai Salmen / www.kaisalmen.de
 */

'use strict';

if ( KSX.apps.shader === undefined ) {
    KSX.apps.shader = {}
}

KSX.apps.shader.ShaderBase = (function () {

    function ShaderBase() {
        this.shaderTools = new KSX.apps.tools.ShaderTools();
        this.textureTools = new KSX.apps.tools.TextureTools();
        this.baseDir = KSX.globals.basedir;

        this.uniforms = {
        };
        this.vertexShader = null;
        this.fragmentShader = null;
    }

    ShaderBase.prototype.buildShaderMaterial = function () {
        var shaderMaterial = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: this.vertexShader,
            fragmentShader: this.fragmentShader
        });

        return shaderMaterial;
    };

    return ShaderBase;
})();