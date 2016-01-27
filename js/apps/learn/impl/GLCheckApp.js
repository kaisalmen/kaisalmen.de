/**
 * Created by Kai Salmen.
 */

"use strict";

KSX.apps.learn.impl.GLCheckApp = (function () {

    function GLCheckApp(elementToBindTo) {
        this.sceneApp = new KSX.apps.core.SceneAppPerspective(this, "GLCheckApp", elementToBindTo, true);
    }

    GLCheckApp.prototype.initAsyncContent = function() {
        console.log("GLCheckApp.initAsyncContent is not required!");
        this.sceneApp.initSynchronuous();
    };

    GLCheckApp.prototype.initGL = function () {
        var gl = this.sceneApp.renderer.getContext();

        var result = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
        if (result != 0) {
            console.log("Vertex shader is able to read texture: " + result);
        }
    };

    GLCheckApp.prototype.render = function () {
    };

    return GLCheckApp;
})();

