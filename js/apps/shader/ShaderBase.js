/**
 * Created by Kai Salmen.
 */

'use strict';

KSX.apps.shader.ShaderBase = (function () {

    function ShaderBase() {
        this.shaderTools = new KSX.apps.tools.ShaderTools();
        this.textureTools = new KSX.apps.tools.TextureTools();
        this.baseDir = KSX.globals.basedir;
    }

    return ShaderBase;
})();