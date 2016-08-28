/**
 * @author Kai Salmen / www.kaisalmen.de
 */

'use strict';

var KSX = {
    apps: {
        learn: {
            ww: {

            }
        }
    }
};

importScripts( '../../../lib/threejs/three.min.js' );
importScripts( '../../../lib/threejs/OBJLoader.js' );

KSX.apps.learn.ww.WWFeatureChecker = (function () {

    function WWFeatureChecker() {
        this.state = 'created';
        this.value = 0;
    }

    WWFeatureChecker.prototype.execute = function () {
        var geometry = new THREE.SphereGeometry(1, 32, 32);

        var array = [];
        array.push( 1701 );
        var floatArray = new Float32Array( array );

        self.postMessage({
            'cmd': 'data',
            floatArray: floatArray,
        }, [floatArray.buffer] );
    };

    WWFeatureChecker.prototype.init = function ( payload ) {
        this.state = 'init';
        this.value = payload.value;
    };

    WWFeatureChecker.prototype.run = function ( payload ) {
        this.state = 'run';
        this.value = payload.value;

        this.execute();
    };

    return WWFeatureChecker;
})();


var runner = function ( event ) {
    var payload = event.data;

    console.log( payload );

    console.log( 'State before: ' + impl.state );


    switch ( payload.cmd ) {
        case 'init':
            impl.init( payload );
            var path = '../../resource/models/';
            objLoader.setPath( path );

            break;
        case 'run':
            impl.run( payload );

            break;
        default:
            console.error( 'WWFeatureChecker: Received unknown command: ' + payload.cmd );

            break;
    }

    console.log( 'State after: ' + impl.state );
};

var impl = new KSX.apps.learn.ww.WWFeatureChecker();
var objLoader = new THREE.OBJLoader();

self.addEventListener( 'message', runner, false );
