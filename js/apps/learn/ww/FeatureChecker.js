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

    function FeatureChecker( basedir ) {

        this.worker = new Worker( basedir + "/js/apps/learn/ww/WWFeatureChecker.js" );

        var scope = this;
        var scopeFunction = function ( e ) {
            scope.processData( e );
        };
        this.worker.addEventListener( 'message', scopeFunction, false );
    }

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
