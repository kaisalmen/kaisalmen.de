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

        this.lights = null;
        this.controls = null;

        this.worker = new Worker( basedir + "/js/apps/learn/ww/WWFeatureChecker.js" );

        var scope = this;
        var scopeFunction = function ( e ) {
            scope.processData( e );
        };
        this.worker.addEventListener( 'message', scopeFunction, false );

        this.counter = 0;
    }

    FeatureChecker.prototype.initGL = function () {
        this.renderer.setClearColor(0x303030);

        var cameraDefaults = {
            posCamera: new THREE.Vector3( 0.0, 0.0, 250.0 ),
        };
        this.scenePerspective.setCameraDefaults( cameraDefaults );

        this.lights = {
            ambientLight: new THREE.AmbientLight(0x202020),
            directionalLight1: new THREE.DirectionalLight(0xC05050),
            directionalLight2: new THREE.DirectionalLight(0x50C050),
            directionalLight3: new THREE.DirectionalLight(0x5050C0),
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

        this.materialLoader = new THREE.MaterialLoader();
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

    FeatureChecker.prototype.resizeDisplayGL = function () {
        this.controls.handleResize();
    };

    FeatureChecker.prototype.renderPre = function () {
        this.controls.update();
    };

    FeatureChecker.prototype.processData = function ( event ) {
        var payload = event.data;

        switch ( payload.cmd ) {
            case "objData":
                this.counter++;

                var bufferGeometry = new THREE.BufferGeometry();

                bufferGeometry.addAttribute( "position", new THREE.BufferAttribute( new Float32Array( payload.vertices ), 3 ) );
                if ( payload.normals !== undefined ) {
                    bufferGeometry.addAttribute( "normal", new THREE.BufferAttribute( new Float32Array( payload.normals ), 3 ) );
                }
                else {
                    bufferGeometry.computeVertexNormals();
                }
                if (payload.uvs !== undefined) {
                    bufferGeometry.addAttribute( "uv", new THREE.BufferAttribute( new Float32Array( payload.uvs ), 2 ) );
                }

                var materialJSON = JSON.parse( payload.material );
                var material = this.materialLoader.parse( materialJSON );
                var materialGroups = JSON.parse( payload.materialGroups );
/*
                if ( materialGroups.length > 0 ) {
                    console.log( this.counter + ' materialGroups: ' + materialGroups );
                }
*/
                for ( var group, i = 0, length = materialGroups.length; i < length; i++ ) {
                    group = materialGroups[i];
                    bufferGeometry.addGroup( group.start, group.count, group.index );
                }

                var mesh = new THREE.Mesh( bufferGeometry, material );
                mesh.name = payload.meshName;

                this.scenePerspective.scene.add( mesh );

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
