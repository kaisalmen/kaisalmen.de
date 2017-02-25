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
            name: 'GLCheckApp',
            htmlCanvas: elementToBindTo,
            useScenePerspective: true
        });
        this.platformVerification = new KSX.apps.core.PlatformVerification();
    }

    GLCheck.prototype.initGL = function () {
        this.platformVerification.verifyVertexShaderTextureAccess( this.renderer, true );
    };

    return GLCheck;
})();

