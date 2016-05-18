/**
 * Created by Kai Salmen.
 */

'use strict';


KSX.apps.demos.Home = (function () {

    function Home(elementToBindTo) {
        this.app = new KSX.apps.core.ThreeJsApp(this, "Home", elementToBindTo, true, false);

        this.shader = new KSX.apps.shader.BlockShader();

        this.controls = null;
        this.mesh = null;
    }

    Home.prototype.initAsyncContent = function() {
        var scope = this;

        var callbackOnSuccess = function () {
            scope.app.initSynchronuous();
        };
        this.shader.loadResources(callbackOnSuccess);
    };

    Home.prototype.initPreGL = function () {

    };

    Home.prototype.initGL = function () {
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

//        var geometryFallback = new THREE.BoxBufferGeometry( 48, 1, 48, 2, 1, 2 );
        var boxBuilder = new KSX.apps.demos.Home.BoxBuilder();
        var geometry = boxBuilder.buildBox();

        var material = this.shader.buildShaderMaterial();
        //material.wireframe = true;
        material.side = THREE.DoubleSide;
        this.mesh = new THREE.Mesh( geometry, material );
        scenePerspective.scene.add( this.mesh );
    };

    Home.prototype.resizeDisplayGL = function () {
        this.controls.handleResize();
    };

    Home.prototype.render = function () {
//        this.mesh.rotation.y += 0.01;
        this.controls.update();
    };

    Home.prototype.renderPost = function () {
    };

    return Home;
})();


KSX.apps.demos.Home.BoxBuilder = (function () {

    function BoxBuilder() {
        this.geometry = new THREE.BufferGeometry();
        this.vertices = new Float32Array(108);
        this.uvs = new Float32Array(72);
        this.normals = new Float32Array(108);
    }

    BoxBuilder.prototype.buildBox = function() {
        this.vertices.set( [
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
            1.0,  1.0, -1.0,

            -1.0,  1.0,  1.0,
            1.0,  1.0,  1.0,
            1.0,  1.0, -1.0,

            -1.0,  1.0,  1.0,
            1.0,  1.0, -1.0,
            -1.0,  1.0, -1.0,

            -1.0, -1.0,  1.0,
            1.0, -1.0,  1.0,
            1.0, -1.0, -1.0,

            -1.0, -1.0,  1.0,
            1.0, -1.0, -1.0,
            -1.0, -1.0, -1.0,

            -1.0, -1.0, -1.0,
            1.0, -1.0, -1.0,
            1.0,  1.0, -1.0,

            1.0,  1.0, -1.0,
            -1.0,  1.0, -1.0,
            -1.0, -1.0, -1.0
        ] );
        this.uvs.set( [
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
            1.0, 1.0,

            0.0, 1.0,
            1.0, 1.0,
            1.0, 1.0,

            0.0, 1.0,
            1.0, 1.0,
            0.0, 1.0,

            0.0, 0.0,
            1.0, 0.0,
            1.0, 0.0,

            0.0, 0.0,
            1.0, 0.0,
            0.0, 0.0,

            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,

            1.0, 1.0,
            0.0, 1.0,
            0.0, 0.0
        ] );

        this.geometry.addAttribute( 'position', new THREE.BufferAttribute( this.vertices, 3 ) );
        this.geometry.addAttribute( 'uv', new THREE.BufferAttribute( this.uvs, 2 ) );

        return this.geometry;
    };

    return BoxBuilder;
})();



if (KSX.globals.preChecksOk) {
    var implementations = new Array();
    implementations.push(new KSX.apps.demos.Home(document.getElementById("DivGLFullCanvas")));
    var appRunner = new KSX.apps.demos.AppRunner(implementations);
    appRunner.init(true);
}
