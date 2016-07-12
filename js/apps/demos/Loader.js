/**
 * @author Kai Salmen / www.kaisalmen.de
 */

'use strict';

KSX.apps.demos.Loader = (function () {

    var MAIN_CLEAR_COLOR = 0x202020;

    Loader.prototype = Object.create(KSX.apps.core.ThreeJsApp.prototype, {
        constructor: {
            configurable: true,
            enumerable: true,
            value: Loader,
            writable: true
        }
    });

    function Loader(elementToBindTo, loader) {
        KSX.apps.core.ThreeJsApp.call(this);

        this.configure({
            user : this,
            name : 'Loader',
            htmlCanvas : elementToBindTo,
            useScenePerspective : true,
            loader: loader
        });

        this.shader = new KSX.apps.shader.LoaderShader();
    }

    Loader.prototype.initAsyncContent = function() {
        var scope = this;

        var callbackOnSuccess = function () {
            scope.asyncDone = true;
        };
        this.shader.loadResources(callbackOnSuccess);
    };

    Loader.prototype.initGL = function () {
        if ( !this.platformVerification.verifyHwInstancingSupport( this.renderer, true ) ) {
            this.initOk = false;
            return;
        }

        this.renderer.setClearColor(MAIN_CLEAR_COLOR);

        var cameraDefaults = {
            posCamera: new THREE.Vector3( 0.0, 0.0, -10.0 ),
            far: 1000
        };
        this.scenePerspective.setCameraDefaults( cameraDefaults );

        var bufferGeometry = new THREE.SphereBufferGeometry( 1, 32, 32 );
        var shaderMaterial = this.shader.buildShaderMaterial();
        shaderMaterial.wireframe = true;

        var geometry = new THREE.InstancedBufferGeometry();
        geometry.copy( bufferGeometry );

        var offsets = this.createOffsetsArray( 10 );
        geometry.addAttribute( 'offset', offsets );

        var mesh = new THREE.Mesh( geometry, shaderMaterial );

        this.pivot = new THREE.Object3D();
        this.pivot.add( mesh );

        this.scenePerspective.scene.add( this.pivot );
    };

    Loader.prototype.createOffsetsArray = function ( objectCount ) {
        var offsets = new THREE.InstancedBufferAttribute( new Float32Array( objectCount * 3 ), 3, 1 );

        var index = 0;
        var x, y, z;
        var factor = 8;
        var base = -4;
        while ( index < objectCount ) {
            x = base + Math.random( index ) * factor;
            y = base + Math.random( index ) * factor;
            z = base + Math.random( index ) * factor;
            offsets.setXYZ( index, x, y, z );
            console.log( 'x: ' + x + ' y: ' + y + ' z: ' + z );
            index++;
        }

        return offsets;
    };

    Loader.prototype.renderPre = function () {
        this.pivot.rotation.x += 0.01;
        this.pivot.rotation.y += 0.01;
    };

    return Loader;
})();
