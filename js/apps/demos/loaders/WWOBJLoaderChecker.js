/**
 * @author Kai Salmen / www.kaisalmen.de
 */

'use strict';

if (KSX.apps.demos.loaders === undefined) {
    KSX.apps.demos.loaders = {};
}

KSX.apps.demos.loaders.WWOBJLoaderChecker = (function () {

    WWOBJLoaderChecker.prototype = Object.create( KSX.apps.core.ThreeJsApp.prototype );
    WWOBJLoaderChecker.prototype.constructor = WWOBJLoaderChecker;

    function WWOBJLoaderChecker( elementToBindTo ) {
        KSX.apps.core.ThreeJsApp.call( this );

        this.configure({
            name: 'WWOBJLoaderChecker',
            htmlCanvas: elementToBindTo,
            useScenePerspective: true
        });

        this.wwObjLoader2 = new THREE.OBJLoader2.WWOBJLoader2();
        this.wwObjLoader2.setCrossOrigin( 'anonymous' );

        this.lights = null;
        this.controls = null;

        this.zipTools = null;
        this.zipFiles = null;
        this.files = null;

        var uiToolsConfig = {
            useUil: false,
            useStats: false
        };
        this.uiTools = new KSX.apps.tools.UiTools( uiToolsConfig );
    }

    WWOBJLoaderChecker.prototype.setZipFiles = function ( pathBase, fileZip, fileObj, pathTexture, fileMtl  ) {
        this.useZip = true;
        this.zipFiles = {
            pathBase: pathBase,
            fileZip: fileZip,
            fileObj: fileObj,
            pathTexture: pathTexture,
            fileMtl: fileMtl
        };
        this.zipTools = new KSX.apps.tools.ZipTools( this.zipFiles.pathBase );
    };

    WWOBJLoaderChecker.prototype.setFiles = function ( pathBase, fileObj, pathTexture, fileMtl ) {
        this.useZip = false;
        this.files = {
            pathBase: pathBase,
            fileObj: fileObj,
            pathTexture: pathTexture,
            fileMtl: fileMtl
        };
    };

    WWOBJLoaderChecker.prototype.initPreGL = function () {
        this.uiTools.createFeedbackAreaDynamic();

        var scope = this;
        var announceFeedback = function ( text ) {
            scope.uiTools.announceFeedback( text );
        };
        this.wwObjLoader2.registerCallbackProgress( announceFeedback );

        this.preloadDone = true;
    };

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
    };

    WWOBJLoaderChecker.prototype.initPostGL = function () {
        var scope = this;

        if ( scope.useZip ) {

            var mtlAsString = null;

            var setObjAsArrayBuffer = function( data ) {
                var prepData = new THREE.OBJLoader2.WWOBJLoader2.PrepDataArrayBuffer(
                    'OBJ-Zip', data, scope.zipFiles.pathTexture, mtlAsString, scope.scenePerspective.scene
                );
                scope.wwObjLoader2.prepareRun( prepData );
                scope.wwObjLoader2.run();

            };
            var setMtlAsString = function( data ) {
                mtlAsString = data;
                scope.zipTools.unpackAsUint8Array( scope.zipFiles.fileObj, setObjAsArrayBuffer );
            };

            var doneUnzipping = function() {
                if ( scope.zipFiles.fileMtl !== null ) {

                    scope.zipTools.unpackAsString( scope.zipFiles.fileMtl, setMtlAsString );

                } else {

                    setMtlAsString( null );

                }
            };
            var reportProgress = function( text ) {
                scope.uiTools.announceFeedback( text );
            };
            scope.zipTools.load( scope.zipFiles.fileZip, { success: doneUnzipping, progress: reportProgress, error: reportProgress } );

        }
        else {

            var prepData = new THREE.OBJLoader2.WWOBJLoader2.PrepDataFile(
                'OBJ-File', scope.files.pathBase, scope.files.fileObj, scope.files.pathTexture, scope.files.fileMtl, scope.scenePerspective.scene
            );
            scope.wwObjLoader2.prepareRun( prepData );
            scope.wwObjLoader2.run();

        }

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
