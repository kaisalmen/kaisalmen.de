/**
 * Created by Kai Salmen.
 */

'use strict';

KSX.apps.demos.PixelProtestApp = (function () {

    function PixelProtestApp(elementToBindTo) {
        var userDefinition = {
            user : this,
            name : 'PixelProtest',
            htmlCanvas : elementToBindTo,
            useScenePerspective : false,
            useSceneOrtho : true
        };
        this.app = new KSX.apps.core.ThreeJsApp(userDefinition);

        this.shader = new KSX.apps.shader.PixelProtestShader(this.app.canvas.getWidth(), this.app.canvas.getHeight());

        var uiParams = {
            css: 'top: 0px; left: 0px;',
            size: 512,
            center: false,
            color: 'rgba(224, 224, 224, 1.0)',
            bg: 'rgba(40, 40, 40, 0.66)'
        };
        var paramsDimension = {
            desktop : {
                numberPrecision : 6
            },
            mobile : {
                slidesHeight : 96,
                numberPrecision : 6
            }
        };
        this.uiTools = new KSX.apps.tools.UiTools(uiParams, paramsDimension, bowser.mobile);

        this.uiElemWidth = null;
        this.uiElemHeight = null;
        
        this.animateNoise = true;
        this.animationRate = 30;

        this.randomize = true;
        this.randomR = null;
        this.randomG = null;
        this.randomB = null;

        this.saveImageData = false;
        this.dataTools = new KSX.apps.tools.DataTools();
    }

    PixelProtestApp.prototype.initAsyncContent = function() {
        var scope = this;

        var callbackOnSuccess = function () {
            scope.app.initSynchronuous();
        };
        this.shader.loadResources(callbackOnSuccess);
    };

    PixelProtestApp.prototype.initPreGL = function () {
        this.initUI(this.app.canvas.getWidth() / 4.0, this.app.canvas.getWidth(),
            this.app.canvas.getHeight() / 4.0, this.app.canvas.getHeight());
    };

    PixelProtestApp.prototype.initUI = function (width, maxWidth, height, maxHeight) {
        var scope = this;
        var ui = scope.uiTools.ui;

        ui.clear();

        var enableNoiseAnimation = function (enabled) {
            scope.animateNoise = enabled;
            scope.recalcRandom();
        };
        var adjustAnimationRate = function (value) {
            scope.animationRate = value;
        };
        var adjustWidth = function (value) {
            scope.shader.uniforms.width.value = value;
            scope.recalcRandom();
        };
        var adjustHeight = function (value) {
            scope.shader.uniforms.height.value = value;
            scope.recalcRandom();
        };
        var enableRandomize = function (enabled) {
            scope.randomize = enabled;
        };
        var adjustRandomizeR = function (value) {
            scope.shader.uniforms.offsetR.value = value;
        };
        var adjustRandomizeG = function (value) {
            scope.shader.uniforms.offsetG.value = value;
        };
        var adjustRandomizeB = function (value) {
            scope.shader.uniforms.offsetB.value = value;
        };
        var enableR = function (enabled) {
            scope.shader.uniforms.useR.value = enabled;
        };
        var enableG = function (enabled) {
            scope.shader.uniforms.useG.value = enabled;
        };
        var enableB = function (enabled) {
            scope.shader.uniforms.useB.value = enabled;
        };
        var saveImage = function () {
            scope.saveImageData = true;
        };

        var groupAnimation = ui.add('group', {
            name: 'Animation Control',
            height: scope.uiTools.paramsDimension.groupHeight
        });
        groupAnimation.add('bool', {
            name: 'Animate',
            value: scope.animateNoise,
            callback: enableNoiseAnimation,
            height: scope.uiTools.paramsDimension.boolHeight
        });
        groupAnimation.add('slide', {
            name: 'Change nth frame',
            callback: adjustAnimationRate,
            min: 1,
            max: 60,
            value: scope.animationRate,
            precision: 0,
            step: 1,
            width: scope.uiTools.paramsDimension.slidesWidth,
            height: scope.uiTools.paramsDimension.slidesHeight,
            stype: scope.uiTools.paramsDimension.sliderType
        });
        groupAnimation.open();

        var groupDimensions = ui.add('group', {
            name: 'Dimensions',
            height: scope.uiTools.paramsDimension.groupHeight
        });
        if (width > maxWidth) {
            width = maxWidth;
        }
        scope.uiElemWidth = groupDimensions.add('slide', {
            name: 'Width',
            callback: adjustWidth,
            min: 2,
            max: maxWidth,
            value: Math.round(width),
            precision: 0,
            step: 1,
            width: scope.uiTools.paramsDimension.slidesWidth,
            height: scope.uiTools.paramsDimension.slidesHeight,
            stype: scope.uiTools.paramsDimension.sliderType
        });
        if (height > maxHeight) {
            height = maxHeight;
        }
        scope.uiElemHeight = groupDimensions.add('slide', {
            name: 'Height',
            callback: adjustHeight,
            min: 2,
            max: maxHeight,
            value: Math.round(height),
            precision: 0,
            step: 1,
            width: scope.uiTools.paramsDimension.slidesWidth,
            height: scope.uiTools.paramsDimension.slidesHeight,
            stype: scope.uiTools.paramsDimension.sliderType
        });
        groupDimensions.open();

        var groupChannels = ui.add('group', {
            name: 'Channels',
            height: scope.uiTools.paramsDimension.groupHeight
        });
        groupChannels.add('bool', {
            name: 'Randomize on change',
            value: scope.randomize,
            callback: enableRandomize,
            height: scope.uiTools.paramsDimension.boolHeight
        });
        scope.randomR = groupChannels.add('number', {
            name: 'Random Offset R',
            value: this.shader.uniforms.offsetR.value,
            callback: adjustRandomizeR,
            precision: scope.uiTools.paramsDimension.numberPrecision,
            min: 0,
            max: 1
        });
        scope.randomG = groupChannels.add('number', {
            name: 'Random Offset G',
            value: this.shader.uniforms.offsetG.value,
            callback: adjustRandomizeG,
            precision: scope.uiTools.paramsDimension.numberPrecision,
            min: 0,
            max: 1
        });
        scope.randomB = groupChannels.add('number', {
            name: 'Random Offset B',
            value: this.shader.uniforms.offsetB.value,
            callback: adjustRandomizeB,
            precision: scope.uiTools.paramsDimension.numberPrecision,
            min: 0,
            max: 1
        });
        groupChannels.add('bool', {
            name: 'Use R',
            value: scope.shader.uniforms.useR.value,
            callback: enableR,
            height: scope.uiTools.paramsDimension.boolHeight
        });
        groupChannels.add('bool', {
            name: 'Use B',
            value: scope.shader.uniforms.useG.value,
            callback: enableG,
            height: scope.uiTools.paramsDimension.boolHeight
        });
        groupChannels.add('bool', {
            name: 'Use B',
            value: scope.shader.uniforms.useB.value,
            callback: enableB,
            height: scope.uiTools.paramsDimension.boolHeight
        });
        ui.add('button', {
            name: 'Save Image',
            callback: saveImage,
            width: scope.uiTools.paramsDimension.buttonWidth,
            height: scope.uiTools.paramsDimension.buttonHeight
        });
    };

    PixelProtestApp.prototype.initGL = function () {
        var geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
        var material = this.shader.buildShaderMaterial();
        this.mesh = new THREE.Mesh(geometry, material);

        this.app.sceneOrtho.scene.add(this.mesh);
    };

    PixelProtestApp.prototype.resizeDisplayGL = function () {
        this.mesh.scale.x = this.app.canvas.getWidth();
        this.mesh.scale.y = this.app.canvas.getHeight();

        this.initUI(this.uiElemWidth.value, this.app.canvas.getWidth(), this.uiElemHeight.value, this.app.canvas.getHeight());
    };

    PixelProtestApp.prototype.render = function () {
        if (this.animateNoise) {
            var proceed = this.app.frameNumber % this.animationRate === 0;
            if (proceed) {
                this.recalcRandom();
            }
        }
    };

    PixelProtestApp.prototype.renderPost = function () {
        if (this.saveImageData) {
            // in case of error in sub-sequent section, this block will not be entered again
            this.saveImageData = false;

            var imgData = this.app.renderer.domElement.toDataURL();

            var blob = this.dataTools.dataURItoBlob(imgData, 'image/png');
            if (blob !== undefined) {
                saveAs(blob, "PixelProtest.png");
            }
            else {
                alert('Unable to save canvas data to image file!');
            }
        }
    };

    PixelProtestApp.prototype.recalcRandom = function () {
            if (this.randomize) {
            this.shader.uniforms.offsetR.value = Math.random();
            this.randomR.setValue(this.shader.uniforms.offsetR.value);

            this.shader.uniforms.offsetG.value = Math.random();
            this.randomG.setValue(this.shader.uniforms.offsetG.value);

            this.shader.uniforms.offsetB.value = Math.random();
            this.randomB.setValue(this.shader.uniforms.offsetB.value);
        }
    };

    return PixelProtestApp;
})();
