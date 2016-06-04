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
        this.videoTextureEnabled = true;

        this.animate = false;

        this.controls = null;

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

        this.gridParams = {
            sizeX : 360,
            sizeY : 640,
            uMin : 0.0,
            vMin : 0.0,
            uMax : 1.0,
            vMax : 1.0,
            cubeEdgeLength : 0.5,
            posStartX : 0.0,
            posStartY : 0.0,
            useIndices : false
        };

        if (bowser.mobile) {
            this.gridParams.sizeX = 128;
            this.gridParams.sizeY = 128;
            this.gridParams.posStartX = -this.gridParams.sizeX / (2.0 / 0.5);
            this.gridParams.posStartY = -this.gridParams.sizeY / (2.0 / 0.5);
            this.shader.uniforms.heightFactor.value = 24.0;
        }
        else {
            this.gridParams.posStartX = -this.gridParams.sizeX / (2.0 / 0.5);
            this.gridParams.posStartY = -this.gridParams.sizeY / (2.0 / 0.5);
            this.shader.uniforms.heightFactor.value = 6.0;
        }

        this.superBoxGroup = null;

        this.textStorage = new KSX.apps.core.Text2d();
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
        var enableAnimation = function (enabled) {
            scope.animate = enabled;
        };
        var resetView = function () {
            scope.controls.reset();
            scope.superBoxGroup.rotation.y = 0;
        };
        var enableVideo = function (enabled) {
            scope.videoTextureEnabled = enabled;
            scope.checkVideo();
        };
        var playVideo = function () {
            if (scope.videoTextureEnabled) {
                scope.video.play();
            }
            scope.checkVideo();
        };
        var pauseVideo = function () {
            if (scope.videoTextureEnabled) {
                scope.video.pause();
            }            
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
        var groupVideo = ui.add('group', {
            name: 'Video Control',
            height: scope.uiTools.paramsDimension.groupHeight
        });
        groupVideo.add('bool', {
            name: 'Enable Video',
            value: scope.videoTextureEnabled,
            callback: enableVideo,
            height: scope.uiTools.paramsDimension.boolHeight
        });
        groupVideo.add('button', {
            name: 'Play Video',
            callback: playVideo,
            width: scope.uiTools.paramsDimension.buttonWidth,
            height: scope.uiTools.paramsDimension.buttonHeight
        });
        groupVideo.add('button', {
            name: 'Pause Video',
            callback: pauseVideo,
            width: scope.uiTools.paramsDimension.buttonWidth,
            height: scope.uiTools.paramsDimension.buttonHeight
        });
        groupVideo.open();
    };

    Home.prototype.initGL = function () {
        var gl = this.app.renderer.getContext();

        var result = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
        if (result != 0) {
            console.log("Vertex shader is able to read texture: " + result);
        }
        else {
            alert("Vertex shader is unable to access textures. Aborting...");
            this.app.initError = true;
            return;
        }
        this.app.renderer.setClearColor(0x202020);

        this.app.scenePerspective.setCameraDefaults(
            new THREE.Vector3(this.gridParams.sizeX / 4.0, this.gridParams.sizeY / 4.0, this.gridParams.sizeY / 2.0),
            null,
            new THREE.Vector3(this.gridParams.sizeX / 4.0, this.gridParams.sizeY / 4.0, 0));

        this.controls = new THREE.TrackballControls(this.app.scenePerspective.camera);

        this.videoBuffer.width = 1920;
        this.videoBuffer.height = 804;
        this.videoBufferContext.fillStyle = "#000000";
        this.videoBufferContext.fillRect(0, 0, 1920, 804);

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
        this.checkVideo();

        this.superBoxGroup = new THREE.Group();
        this.app.scenePerspective.scene.add(this.superBoxGroup);

        this.gridParams.uMin = 0.0;
        this.gridParams.vMin = 0.0;
        this.gridParams.uMax = 0.5;
        this.gridParams.vMax = 0.5;
        var box = this.buildSuperBox(this.gridParams, material);
        this.superBoxGroup.add(box);

        this.gridParams.uMin = 0.5;
        this.gridParams.vMin = 0.0;
        this.gridParams.uMax = 1.0;
        this.gridParams.vMax = 0.5;
        box = this.buildSuperBox(this.gridParams, material);
        box.translateX(320);
        this.superBoxGroup.add(box);


        this.gridParams.uMin = 0.0;
        this.gridParams.vMin = 0.5;
        this.gridParams.uMax = 0.5;
        this.gridParams.vMax = 1.0;
        box = this.buildSuperBox(this.gridParams, material);
        box.translateY(180);
        this.superBoxGroup.add(box);

        this.gridParams.uMin = 0.5;
        this.gridParams.vMin = 0.5;
        this.gridParams.uMax = 1.0;
        this.gridParams.vMax = 1.0;
        box = this.buildSuperBox(this.gridParams, material);
        box.translateX(320);
        box.translateY(180);
        this.superBoxGroup.add(box);

        var textWelcome = this.textStorage.addText( 'Welcome', 'Welcome to', new THREE.MeshBasicMaterial(), 100, 10);
        textWelcome.mesh.position.set(200, 0, 100);
        var textDomain = this.textStorage.addText( 'Domaine', 'www.kaisalmen.de', new THREE.MeshBasicMaterial(), 100, 10);
        textDomain.mesh.position.set(0, -200, 100);
        this.app.scenePerspective.scene.add(textWelcome.mesh);
        this.app.scenePerspective.scene.add(textDomain.mesh);

        //new THREE.TextGeometry();
    };

    Home.prototype.buildSuperBox = function (globalParams, material) {

        var boxBuildParams = {
            count : 0,
            cubeDimension : globalParams.cubeEdgeLength,
            xOffset : globalParams.posStartX,
            yOffset : globalParams.posStartY,
            zOffset : 0.0,
            uVar : globalParams.uMin,
            vVar : globalParams.vMin,
            uvLocalMinU : globalParams.uMin,
            uvLocalMaxU : globalParams.uMin,
            uvLocalMinV : globalParams.vMin,
            uvLocalMaxV : globalParams.vMin,
            vertices : new Array(),
            normals : new Array(),
            uvs : new Array(),
            useIndices : globalParams.useIndices,
            indices : new Array()
        };

        var i = 0;
        var j = 0;
        var uDiff = (globalParams.uMax - globalParams.uMin);
        var vDiff = (globalParams.vMax - globalParams.vMin);
        while (i < globalParams.sizeX) {
            while (j < globalParams.sizeY) {
                boxBuildParams.uvLocalMinU = boxBuildParams.uVar;
                boxBuildParams.uvLocalMaxU = boxBuildParams.uVar;
                boxBuildParams.uvLocalMinV = boxBuildParams.vVar;
                boxBuildParams.uvLocalMaxV = boxBuildParams.vVar;
                this.buildSingleBox(boxBuildParams);
                boxBuildParams.uVar += uDiff / globalParams.sizeY;
                boxBuildParams.xOffset += globalParams.cubeEdgeLength;
                boxBuildParams.count++;
                j++;
            }

            boxBuildParams.uVar = globalParams.uMin;
            boxBuildParams.vVar += vDiff / globalParams.sizeX;
            boxBuildParams.xOffset = globalParams.posStartX;
            boxBuildParams.yOffset += globalParams.cubeEdgeLength;
            j = 0;
            i++;
        }

        var superGeometry = new THREE.BufferGeometry();
        superGeometry.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array(boxBuildParams.vertices), 3 ) );
        superGeometry.addAttribute( 'uv', new THREE.BufferAttribute( new Float32Array(boxBuildParams.uvs), 2 ) );
        if (boxBuildParams.useIndices) {
            superGeometry.setIndex(new THREE.BufferAttribute(new Uint32Array(boxBuildParams.indices), 1));
        }

        return new THREE.Mesh(superGeometry, material);
    };

    Home.prototype.buildSingleBox = function (boxBuildParams) {
        var vertexValue = boxBuildParams.cubeDimension / 2.0;
        var v0x = -vertexValue + boxBuildParams.xOffset;
        var v0y = -vertexValue + boxBuildParams.yOffset;
        var v0z =  vertexValue + boxBuildParams.zOffset;
        var v1x =  vertexValue + boxBuildParams.xOffset;
        var v1y = -vertexValue + boxBuildParams.yOffset;
        var v1z =  vertexValue + boxBuildParams.zOffset;
        var v2x =  vertexValue + boxBuildParams.xOffset;
        var v2y =  vertexValue + boxBuildParams.yOffset;
        var v2z =  vertexValue + boxBuildParams.zOffset;
        var v3x = -vertexValue + boxBuildParams.xOffset;
        var v3y =  vertexValue + boxBuildParams.yOffset;
        var v3z =  vertexValue + boxBuildParams.zOffset;
        var v4x =  vertexValue + boxBuildParams.xOffset;
        var v4y = -vertexValue + boxBuildParams.yOffset;
        var v4z = -vertexValue + boxBuildParams.zOffset;
        var v5x = -vertexValue + boxBuildParams.xOffset;
        var v5y = -vertexValue + boxBuildParams.yOffset;
        var v5z = -vertexValue + boxBuildParams.zOffset;
        var v6x = -vertexValue + boxBuildParams.xOffset;
        var v6y =  vertexValue + boxBuildParams.yOffset;
        var v6z = -vertexValue + boxBuildParams.zOffset;
        var v7x =  vertexValue + boxBuildParams.xOffset;
        var v7y =  vertexValue + boxBuildParams.yOffset;
        var v7z = -vertexValue + boxBuildParams.zOffset;

        if (boxBuildParams.useIndices) {
            boxBuildParams.vertices.push(
                v0x, v0y, v0z,
                v1x, v1y, v1z,
                v2x, v2y, v2z,
                v3x, v3y, v3z,
                v4x, v4y, v4z,
                v5x, v5y, v5z,
                v6x, v6y, v6z,
                v7x, v7y, v7z
            );

            boxBuildParams.normals.push();

            boxBuildParams.uvs.push(
                boxBuildParams.uvLocalMinU, boxBuildParams.uvLocalMinV,
                boxBuildParams.uvLocalMaxU, boxBuildParams.uvLocalMinV,
                boxBuildParams.uvLocalMaxU, boxBuildParams.uvLocalMaxV,
                boxBuildParams.uvLocalMinU, boxBuildParams.uvLocalMaxV,
                boxBuildParams.uvLocalMaxU, boxBuildParams.uvLocalMinV,
                boxBuildParams.uvLocalMinU, boxBuildParams.uvLocalMinV,
                boxBuildParams.uvLocalMinU, boxBuildParams.uvLocalMaxV,
                boxBuildParams.uvLocalMaxU, boxBuildParams.uvLocalMaxV
            );

            var i0 = 8 * boxBuildParams.count;
            var i1 = 1 + 8 * boxBuildParams.count;
            var i2 = 2 + 8 * boxBuildParams.count;
            var i3 = 3 + 8 * boxBuildParams.count;
            var i4 = 4 + 8 * boxBuildParams.count;
            var i5 = 5 + 8 * boxBuildParams.count;
            var i6 = 6 + 8 * boxBuildParams.count;
            var i7 = 7 + 8 * boxBuildParams.count;
            boxBuildParams.indices.push(
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
            boxBuildParams.vertices.push(
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

            boxBuildParams.uvs.push(
                boxBuildParams.uvLocalMinU, boxBuildParams.uvLocalMinV,
                boxBuildParams.uvLocalMaxU, boxBuildParams.uvLocalMinV,
                boxBuildParams.uvLocalMaxU, boxBuildParams.uvLocalMaxV,
                boxBuildParams.uvLocalMinU, boxBuildParams.uvLocalMinV,
                boxBuildParams.uvLocalMaxU, boxBuildParams.uvLocalMaxV,
                boxBuildParams.uvLocalMinU, boxBuildParams.uvLocalMaxV,
                boxBuildParams.uvLocalMaxU, boxBuildParams.uvLocalMinV,
                boxBuildParams.uvLocalMinU, boxBuildParams.uvLocalMinV,
                boxBuildParams.uvLocalMinU, boxBuildParams.uvLocalMaxV,
                boxBuildParams.uvLocalMaxU, boxBuildParams.uvLocalMinV,
                boxBuildParams.uvLocalMinU, boxBuildParams.uvLocalMaxV,
                boxBuildParams.uvLocalMaxU, boxBuildParams.uvLocalMaxV,
                boxBuildParams.uvLocalMinU, boxBuildParams.uvLocalMinV,
                boxBuildParams.uvLocalMinU, boxBuildParams.uvLocalMinV,
                boxBuildParams.uvLocalMinU, boxBuildParams.uvLocalMaxV,
                boxBuildParams.uvLocalMinU, boxBuildParams.uvLocalMinV,
                boxBuildParams.uvLocalMinU, boxBuildParams.uvLocalMaxV,
                boxBuildParams.uvLocalMinU, boxBuildParams.uvLocalMaxV,
                boxBuildParams.uvLocalMaxU, boxBuildParams.uvLocalMinV,
                boxBuildParams.uvLocalMaxU, boxBuildParams.uvLocalMinV,
                boxBuildParams.uvLocalMaxU, boxBuildParams.uvLocalMaxV,
                boxBuildParams.uvLocalMaxU, boxBuildParams.uvLocalMinV,
                boxBuildParams.uvLocalMaxU, boxBuildParams.uvLocalMaxV,
                boxBuildParams.uvLocalMaxU, boxBuildParams.uvLocalMaxV,
                boxBuildParams.uvLocalMinU, boxBuildParams.uvLocalMaxV,
                boxBuildParams.uvLocalMaxU, boxBuildParams.uvLocalMaxV,
                boxBuildParams.uvLocalMaxU, boxBuildParams.uvLocalMaxV,
                boxBuildParams.uvLocalMinU, boxBuildParams.uvLocalMaxV,
                boxBuildParams.uvLocalMaxU, boxBuildParams.uvLocalMaxV,
                boxBuildParams.uvLocalMinU, boxBuildParams.uvLocalMaxV,
                boxBuildParams.uvLocalMinU, boxBuildParams.uvLocalMinV,
                boxBuildParams.uvLocalMaxU, boxBuildParams.uvLocalMinV,
                boxBuildParams.uvLocalMaxU, boxBuildParams.uvLocalMinV,
                boxBuildParams.uvLocalMinU, boxBuildParams.uvLocalMinV,
                boxBuildParams.uvLocalMinU, boxBuildParams.uvLocalMinV,
                boxBuildParams.uvLocalMaxU, boxBuildParams.uvLocalMinV
            );
        }
    };

    Home.prototype.resizeDisplayGL = function () {
        this.controls.handleResize();
    };

    Home.prototype.renderPre = function () {
        if (this.animate && this.superBoxGroup !== undefined) {
            this.superBoxGroup.rotateY(0.001);
        }
        this.controls.update();

        if (this.videoTextureEnabled && this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
            this.videoBufferContext.drawImage(this.video, 0, 0);
            this.videoTexture.needsUpdate = true;
        }
    };

    Home.prototype.renderPrePost = function () {
        this.stats.update();
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
            this.shader.uniforms.texture1.value = texture;
        }
    };

    return Home;
})();
