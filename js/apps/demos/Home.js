/**
 * Created by Kai Salmen.
 */

'use strict';

KSX.apps.demos.HomeApp = (function () {

    function HomeApp(elementToBindTo) {
        this.app = new KSX.apps.core.ThreeJsApp(this, "Home", elementToBindTo, true, false);

        this.shader = new KSX.apps.shader.BlockShader();

        this.controls = null;
        this.mesh = null;
    }

    HomeApp.prototype.initAsyncContent = function() {
        var scope = this;

        var callbackOnSuccess = function () {
            scope.app.initSynchronuous();
        };
        this.shader.loadResources(callbackOnSuccess);
    };

    HomeApp.prototype.initPreGL = function () {

    };

    HomeApp.prototype.initGL = function () {
        var renderer = this.app.renderer;
        var scenePerspective = this.app.scenePerspective;

        var gl = renderer.getContext();

        var result = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
        if (result != 0) {
            console.log("Vertex shader is able to read texture: " + result);
        }

        renderer.setClearColor( 0x202020 );

        scenePerspective.camera.position.set( -6, 4, 6 );
        scenePerspective.updateCamera();

        this.controls = new THREE.TrackballControls(scenePerspective.camera);

        var lightColor = 0xE0E0E0;
        var lightPos = new THREE.Vector3(100, 100, 100);
        var directionalLight = new THREE.DirectionalLight(lightColor);
        directionalLight.position.set(lightPos.x, lightPos.y, lightPos.z);
        scenePerspective.scene.add(directionalLight);

        var helper = new THREE.GridHelper( 100, 2 );
        helper.setColors( 0xFF4444, 0x404040 );
        scenePerspective.scene.add(helper);

        var geometryFallback = new THREE.BoxBufferGeometry( 48, 1, 48, 2, 1, 2 );
        var vertices = new Float32Array( [
            -1.0, -1.0,  1.0,
             1.0, -1.0,  1.0,
             1.0,  1.0,  1.0,

             1.0,  1.0,  1.0,
            -1.0,  1.0,  1.0,
            -1.0, -1.0,  1.0,

            -1.0, -1.0,  1.0,
            -1.0,  1.0,  1.0,
            -1.0, -1.0, -1.0,

            -1.0, -1.0, -1.0,
            -1.0,  1.0,  1.0,
            -1.0,  1.0, -1.0,

             1.0, -1.0,  1.0,
             1.0,  1.0,  1.0,
             1.0, -1.0, -1.0,

             1.0, -1.0, -1.0,
             1.0,  1.0,  1.0,
             1.0,  1.0, -1.0
        ] );
        var uvs = new Float32Array( [
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,

            1.0, 1.0,
            0.0, 1.0,
            0.0, 0.0,

            0.0, 0.0,
            0.0, 1.0,
            0.0, 0.0,

            0.0, 0.0,
            0.0, 1.0,
            0.0, 1.0,

            1.0, 0.0,
            1.0, 1.0,
            1.0, 0.0,

            1.0, 0.0,
            1.0, 1.0,
            1.0, 1.0
        ] );
        var geometry = new THREE.BufferGeometry();
        geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
        geometry.addAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) );

        var material = this.shader.buildShaderMaterial();
        //material.wireframe = true;
        material.side = THREE.DoubleSide;
        this.mesh = new THREE.Mesh( geometry, material );
        scenePerspective.scene.add( this.mesh );
    };

    HomeApp.prototype.resizeDisplayGL = function () {
        this.controls.handleResize();
    };

    HomeApp.prototype.render = function () {
//        this.mesh.rotation.y += 0.01;
        this.controls.update();
    };

    HomeApp.prototype.renderPost = function () {
    };

    return HomeApp;
})();


if (KSX.globals.preChecksOk) {
    var implementations = new Array();
    implementations.push(new KSX.apps.demos.HomeApp(document.getElementById("DivGLFullCanvas")));
    var appRunner = new KSX.apps.demos.AppRunner(implementations);
    appRunner.init(true);
}
