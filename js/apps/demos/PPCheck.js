/**
 * @author Kai Salmen / www.kaisalmen.de
 */

'use strict';

KSX.apps.demos.PPCheck = (function () {

    PPCheck.prototype = Object.create(KSX.apps.core.ThreeJsApp.prototype, {
        constructor: {
            configurable: true,
            enumerable: true,
            value: PPCheck,
            writable: true
        }
    });

    function PPCheck(elementToBindTo, loader) {
        KSX.apps.core.ThreeJsApp.call(this);

        this.configure({
            user : this,
            name : 'PPCheck',
            htmlCanvas : elementToBindTo,
            useScenePerspective : true,
            loader: loader
        });

        this.controls = null;

        this.projectionSpace = new KSX.apps.demos.ProjectionSpace();
        this.projectionSpace.resetProjectionSpace();

        this.cameraDefaults = {
            posCamera: new THREE.Vector3(
                300,
                300,
                300 ),
            far: 100000
        };
    }

    PPCheck.prototype.initAsyncContent = function() {
        var scope = this;

        var callbackOnSuccess = function () {
            scope.asyncDone = true;
        };
        scope.projectionSpace.loadAsyncResources( callbackOnSuccess );
    };

    PPCheck.prototype.initGL = function () {
        this.projectionSpace.initGL( this.projectionSpace.shader.textures['linkPixelProtest'], null );
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
