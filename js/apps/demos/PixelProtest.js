/**
 * @author Kai Salmen / www.kaisalmen.de
 */

'use strict';

KSX.apps.demos.PixelProtest = (function () {

    PixelProtest.prototype = Object.create(KSX.apps.core.ThreeJsApp.prototype, {
        constructor: {
            configurable: true,
            enumerable: true,
            value: PixelProtest,
            writable: true
        }
    });

    function PixelProtest( elementToBindTo, mobileDevice) {
        KSX.apps.core.ThreeJsApp.call(this);

        this.configure({
            user : this,
            name : 'PixelProtest',
            htmlCanvas : elementToBindTo,
            useScenePerspective : false,
            useSceneOrtho : true
        });

        this.shader = new KSX.apps.shader.PixelProtestShader( this.canvas.getWidth(), this.canvas.getHeight() );
        this.shader.updateDimensions(
            this.canvas.getWidth() / 8, this.canvas.getWidth(),
            this.canvas.getHeight() / 8, this.canvas.getHeight()
        );

        var uiToolsConfig = {
            mobileDevice: mobileDevice,
            useUil: true,
            uilParams: {
                css: 'top: 0px; left: 0px;',
                width: 512,
                center: false,
                color: 'rgba(224, 224, 224, 1.0)',
                bg: 'rgba(40, 40, 40, 0.66)'
            },
            paramsDimension: {
                desktop : {
                    numberPrecision : 6
                },
                mobile : {
                    numberPrecision : 6
                }
            },
            useStats: true
        };
        this.uiTools = new KSX.apps.tools.UiTools( uiToolsConfig );

        this.uiElemWidth = null;
        this.uiElemHeight = null;
        
        this.animateNoise = true;
        this.animationRate = 10;

        this.randomize = true;
        this.randomR = null;
        this.randomG = null;
        this.randomB = null;

        this.saveImageData = false;
        this.dataTools = new KSX.apps.tools.DataTools();
    }

    PixelProtest.prototype.initAsyncContent = function() {
        var scope = this;

        var callbackOnSuccess = function () {
            scope.asyncDone = true;
        };
        this.shader.loadResources(callbackOnSuccess);
    };

    PixelProtest.prototype.initPreGL = function () {
        this.initUI();
        this.uiTools.enableStats();
    };

    PixelProtest.prototype.initUI = function () {
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
        scope.uiElemWidth = groupDimensions.add('slide', {
            name: 'Width',
            callback: adjustWidth,
            min: 2,
            max: scope.shader.maxWidth,
            value: scope.shader.uniforms.width.value,
            precision: 0,
            step: 2,
            width: scope.uiTools.paramsDimension.slidesWidth,
            height: scope.uiTools.paramsDimension.slidesHeight,
            stype: scope.uiTools.paramsDimension.sliderType
        });
        scope.uiElemHeight = groupDimensions.add('slide', {
            name: 'Height',
            callback: adjustHeight,
            min: 2,
            max: scope.shader.maxHeight,
            value: scope.shader.uniforms.height.value,
            precision: 0,
            step: 2,
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

    PixelProtest.prototype.initGL = function () {
        var geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
        var material = this.shader.buildShaderMaterial();
        this.mesh = new THREE.Mesh(geometry, material);

        this.sceneOrtho.scene.add(this.mesh);
    };

    PixelProtest.prototype.resizeDisplayGL = function () {
        this.mesh.scale.x = this.canvas.getWidth();
        this.mesh.scale.y = this.canvas.getHeight();

        var relationWidth = this.canvas.getWidth() * this.uiElemWidth.value / this.uiElemWidth.max;
        var relationHeight = this.canvas.getHeight() * this.uiElemHeight.value / this.uiElemHeight.max;
        this.shader.updateDimensions( relationWidth, this.canvas.getWidth(), relationHeight, this.canvas.getHeight() );

        this.initUI();
    };

    PixelProtest.prototype.renderPre = function () {
        if (this.animateNoise) {
            var proceed = this.frameNumber % this.animationRate === 0;
            if (proceed) {
                this.recalcRandom();
            }
        }
    };

    PixelProtest.prototype.renderPost = function () {
        if (this.saveImageData) {
            // in case of error in sub-sequent section, this block will not be entered again
            this.saveImageData = false;

            var imgData = this.renderer.domElement.toDataURL();

            var blob = this.dataTools.dataURItoBlob(imgData, 'image/png');
            if (blob !== undefined) {
                saveAs(blob, "PixelProtest.png");
            }
            else {
                alert('Unable to save canvas data to image file!');
            }
        }
        this.uiTools.updateStats();
    };

    PixelProtest.prototype.recalcRandom = function () {
        if (this.randomize) {
            this.shader.uniforms.offsetR.value = Math.random();
            this.randomR.setValue(this.shader.uniforms.offsetR.value);

            this.shader.uniforms.offsetG.value = Math.random();
            this.randomG.setValue(this.shader.uniforms.offsetG.value);

            this.shader.uniforms.offsetB.value = Math.random();
            this.randomB.setValue(this.shader.uniforms.offsetB.value);
        }
    };

    return PixelProtest;
})();
