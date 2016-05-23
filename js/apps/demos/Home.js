/**
 * Created by Kai Salmen.
 */

'use strict';


KSX.apps.demos.Home = (function () {

    function Home(elementToBindTo, elementNameVideo, elementNameVideoBuffer) {

        var userDefinition = {
            user : this,
            name : 'Home',
            htmlCanvas : elementToBindTo,
            renderers : {
                regular : {
                    canvas : elementToBindTo,
                    antialias : false
                }
            },
            useScenePerspective : true
        };
        this.app = new KSX.apps.core.ThreeJsApp(userDefinition);

        this.shader = new KSX.apps.shader.BlockShader();

        this.video = elementNameVideo;
        this.videoBuffer = elementNameVideoBuffer;
        this.videoBufferContext = this.videoBuffer.getContext("2d");
        this.videoTexture = null;
        this.videoTextureEnabled = false;

        this.animate = false;

        this.controls = null;

        this.vertices = new Array();
        this.normals = new Array();
        this.uvs = new Array();
        this.useIndices = false;
        this.index = new Array();

        var uiParams = {
            css: 'top: 0px; left: 0px;',
            size: 384,
            center: false,
            color: 'rgba(224, 224, 224, 1.0)',
            bg: 'rgba(40, 40, 40, 0.66)'
        };
        var paramsDimension = {
            mobile : {
                slidesHeight : 96
            }
        };
        this.uiTools = new KSX.apps.tools.UiTools(uiParams, paramsDimension, bowser.mobile);
        
        this.stats = new Stats();
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.left = '';
        this.stats.domElement.style.right = '0px';
        this.stats.domElement.style.top = '0px';

        var gridSize = 512;
        this.gridParams = {
            sizeX : gridSize,
            sizeY : gridSize,
            uMin : 0.0,
            vMin : 0.0,
            uMax : 1.0,
            vMax : 1.0,
            cubeEdgeLength : 0.5,
            posStartX : -gridSize / (2.0 / 0.5),
            posStartY : -gridSize / (2.0 / 0.5)
        };

        if (bowser.mobile) {
            this.gridParams.sizeX = 128;
            this.gridParams.sizeY = 128;
            this.gridParams.posStartX = -this.gridParams.sizeX / (2.0 / 0.5);
            this.gridParams.posStartY = -this.gridParams.sizeY / (2.0 / 0.5);
            this.shader.uniforms.heightFactor.value = 24.0;
        }

        this.superBox;
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
        var ui = scope.uiTools.ui;

        scope.stats.showPanel(0);
        document.body.appendChild(scope.stats.domElement);

        var adjustHeightFactor = function (value) {
            scope.shader.uniforms.heightFactor.value = value;
        };
        var resetView = function () {
            scope.controls.reset();
            scope.superBox.rotation.y = 0;
        };
        var enableVideo = function (enabled) {
            scope.videoTextureEnabled = enabled;
            scope.checkVideo();
        };
        var enableAnimation = function (enabled) {
            scope.animate = enabled;
        };

        ui.add('slide', {
            name: 'heightFactor',
            callback: adjustHeightFactor,
            min: scope.uiTools.paramsDimension.minValue,
            max: scope.uiTools.paramsDimension.maxValue,
            value: scope.shader.uniforms.heightFactor.value,
            precision: 1,
            step: 1,
            width: scope.uiTools.paramsDimension.slidesWidth,
            height: scope.uiTools.paramsDimension.slidesHeight,
            stype: scope.uiTools.paramsDimension.sliderType
        });
        ui.add('bool', {
            name: 'Animate',
            value: scope.animate,
            callback: enableAnimation,
            height: scope.uiTools.paramsDimension.boolHeight
        });
        ui.add('button', {
            name: 'Reset View',
            callback: resetView,
            width: scope.uiTools.paramsDimension.buttonWidth,
            height: scope.uiTools.paramsDimension.buttonHeight
        });
        ui.add('bool', {
            name: 'Enable Video',
            value: scope.videoTextureEnabled,
            callback: enableVideo,
            height: scope.uiTools.paramsDimension.boolHeight
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

        this.videoBuffer.width = 1920;
        this.videoBuffer.height = 1080;
        this.videoBufferContext.fillStyle = "#000000";
        this.videoBufferContext.fillRect(0, 0, 1920, 1080);

        this.videoTexture = new THREE.Texture(this.videoBuffer);
        this.videoTexture.minFilter = THREE.LinearFilter;
        this.videoTexture.magFilter = THREE.LinearFilter;
        this.videoTexture.format = THREE.RGBFormat;
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

        this.superBox = new THREE.Mesh(superGeometry, material);
        scenePerspective.scene.add(this.superBox);

        this.vertices = null;
        this.normals = null;
        this.uvs = null;
        this.index = null;
    };

    Home.prototype.resizeDisplayGL = function () {
        this.controls.handleResize();
    };

    Home.prototype.render = function () {
        if (this.animate && this.superBox !== undefined) {
            this.superBox.rotateY(0.001);
        }
        this.controls.update();
        this.stats.update();

        if (this.videoTextureEnabled && this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
            this.videoBufferContext.drawImage(this.video, 0, 0);
            this.videoTexture.needsUpdate = true;
        }
    };

    Home.prototype.renderPost = function () {
    };

    Home.prototype.checkVideo = function () {
        if (this.videoTextureEnabled) {
            this.video.play();
            this.shader.uniforms.texture1.value = this.videoTexture;
        }
        else {
            this.video.pause();
            this.shader.uniforms.texture1.value = this.shader.textures['default'];
        }
    };

    Home.prototype.flipTexture = function (name) {
        var texture = this.shader.textures[name];
        if (texture !== undefined) {
            if (this.videoTextureEnabled) {
                this.video.pause();
            }
            this.shader.uniforms.texture1.value = texture;
        }
    };

    return Home;
})();

KSX.apps.demos.Home.BoxBuilder = {
    buildBox: function (scope, count, cubeDimension, xOffset, yOffset, zOffset, uvMinU, uvMaxU, uvMinV, uvMaxV) {

        var vertexValue = cubeDimension / 2.0;
        var v0x = -vertexValue + xOffset;
        var v0y = -vertexValue + yOffset;
        var v0z =  vertexValue + zOffset;
        var v1x =  vertexValue + xOffset;
        var v1y = -vertexValue + yOffset;
        var v1z =  vertexValue + zOffset;
        var v2x =  vertexValue + xOffset;
        var v2y =  vertexValue + yOffset;
        var v2z =  vertexValue + zOffset;
        var v3x = -vertexValue + xOffset;
        var v3y =  vertexValue + yOffset;
        var v3z =  vertexValue + zOffset;
        var v4x =  vertexValue + xOffset;
        var v4y = -vertexValue + yOffset;
        var v4z = -vertexValue + zOffset;
        var v5x = -vertexValue + xOffset;
        var v5y = -vertexValue + yOffset;
        var v5z = -vertexValue + zOffset;
        var v6x = -vertexValue + xOffset;
        var v6y =  vertexValue + yOffset;
        var v6z = -vertexValue + zOffset;
        var v7x =  vertexValue + xOffset;
        var v7y =  vertexValue + yOffset;
        var v7z = -vertexValue + zOffset;

        if (this.useIndices) {
            scope.vertices.push(
                v0x, v0y, v0z,
                v1x, v1y, v1z,
                v2x, v2y, v2z,
                v3x, v3y, v3z,
                v4x, v4y, v4z,
                v5x, v5y, v5z,
                v6x, v6y, v6z,
                v7x, v7y, v7z
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

            var i0 = 8 * count;
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
                v0x, v0y, v0z,
                v1x, v1y, v1z,
                v2x, v2y, v2z,
                v0x, v0y, v0z,
                v2x, v2y, v2z,
                v3x, v3y, v3z,

                v4x, v4y, v4z,
                v5x, v5y, v5z,
                v6x, v6y, v6z,
                v4x, v4y, v4z,
                v6x, v6y, v6z,
                v7x, v7y, v7z,

                v5x, v5y, v5z,
                v0x, v0y, v0z,
                v3x, v3y, v3z,
                v5x, v5y, v5z,
                v3x, v3y, v3z,
                v6x, v6y, v6z,

                v1x, v1y, v1z,
                v4x, v4y, v4z,
                v7x, v7y, v7z,
                v1x, v1y, v1z,
                v7x, v7y, v7z,
                v2x, v2y, v2z,

                v3x, v3y, v3z,
                v2x, v2y, v2z,
                v7x, v7y, v7z,
                v3x, v3y, v3z,
                v7x, v7y, v7z,
                v6x, v6y, v6z,

                v0x, v0y, v0z,
                v4x, v4y, v4z,
                v1x, v1y, v1z,
                v0x, v0y, v0z,
                v5x, v5y, v5z,
                v4x, v4y, v4z
            );

            scope.uvs.push(
                uvMinU, uvMinV,
                uvMaxU, uvMinV,
                uvMaxU, uvMaxV,
                uvMinU, uvMinV,
                uvMaxU, uvMaxV,
                uvMinU, uvMaxV,
                uvMaxU, uvMinV,
                uvMinU, uvMinV,
                uvMinU, uvMaxV,
                uvMaxU, uvMinV,
                uvMinU, uvMaxV,
                uvMaxU, uvMaxV,
                uvMinU, uvMinV,
                uvMinU, uvMinV,
                uvMinU, uvMaxV,
                uvMinU, uvMinV,
                uvMinU, uvMaxV,
                uvMinU, uvMaxV,
                uvMaxU, uvMinV,
                uvMaxU, uvMinV,
                uvMaxU, uvMaxV,
                uvMaxU, uvMinV,
                uvMaxU, uvMaxV,
                uvMaxU, uvMaxV,
                uvMinU, uvMaxV,
                uvMaxU, uvMaxV,
                uvMaxU, uvMaxV,
                uvMinU, uvMaxV,
                uvMaxU, uvMaxV,
                uvMinU, uvMaxV,
                uvMinU, uvMinV,
                uvMaxU, uvMinV,
                uvMaxU, uvMinV,
                uvMinU, uvMinV,
                uvMinU, uvMinV,
                uvMaxU, uvMinV
            );
        }
    }
};


if (KSX.globals.preChecksOk) {
    var implementations = new Array();
    var home = new KSX.apps.demos.Home(
        document.getElementById("DivGLFullCanvas"),
        document.getElementById("DivGLFullVideo"),
        document.getElementById("DivGLFullVideoBuffer")
    );
    implementations.push(home);
    var appRunner = new KSX.apps.demos.AppRunner(implementations);
    appRunner.init(true);

    var exchangeImageLinkPTV1 = function () {
        home.flipTexture('linkPTV1');
    };

    var exchangeImageLinkPixelProtest = function () {
        home.flipTexture('linkPixelProtest');
    };

    var exchangeImageDefault = function () {
        home.checkVideo();
    };
}

