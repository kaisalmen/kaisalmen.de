/**
 * Created by Kai Salmen.
 */

'use strict';


KSX.apps.demos.Home = (function () {

    var SLIDES_WIDTH = 255;
    var SLIDES_HEIGHT = 32;

    var BUTTON_WIDTH = 104;
    var BUTTON_HEIGHT = 32;

    var MIN_VALUE = 0.0;
    var MAX_VALUE = 255.0;

    function Home(elementToBindTo) {
        this.app = new KSX.apps.core.ThreeJsApp(this, "Home", elementToBindTo, false, true, false);

        this.shader = new KSX.apps.shader.BlockShader();

        this.controls = null;

        this.vertices = new Array();
        this.normals = new Array();
        this.uvs = new Array();
        this.useIndices = false;
        this.index = new Array();

        UIL.BUTTON = '#FF4040';
        this.ui = new UIL.Gui({
            css: 'top: 0px; left: 0px;',
            size: 384,
            center: false,
            color: 'rgba(224, 224, 224, 1.0)',
            bg: 'rgba(40, 40, 40, 0.66)'
        });

        this.stats = new Stats();
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.left = '';
        this.stats.domElement.style.right = '0px';
        this.stats.domElement.style.top = '0px';

        this.gridParams = {
            sizeX : 512,
            sizeY : 512,
            uMin : 0.0,
            vMin : 0.0,
            uMax : 1.0,
            vMax : 1.0,
            cubeEdgeLength : 0.5,
            posStartX : -512.0 / (2.0 / 0.5),
            posStartY : -512.0 / (2.0 / 0.5)
        };

        if (bowser.mobile) {
            this.gridParams.sizeX = 128;
            this.gridParams.sizeY = 128;
            this.gridParams.posStartX = -this.gridParams.sizeX / (2.0 / 0.5);
            this.gridParams.posStartY = -this.gridParams.sizeY / (2.0 / 0.5)
            this.shader.uniforms.heightFactor.value = 24.0;
        }
    }

    Home.prototype.initAsyncContent = function() {
        var scope = this;

        var callbackOnSuccess = function () {
            scope.app.initSynchronuous();
        };
        this.shader.loadResources(callbackOnSuccess);
    };

    Home.prototype.initPreGL = function () {
        var scope = this;

        scope.stats.showPanel(0);
        document.body.appendChild(scope.stats.domElement);

        var adjustHeightFactor = function (value) {
            scope.shader.uniforms.heightFactor.value = value;
        };
        var resetCamera = function () {
            scope.controls.reset();
        };

        scope.ui.add('slide', {
            name: 'heightFactor',
            callback: adjustHeightFactor,
            min: MIN_VALUE,
            max: MAX_VALUE,
            value: scope.shader.uniforms.heightFactor.value,
            precision: 1,
            step: 1,
            width: SLIDES_WIDTH,
            height: SLIDES_HEIGHT
        });
        scope.ui.add('button', {
            name: 'Reset Camera',
            callback: resetCamera,
            width: BUTTON_WIDTH,
            height: BUTTON_HEIGHT
        });
    };

    Home.prototype.initGL = function () {
        var renderer = this.app.renderer;
        var scenePerspective = this.app.scenePerspective;

        var gl = renderer.getContext();

        var result = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
        if (result != 0) {
            console.log("Vertex shader is able to read texture: " + result);
        }
        else {
            alert("Vertex shader is unable to access textures. Aborting...");
            this.app.initError = true;
            return;
        }
        renderer.setClearColor( 0x202020 );

        scenePerspective.setCameraDefaults(
            new THREE.Vector3(this.gridParams.sizeX / 4.0, this.gridParams.sizeY / 4.0, this.gridParams.sizeY / 2.0),
            null,
            new THREE.Vector3(this.gridParams.sizeX / 4.0, this.gridParams.sizeY / 4.0, 0));

        this.controls = new THREE.TrackballControls(scenePerspective.camera);
/*
        var lightColor = 0xE0E0E0;
        var lightPos = new THREE.Vector3(100, 100, 100);
        var directionalLight = new THREE.DirectionalLight(lightColor);
        directionalLight.position.set(lightPos.x, lightPos.y, lightPos.z);
        scenePerspective.scene.add(directionalLight);

        var helper = new THREE.GridHelper( 100, 2 );
        helper.setColors( 0xFF4444, 0x404040 );
        scenePerspective.scene.add(helper);
 */
        var material = this.shader.buildShaderMaterial();
//        material.wireframe = true;

        var uVar = this.gridParams.uMin;
        var vVar = this.gridParams.vMin;
        var posX = this.gridParams.posStartX;
        var posY = this.gridParams.posStartY;

        var i = 0;
        var j = 0;
        var boxCount = 0;

        while (i < this.gridParams.sizeX) {
            while (j < this.gridParams.sizeY) {
                KSX.apps.demos.Home.BoxBuilder.buildBox(this, boxCount, this.gridParams.cubeEdgeLength, posX, posY, 0.0, uVar, uVar, vVar, vVar);
                uVar += this.gridParams.uMax / this.gridParams.sizeX;
                posX += this.gridParams.cubeEdgeLength;
                j++;
                boxCount++;
            }

            uVar = this.gridParams.uMin;
            vVar += this.gridParams.vMax / this.gridParams.sizeY;
            posX = this.gridParams.posStartX;
            posY += this.gridParams.cubeEdgeLength;

            j = 0;
            i++;
        }

        var superGeometry = new THREE.BufferGeometry();
        superGeometry.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array(this.vertices), 3 ) );
        superGeometry.addAttribute( 'uv', new THREE.BufferAttribute( new Float32Array(this.uvs), 2 ) );
        if (this.useIndices) {
            superGeometry.setIndex(new THREE.BufferAttribute(new Uint32Array(this.index), 1));
        }

        var superBox = new THREE.Mesh(superGeometry, material);
        scenePerspective.scene.add(superBox);

        this.vertices = null;
        this.normals = null;
        this.uvs = null;
        this.index = null;
    };

    Home.prototype.resizeDisplayGL = function () {
        this.controls.handleResize();
    };

    Home.prototype.render = function () {
        this.controls.update();
        this.stats.update();
    };

    Home.prototype.renderPost = function () {
    };

    return Home;
})();


KSX.apps.demos.Home.BoxBuilder = {
    buildBox: function (scope, count, cubeDimension, xOffset, yOffset, zOffset, uvMinU, uvMaxU, uvMinV, uvMaxV) {

        var vertexValue = cubeDimension / 2.0;
        var v0 = new THREE.Vector3(-vertexValue + xOffset, -vertexValue + yOffset,  vertexValue + zOffset);
        var v1 = new THREE.Vector3( vertexValue + xOffset, -vertexValue + yOffset,  vertexValue + zOffset);
        var v2 = new THREE.Vector3( vertexValue + xOffset,  vertexValue + yOffset,  vertexValue + zOffset);
        var v3 = new THREE.Vector3(-vertexValue + xOffset,  vertexValue + yOffset,  vertexValue + zOffset);
        var v4 = new THREE.Vector3( vertexValue + xOffset, -vertexValue + yOffset, -vertexValue + zOffset);
        var v5 = new THREE.Vector3(-vertexValue + xOffset, -vertexValue + yOffset, -vertexValue + zOffset);
        var v6 = new THREE.Vector3(-vertexValue + xOffset,  vertexValue + yOffset, -vertexValue + zOffset);
        var v7 = new THREE.Vector3( vertexValue + xOffset,  vertexValue + yOffset, -vertexValue + zOffset);

        var uv0 = new THREE.Vector2(uvMinU, uvMinV);
        var uv1 = new THREE.Vector2(uvMaxU, uvMinV);
        var uv2 = new THREE.Vector2(uvMaxU, uvMaxV);
        var uv3 = new THREE.Vector2(uvMinU, uvMaxV);
        var uv4 = new THREE.Vector2(uvMaxU, uvMinV);
        var uv5 = new THREE.Vector2(uvMinU, uvMinV);
        var uv6 = new THREE.Vector2(uvMinU, uvMaxV);
        var uv7 = new THREE.Vector2(uvMaxU, uvMaxV);

        if (this.useIndices) {
            scope.vertices.push(
                v0.x, v0.y, v0.z,
                v1.x, v1.y, v1.z,
                v2.x, v2.y, v2.z,
                v3.x, v3.y, v3.z,
                v4.x, v4.y, v4.z,
                v5.x, v5.y, v5.z,
                v6.x, v6.y, v6.z,
                v7.x, v7.y, v7.z
            );

            scope.normals.push();

            scope.uvs.push(
                uv0.x, uv0.y,
                uv1.x, uv1.y,
                uv2.x, uv2.y,
                uv3.x, uv3.y,
                uv4.x, uv4.y,
                uv5.x, uv5.y,
                uv6.x, uv6.y,
                uv7.x, uv7.y
            );

            var i0 = 0 + 8 * count;
            var i1 = 1 + 8 * count;
            var i2 = 2 + 8 * count;
            var i3 = 3 + 8 * count;
            var i4 = 4 + 8 * count;
            var i5 = 5 + 8 * count;
            var i6 = 6 + 8 * count;
            var i7 = 7 + 8 * count;
            scope.index.push(
                // front
                i0, i1, i2,
                i0, i2, i3,

                // back
                i4, i5, i6,
                i4, i6, i7,

                // left
                i5, i0, i3,
                i5, i3, i6,

                // right
                i1, i4, i7,
                i1, i7, i2,

                // top
                i3, i2, i7,
                i3, i7, i6,

                // bottom
                i0, i4, i1,
                i0, i5, i4
            );
        }
        else {
            scope.vertices.push(
                v0.x, v0.y, v0.z,
                v1.x, v1.y, v1.z,
                v2.x, v2.y, v2.z,
                v0.x, v0.y, v0.z,
                v2.x, v2.y, v2.z,
                v3.x, v3.y, v3.z,

                v4.x, v4.y, v4.z,
                v5.x, v5.y, v5.z,
                v6.x, v6.y, v6.z,
                v4.x, v4.y, v4.z,
                v6.x, v6.y, v6.z,
                v7.x, v7.y, v7.z,

                v5.x, v5.y, v5.z,
                v0.x, v0.y, v0.z,
                v3.x, v3.y, v3.z,
                v5.x, v5.y, v5.z,
                v3.x, v3.y, v3.z,
                v6.x, v6.y, v6.z,

                v1.x, v1.y, v1.z,
                v4.x, v4.y, v4.z,
                v7.x, v7.y, v7.z,
                v1.x, v1.y, v1.z,
                v7.x, v7.y, v7.z,
                v2.x, v2.y, v2.z,

                v3.x, v3.y, v3.z,
                v2.x, v2.y, v2.z,
                v7.x, v7.y, v7.z,
                v3.x, v3.y, v3.z,
                v7.x, v7.y, v7.z,
                v6.x, v6.y, v6.z,

                v0.x, v0.y, v0.z,
                v4.x, v4.y, v4.z,
                v1.x, v1.y, v1.z,
                v0.x, v0.y, v0.z,
                v5.x, v5.y, v5.z,
                v4.x, v4.y, v4.z
            );

            scope.uvs.push(
                uv0.x, uv0.y,
                uv1.x, uv1.y,
                uv2.x, uv2.y,
                uv0.x, uv0.y,
                uv2.x, uv2.y,
                uv3.x, uv3.y,
                uv4.x, uv4.y,
                uv5.x, uv5.y,
                uv6.x, uv6.y,
                uv4.x, uv4.y,
                uv6.x, uv6.y,
                uv7.x, uv7.y,
                uv5.x, uv5.y,
                uv0.x, uv0.y,
                uv3.x, uv3.y,
                uv5.x, uv5.y,
                uv3.x, uv3.y,
                uv6.x, uv6.y,
                uv1.x, uv1.y,
                uv4.x, uv4.y,
                uv7.x, uv7.y,
                uv1.x, uv1.y,
                uv7.x, uv7.y,
                uv2.x, uv2.y,
                uv3.x, uv3.y,
                uv2.x, uv2.y,
                uv7.x, uv7.y,
                uv3.x, uv3.y,
                uv7.x, uv7.y,
                uv6.x, uv6.y,
                uv0.x, uv0.y,
                uv4.x, uv4.y,
                uv1.x, uv1.y,
                uv0.x, uv0.y,
                uv5.x, uv5.y,
                uv4.x, uv4.y
            );
        }
    }
};



if (KSX.globals.preChecksOk) {
    var implementations = new Array();
    implementations.push(new KSX.apps.demos.Home(document.getElementById("DivGLFullCanvas")));
    var appRunner = new KSX.apps.demos.AppRunner(implementations);
    appRunner.init(true);
}
