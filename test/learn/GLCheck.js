/**
 * @author Kai Salmen / www.kaisalmen.de
 */

'use strict';

if ( KSX.test.learn === undefined ) KSX.test.learn = {};

KSX.test.learn.GLCheck = (function () {

    GLCheck.prototype = Object.create(KSX.core.ThreeJsApp.prototype, {
        constructor: {
            configurable: true,
            enumerable: true,
            value: GLCheck,
            writable: true
        }
    });

    function GLCheck(elementToBindTo) {
        KSX.core.ThreeJsApp.call(this);

        this.configure({
            name: 'GLCheckApp',
            htmlCanvas: elementToBindTo,
            useScenePerspective: true
        });
        this.platformVerification = new KSX.core.PlatformVerification();
    }

    GLCheck.prototype.initGL = function () {
        this.platformVerification.verifyVertexShaderTextureAccess( this.renderer, true );
    };

    return GLCheck;
})();

