/**
 * @author Kai Salmen / www.kaisalmen.de
 */

'use strict';

if ( KSX.shader === undefined ) KSX.shader = {};

KSX.shader.ShaderBase = (function () {

    function ShaderBase() {
        this.shaderTools = new KSX.tools.ShaderTools();
        this.textureTools = new KSX.tools.TextureTools();
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