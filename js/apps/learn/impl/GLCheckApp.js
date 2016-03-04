/**
 * Created by Kai Salmen.
 */

"use strict";

KSX.apps.learn.impl.GLCheckApp = (function () {

    function GLCheckApp(elementToBindTo) {
        this.app = new KSX.apps.core.ThreeJsApp(this, "GLCheckApp", elementToBindTo, true, false);
    }

    GLCheckApp.prototype.initAsyncContent = function() {
        console.log("GLCheckApp.initAsyncContent is not required!");
        this.app.initSynchronuous();
    };

    GLCheckApp.prototype.initGL = function () {
        var gl = this.app.renderer.getContext();

        var result = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
        if (result != 0) {
            console.log("Vertex shader is able to read texture: " + result);
        }
    };

    GLCheckApp.prototype.render = function () {
    };

    return GLCheckApp;
})();

