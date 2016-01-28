/**
 * Created by Kai Salmen.
 */

"use strict";

KSX.apps.zerosouth.impl.PTV1Loader = (function () {

    function PTV1Loader(elementToBindTo) {
        this.sceneApp = new KSX.apps.core.SceneAppPerspective(this, "PTV1Loader", elementToBindTo, true);
    }

    PTV1Loader.prototype.initAsyncContent = function() {
        console.log("PTV1Loader.initAsyncContent is not required!");
        this.sceneApp.initSynchronuous();
    };

    PTV1Loader.prototype.initGL = function () {
        var gl = this.sceneApp.renderer.getContext();

        var result = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
        if (result != 0) {
            console.log("Vertex shader is able to read texture: " + result);
        }
    };

    PTV1Loader.prototype.render = function () {
    };

    return PTV1Loader;
})();