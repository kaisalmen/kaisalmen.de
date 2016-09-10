/**
 * @author Kai Salmen / www.kaisalmen.de
 */

'use strict';

if (KSX.apps.demos.loaders === undefined) {
    KSX.apps.demos.loaders = {};
}

KSX.apps.demos.loaders.WWOBJLoaderChecker = (function () {

    WWOBJLoaderChecker.prototype = Object.create(KSX.apps.core.ThreeJsApp.prototype, {
        constructor: {
            configurable: true,
            enumerable: true,
            value: WWOBJLoaderChecker,
            writable: true
        }
    });

    function WWOBJLoaderChecker( elementToBindTo ) {
        KSX.apps.core.ThreeJsApp.call(this);

        this.configure({
            user : this,
            name : 'WWOBJLoaderChecker',
            htmlCanvas : elementToBindTo,
            useScenePerspective : true
        });

        this.wwFrontEnd = new KSX.apps.tools.loaders.WWOBJLoaderFrontEnd( KSX.globals.basedir );
        this.wwFrontEnd.setDebug( true );

        this.lights = null;
        this.controls = null;

        this.zipTools = new KSX.apps.tools.ZipTools( '../../resource/models/' );
    }

    WWOBJLoaderChecker.prototype.initGL = function () {
        this.renderer.setClearColor(0x303030);

        var cameraDefaults = {
            posCamera: new THREE.Vector3( 0.0, 0.0, 250.0 ),
        };
        this.scenePerspective.setCameraDefaults( cameraDefaults );

        this.lights = {
            ambientLight: new THREE.AmbientLight(0x202020),
            directionalLight1: new THREE.DirectionalLight(0xC0C090),
            directionalLight2: new THREE.DirectionalLight(0xC0C090),
            directionalLight3: new THREE.DirectionalLight(0xC0C090),
            lightArray: new THREE.Object3D()
        };

        this.lights.directionalLight1.position.set( -100, 0, 100 );
        this.lights.directionalLight2.position.set( 100, 0, 100 );
        this.lights.directionalLight3.position.set( 0, 0, -100 );

        this.lights.lightArray.add( this.lights.directionalLight1 );
        this.lights.lightArray.add( this.lights.directionalLight2 );
        this.lights.lightArray.add( this.lights.directionalLight3 );
        this.scenePerspective.scene.add( this.lights.lightArray );

        this.controls = new THREE.TrackballControls( this.scenePerspective.camera );

        var geometry = new THREE.BoxGeometry(10, 10, 10);
        var material = new THREE.MeshNormalMaterial();
        this.mesh = new THREE.Mesh(geometry, material);

        this.scenePerspective.scene.add(this.mesh);
        this.wwFrontEnd.setObjGroup( this.scenePerspective.scene );
    };

    WWOBJLoaderChecker.prototype.initPostGL = function () {

        var scope = this;
        var objAsArrayBuffer = null;
        var mtlAsString = null;

        var setObjAsArrayBuffer = function( data ) {
            objAsArrayBuffer = data;

//            scope.wwFrontEnd.postInitWithFiles( '../../../../resource/models/', 'PTV1.obj', 'PTV1.mtl', '../../../../resource/models/' );
            scope.wwFrontEnd.postInitWithData( '../../../../resource/models/', objAsArrayBuffer, mtlAsString );
            scope.wwFrontEnd.postRun();

        };
        var setMtlAsString = function( data ) {
            mtlAsString = data;
            scope.zipTools.unpackAsUint8Array( 'PTV1.obj', setObjAsArrayBuffer );
        };

        var doneUnzipping = function() {
            scope.zipTools.unpackAsString( 'PTV1.mtl', setMtlAsString );

        };
        scope.zipTools.load( 'PTV1.zip', doneUnzipping  );

        return true;
    };

    WWOBJLoaderChecker.prototype.resizeDisplayGL = function () {
        this.controls.handleResize();
    };

    WWOBJLoaderChecker.prototype.renderPre = function () {
        this.controls.update();

        this.mesh.rotation.x += 0.05;
        this.mesh.rotation.y += 0.05;

//        this.lights.lightArray.rotation.x += 0.01;
    };

    return WWOBJLoaderChecker;

})();
