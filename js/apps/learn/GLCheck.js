/**
 * Created by Kai Salmen.
 */

"use strict";

KSX.apps.learn.GLCheckApp = (function () {

    function GLCheckApp(elementToBindTo) {
        var userDefinition = {
            user : this,
            name : 'GLCheckApp',
            htmlCanvas : elementToBindTo,
            useScenePerspective : true
        };
        this.app = new KSX.apps.core.ThreeJsApp(userDefinition);
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

    return GLCheckApp;
})();

