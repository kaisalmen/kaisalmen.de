/**
 * @author Kai Salmen / www.kaisalmen.de
 */

'use strict';

importScripts( '../../../lib/threejs/three.min.js' );
importScripts( '../../../lib/threejs/MTLLoader.js' );
importScripts( '../../../lib/threejs/OBJLoader2.js' );

var KSX = {
    apps: {
        learn: {
            ww: {
                static: {
                    runner: null,
                    impl: null,
                    mtlLoader: new THREE.MTLLoader(),
                    objLoader: new THREE.OBJLoader()
                }
            }
        }
    }
};

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


KSX.apps.learn.ww.static.runner = function ( event ) {
    var payload = event.data;

    console.log( payload );

    console.log( 'State before: ' + KSX.apps.learn.ww.static.impl.state );


    switch ( payload.cmd ) {
        case 'init':
            KSX.apps.learn.ww.static.impl.init( payload );

            var path = '../../../../resource/models/';
            KSX.apps.learn.ww.static.mtlLoader.setPath( path );

            KSX.apps.learn.ww.static.objLoader.setloadAsArrayBuffer( true );
            KSX.apps.learn.ww.static.objLoader.setPath( path );

            break;
        case 'run':
            KSX.apps.learn.ww.static.impl.run( payload );

            var onProgress = function ( xhr ) {
                if ( xhr.lengthComputable ) {
                    var percentComplete = xhr.loaded / xhr.total * 100;
                    console.log( Math.round(percentComplete, 2) + '% downloaded' );
                }
            };

            var onError = function ( xhr ) { };

            KSX.apps.learn.ww.static.mtlLoader.load( 'PTV1.mtl', function( materials ) {
                materials.preload();

                KSX.apps.learn.ww.static.objLoader.setMaterials( materials );
                KSX.apps.learn.ww.static.objLoader.load( 'PTV1.obj', function ( object ) {
                    console.log( 'Hello' );
                }, onProgress, onError );
            });

            break;
        default:
            console.error( 'WWFeatureChecker: Received unknown command: ' + payload.cmd );

            break;
    }

    console.log( 'State after: ' + KSX.apps.learn.ww.static.impl.state );
};

KSX.apps.learn.ww.static.impl = new KSX.apps.learn.ww.WWFeatureChecker();

self.addEventListener( 'message', KSX.apps.learn.ww.static.runner, false );
