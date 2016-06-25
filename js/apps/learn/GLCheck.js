/**
 * @author Kai Salmen / www.kaisalmen.de
 */

'use strict';

if ( KSX.apps.learn === undefined ) {
    KSX.apps.learn = {}
}

KSX.apps.learn.GLCheck = (function () {

    GLCheck.prototype = Object.create(KSX.apps.core.ThreeJsApp.prototype, {
        constructor: {
            configurable: true,
            enumerable: true,
            value: GLCheck,
            writable: true
        }
    });

    function GLCheck(elementToBindTo) {
        KSX.apps.core.ThreeJsApp.call(this);

        this.configure({
            user : this,
            name : 'GLCheckApp',
            htmlCanvas : elementToBindTo,
            useScenePerspective : true
        });
    }

    GLCheck.prototype.initGL = function () {
        var gl = this.renderer.getContext();

        var result = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
        if (result != 0) {
            console.log("Vertex shader is able to read texture: " + result);
        }
    };

    return GLCheck;
})();

