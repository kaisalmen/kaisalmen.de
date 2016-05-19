/**
 * Created by Kai Salmen.
 */

'use strict';


KSX.apps.demos.Home = (function () {

    function Home(elementToBindTo) {
        this.app = new KSX.apps.core.ThreeJsApp(this, "Home", elementToBindTo, true, false);

        this.shader = new KSX.apps.shader.BlockShader();

        this.controls = null;

        this.vertices = new Array();
        this.normals = new Array();
        this.uvs = new Array();
        this.index = new Array();
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

        var material = this.shader.buildShaderMaterial();
//        material.wireframe = true;
//        material.side = THREE.DoubleSide;

        var uVar = 0.0;
        var vVar = 0.0;
        var posX = 0.0;
        var posY = 0.0;
        var gridSizeU = 512;
        var gridSizeV = 512;
        var i = 0;
        var j = 0;
        var boxCount = 0;

        while (i < gridSizeU) {
            while (j < gridSizeV) {
                //KSX.apps.demos.Home.BoxBuilder.buildBox(this, posX, posY, 0.0, uVar, 1.0, vVar, 1.0);
                KSX.apps.demos.Home.BoxBuilder.buildBox(this, boxCount, posX, posY, 0.0, uVar, uVar, vVar, vVar);
                uVar += 1.0 / gridSizeU;
                posX += 2.0;
                j++;
                boxCount++;
            }
            j = 0;
            uVar = 0.0;
            vVar += 1.0 / gridSizeV;
            posX = 0.0;
            posY += 2.0;
            i++;
        }

        var superGeometry = new THREE.BufferGeometry();
        superGeometry.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array(this.vertices), 3 ) );
        superGeometry.addAttribute( 'uv', new THREE.BufferAttribute( new Float32Array(this.uvs), 2 ) );
        superGeometry.setIndex( new THREE.BufferAttribute( new Uint32Array(this.index), 1 ) );

        var superBox = new THREE.Mesh(superGeometry, material);
        scenePerspective.scene.add(superBox);
    };

    Home.prototype.resizeDisplayGL = function () {
        this.controls.handleResize();
    };

    Home.prototype.render = function () {
        this.controls.update();
    };

    Home.prototype.renderPost = function () {
    };

    return Home;
})();


KSX.apps.demos.Home.BoxBuilder = {
    buildBox: function (scope, count, xOffset, yOffset, zOffset, uvMinU, uvMaxU, uvMinV, uvMaxV) {

        scope.vertices.push(
            -1.0 + xOffset, -1.0 + yOffset,  1.0 + zOffset, //0
             1.0 + xOffset, -1.0 + yOffset,  1.0 + zOffset, //1
             1.0 + xOffset,  1.0 + yOffset,  1.0 + zOffset, //2
            -1.0 + xOffset,  1.0 + yOffset,  1.0 + zOffset, //3

             1.0 + xOffset, -1.0 + yOffset, -1.0 + zOffset, //4
            -1.0 + xOffset, -1.0 + yOffset, -1.0 + zOffset, //5
            -1.0 + xOffset,  1.0 + yOffset, -1.0 + zOffset, //6
             1.0 + xOffset,  1.0 + yOffset, -1.0 + zOffset  //h
        );

        scope.normals.push();

        scope.uvs.push(
            uvMinU, uvMinV,
            uvMaxU, uvMinV,
            uvMaxU, uvMaxV,
            uvMinU, uvMaxV,

            uvMaxU, uvMinV,
            uvMinU, uvMinV,
            uvMinU, uvMaxV,
            uvMaxU, uvMaxV
        );

        var a = 0 + 8 * count;
        var b = 1 + 8 * count;
        var c = 2 + 8 * count;
        var d = 3 + 8 * count;
        var e = 4 + 8 * count;
        var f = 5 + 8 * count;
        var g = 6 + 8 * count;
        var h = 7 + 8 * count;
        scope.index.push(
            // front
            a, b, c,
            a, c, d,

            // back
            e, f, g,
            e, g, h,

            //left
            f, a, d,
            f, d, g,

            // right
            b, e, h,
            b, h, c,

            // top
            d, c, h,
            d, h, g,

            // bottom
            a, e, b,
            a, f, e
        );

    }
};



if (KSX.globals.preChecksOk) {
    var implementations = new Array();
    implementations.push(new KSX.apps.demos.Home(document.getElementById("DivGLFullCanvas")));
    var appRunner = new KSX.apps.demos.AppRunner(implementations);
    appRunner.init(true);
}
