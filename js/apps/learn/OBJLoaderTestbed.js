/**
 * @author Kai Salmen / www.kaisalmen.de
 */

'use strict';

if ( KSX.apps.learn === undefined ) {
    KSX.apps.learn = {}
}

KSX.apps.learn.ObjLoaderTestbed = (function () {

    ObjLoaderTestbed.prototype = Object.create( KSX.apps.core.ThreeJsApp.prototype, {
        constructor: {
            configurable: true,
            enumerable: true,
            value: ObjLoaderTestbed,
            writable: true
        }
    });

    function ObjLoaderTestbed( elementToBindTo ) {
        KSX.apps.core.ThreeJsApp.call(this);

        var userDefinition = {
            user: this,
            name: 'ObjLoaderTestbed',
            htmlCanvas: elementToBindTo,
            useScenePerspective: true,
            loader: false
        };
        this.configure( userDefinition );

        this.controls = null;
        this.uiTools = new KSX.apps.tools.UiTools({
            useUil: false,
            useStats: true
        });
    }

    ObjLoaderTestbed.prototype.initPreGL = function () {
        this.uiTools.enableStats();
    };

    ObjLoaderTestbed.prototype.initGL = function () {
        this.renderer.setClearColor(0x3B3B3B);

        var cameraDefaults = {
            posCamera: new THREE.Vector3( 0.0, 0.0, 250.0 ),
            far: 1000
        };
        this.scenePerspective.setCameraDefaults( cameraDefaults );
        this.controls = new THREE.TrackballControls( this.scenePerspective.camera );

        var lights = {
            ambientLight: new THREE.AmbientLight( 0xA0A0A0 ),
            directionalLight1: new THREE.DirectionalLight( 0xC05050 ),
            directionalLight2: new THREE.DirectionalLight( 0x50C050 ),
            directionalLight3: new THREE.DirectionalLight( 0x5050C0 )
        };
        lights.directionalLight1.position.set( -100, 0, 100 );
        lights.directionalLight2.position.set( 100, 0, 100 );
        lights.directionalLight3.position.set( 0, 0, -100 );
        this.scenePerspective.scene.add ( lights.ambientLight );
        this.scenePerspective.scene.add ( lights.directionalLight1 );
        this.scenePerspective.scene.add ( lights.directionalLight2 );
        this.scenePerspective.scene.add ( lights.directionalLight3 );

        var scope = this;
        var onProgress = function ( xhr ) {
            if ( xhr.lengthComputable ) {
                var percentComplete = xhr.loaded / xhr.total * 100;
                console.log( Math.round(percentComplete, 2) + '% downloaded' );
            }
        };

        var onError = function ( xhr ) { };

        var path = '../../resource/models/';
        var mtlLoader = new THREE.MTLLoader();
        mtlLoader.setPath( path );
        mtlLoader.load( 'PTV1.mtl', function( materials ) {

            materials.preload();

            var objLoader = new THREE.OBJLoader();
            objLoader.setMaterials( materials );
            objLoader.setloadAsArrayBuffer( true );
            objLoader.setWorkInline( true );
            objLoader.setPath( path );
            objLoader.load( 'PTV1.obj', function ( object ) {
                scope.scenePerspective.scene.add( object );

            }, onProgress, onError );

        });
    };

    ObjLoaderTestbed.prototype.resizeDisplayGL = function () {
        this.controls.handleResize();
    };

    ObjLoaderTestbed.prototype.renderPre = function () {
        this.controls.update();
    };

    ObjLoaderTestbed.prototype.renderPost = function () {
        this.uiTools.updateStats();
    };

    return ObjLoaderTestbed;
})();
