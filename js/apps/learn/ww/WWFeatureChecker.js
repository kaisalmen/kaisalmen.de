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
importScripts( '../../../lib/threejs/MTLLoader.js' );
importScripts( '../../../lib/threejs/OBJLoader2.js' );

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

            var path = '../../../../resource/models/';
            mtlLoader.setPath( path );

            objLoader.setloadAsArrayBuffer( true );
            objLoader.setPath( path );

            break;
        case 'run':
            impl.run( payload );

            var onProgress = function ( xhr ) {
                if ( xhr.lengthComputable ) {
                    var percentComplete = xhr.loaded / xhr.total * 100;
                    console.log( Math.round(percentComplete, 2) + '% downloaded' );
                }
            };

            var onError = function ( xhr ) { };

            mtlLoader.load( 'PTV1.mtl', function( materials ) {
                materials.preload();

                objLoader.setMaterials( materials );
                objLoader.load( 'PTV1.obj', function ( object ) {
                    console.log( 'Hello' );
                }, onProgress, onError );
            });

            break;
        default:
            console.error( 'WWFeatureChecker: Received unknown command: ' + payload.cmd );

            break;
    }

    console.log( 'State after: ' + impl.state );
};

var impl = new KSX.apps.learn.ww.WWFeatureChecker();
var mtlLoader = new THREE.MTLLoader();
var objLoader = new THREE.OBJLoader();

self.addEventListener( 'message', runner, false );
