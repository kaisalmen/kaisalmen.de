/**
 * @author Kai Salmen / www.kaisalmen.de
 */

'use strict';

if ( KSX.apps.learn === undefined ) {
    KSX.apps.learn = {}
}
if ( KSX.apps.learn.ww === undefined ) {
    KSX.apps.learn.ww = {}
}

KSX.apps.learn.ww.FeatureChecker = (function () {

    FeatureChecker.prototype = Object.create(KSX.apps.core.ThreeJsApp.prototype, {
        constructor: {
            configurable: true,
            enumerable: true,
            value: FeatureChecker,
            writable: true
        }
    });

    function FeatureChecker( elementToBindTo, basedir ) {
        KSX.apps.core.ThreeJsApp.call(this);

        this.configure({
            user : this,
            name : 'GLCheckApp',
            htmlCanvas : elementToBindTo,
            useScenePerspective : true
        });

        this.worker = new Worker( basedir + "/js/apps/learn/ww/WWFeatureChecker.js" );

        var scope = this;
        var scopeFunction = function ( e ) {
            scope.processData( e );
        };
        this.worker.addEventListener( 'message', scopeFunction, false );
    }

    FeatureChecker.prototype.initGL = function () {
        var cameraDefaults = {
            posCamera: new THREE.Vector3( 0.0, 0.0, 250.0 ),
        };
        this.scenePerspective.setCameraDefaults( cameraDefaults );

        var geometry = new THREE.BoxGeometry(10, 10, 10);
        var material = new THREE.MeshNormalMaterial();
        this.mesh = new THREE.Mesh(geometry, material);

        this.scenePerspective.scene.add(this.mesh);
    };

    FeatureChecker.prototype.renderPre = function () {
        this.mesh.rotation.x += 0.01;
        this.mesh.rotation.y += 0.01;
    };


    FeatureChecker.prototype.initPostGL = function () {
        this.postInit();
        this.postRun();
        return true;
    };

    FeatureChecker.prototype.processData = function ( event ) {
        var payload = event.data;

        switch ( payload.cmd ) {
            case "data":
                console.log( payload );

                break;
            default:
                console.error( 'Received unknown command: ' + payload.cmd );
                break;
        }
    };

    FeatureChecker.prototype.postInit = function (  ) {
        this.worker.postMessage({
            "cmd": "init",
            "value": 42
        });
    };

    FeatureChecker.prototype.postRun = function (  ) {
        this.worker.postMessage({
            "cmd": "run",
            "value": 43
        });
    };

    return FeatureChecker;

})();
