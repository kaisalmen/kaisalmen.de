/**
 * @author Kai Salmen / www.kaisalmen.de
 */

'use strict';

if ( KSX.test.projectionspace === undefined ) KSX.test.projectionspace = {};

KSX.test.projectionspace.VerifyPP = (function () {

    PPCheck.prototype = Object.create(KSX.core.ThreeJsApp.prototype, {
        constructor: {
            configurable: true,
            enumerable: true,
            value: PPCheck,
            writable: true
        }
    });

    function PPCheck(elementToBindTo, loader) {
        KSX.core.ThreeJsApp.call(this);

        this.configure({
            name: 'PPCheck',
            htmlCanvas: elementToBindTo,
            useScenePerspective: true,
            loader: loader
        });

        this.controls = null;

        this.projectionSpace = new KSX.instancing.ProjectionSpace({
            low: { index: 0, name: 'Low', x: 240, y: 100, defaultHeightFactor: 9, mesh: null },
            medium: { index: 1, name: 'Medium', x: 720, y: 302, defaultHeightFactor: 18, mesh: null }
        }, 0);

        this.cameraDefaults = {
            posCamera: new THREE.Vector3( 300, 300, 300 ),
            far: 100000
        };
    }

    PPCheck.prototype.initPreGL = function() {
        var scope = this;

        var callbackOnSuccess = function () {
            scope.preloadDone = true;
        };
        scope.projectionSpace.loadAsyncResources( callbackOnSuccess );
    };

    PPCheck.prototype.initGL = function () {
        this.projectionSpace.initGL();
        this.projectionSpace.flipTexture( 'linkPixelProtest' );

        this.scenePerspective.scene.add( this.projectionSpace.dimensions[this.projectionSpace.index].mesh );

        this.scenePerspective.setCameraDefaults( this.cameraDefaults );
        this.controls = new THREE.TrackballControls( this.scenePerspective.camera );
    };

    PPCheck.prototype.resizeDisplayGL = function () {
        this.controls.handleResize();
    };

    PPCheck.prototype.renderPre = function () {
        this.controls.update();

    };

    return PPCheck;
})();
