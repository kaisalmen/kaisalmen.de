/**
 * Created by Kai Salmen.
 */

"use strict";


KSX.apps.demos.impl.BlueMarbleApp = (function () {

    function BlueMarbleApp(elementToBindTo) {
        this.sceneApp = new KSX.apps.core.SceneAppPerspective(this, "BlueMarbleApp", elementToBindTo, true);
    }

    BlueMarbleApp.prototype.initAsyncContent = function() {
        console.log("BlueMarbleApp.initAsyncContent is not required!");
        this.sceneApp.initSynchronuous();
    };

    BlueMarbleApp.prototype.initGL = function () {
        var gl = this.sceneApp.renderer.getContext();

        var result = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
        if (result != 0) {
            console.log('Vertex shader is able to read texture (gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS= ' + result + ')');
        }
    };

    BlueMarbleApp.prototype.render = function () {
    };

    return BlueMarbleApp;
})();
