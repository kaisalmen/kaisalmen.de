/**
 * Created by Kai Salmen.
 */

"use strict";

KSX.apps.demos.impl.BlueMarbleApp = (function () {

    var NORMAL_WIDTH = 3712.0;
    var NORMAL_HEIGHT = 3712.0;

    function BlueMarbleApp(elementToBindTo) {
        var userDefinition = {
            user : this,
            name : 'BlueMarble',
            htmlCanvas : elementToBindTo,
            useScenePerspective : false,
            useSceneOrtho : true
        };
        this.app = new KSX.apps.core.ThreeJsApp(userDefinition);

        this.shader = new KSX.apps.shader.BlueMarbleShader();


        var uiParams = {
            css: 'top: 0px; left: 0px;',
            size: 450,
            center: false,
            color: 'rgba(224, 224, 224, 1.0)',
            bg: 'rgba(40, 40, 40, 0.66)'
        };
        var paramsDimension = {
            desktop : {
                colorMin : 0,
                colorMax : 255,
                slidesWidth : 100
            },
            mobile : {
                colorMin : 0,
                colorMax : 255,
                slidesWidth : 100,
                slidesHeight : 96
            }
        };
        this.uiTools = new KSX.apps.tools.UiTools(uiParams, paramsDimension, bowser.mobile);

        this.stats = new Stats();
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.left = '450px';
        this.stats.domElement.style.top = '0px';

        this.zoom = 1.0;
        this.divScale = 1.0;
    }

    BlueMarbleApp.prototype.initAsyncContent = function () {
        var scope = this;

        var callbackOnSuccess = function () {
            scope.app.initSynchronuous();
        };
        this.shader.loadResources(callbackOnSuccess);
    };

    BlueMarbleApp.prototype.initPreGL = function () {
        var scope = this;
        var ui = scope.uiTools.ui;

        var adjustLowerBoundary = function (value) {
            scope.shader.uniforms.lowerBoundary.value = value / scope.uiTools.paramsDimension.maxValue;
        };
        var adjustUpperBoundary = function (value) {
            scope.shader.uniforms.upperBoundary.value = value / scope.uiTools.paramsDimension.maxValue;
        };
        var adjustRed = function (value) {
            scope.shader.uniforms.alphaColor.value[0] = value / scope.uiTools.paramsDimension.maxValue;
        };
        var adjustGreen = function (value) {
            scope.shader.uniforms.alphaColor.value[1] = value / scope.uiTools.paramsDimension.maxValue;
        };
        var adjustBlue = function (value) {
            scope.shader.uniforms.alphaColor.value[2] = value / scope.uiTools.paramsDimension.maxValue;
        };
        var changeDiv = function (value) {
            scope.divScale = value;

            if (scope.app.renderingEndabled) {
                scope.app.canvas.resetWidth(NORMAL_WIDTH * value, NORMAL_HEIGHT * value);
                scope.app.resizeDisplayGL();
            }
        };
        var zoomMarble = function (value) {
            scope.zoom = value;

            if (scope.app.renderingEndabled) {
                scope.mesh.scale.x = value;
                scope.mesh.scale.y = value;
                scope.mesh.scale.z = value;
            }
        };
        var moveCameraX = function (value) {
            if (scope.app.renderingEndabled) {
                var dimX = -scope.app.canvas.getWidth() * 0.5 / scope.divScale;
                scope.mesh.position.x = dimX * scope.zoom * value;
            }
        };
        var moveCameraY = function (value) {
            if (scope.app.renderingEndabled) {
                var dimY = -scope.app.canvas.getHeight() * 0.5 / scope.divScale;
                scope.mesh.position.y = dimY * scope.zoom * value;
            }
        };

        ui.add('slide', {
            name: 'lowerBoundary',
            callback: adjustLowerBoundary,
            min: scope.uiTools.paramsDimension.colorMin,
            max: scope.uiTools.paramsDimension.colorMax,
            value: scope.shader.uniforms.lowerBoundary.value * scope.uiTools.paramsDimension.maxValue,
            precision: 0,
            step: 1,
            width: scope.uiTools.paramsDimension.slidesWidth,
            height: scope.uiTools.paramsDimension.slidesHeight,
            stype: scope.uiTools.paramsDimension.sliderType
        });
        ui.add('slide', {
            name: 'upperBoundary',
            callback: adjustUpperBoundary,
            min: scope.uiTools.paramsDimension.colorMin,
            max: scope.uiTools.paramsDimension.colorMax,
            value: scope.shader.uniforms.upperBoundary.value * scope.uiTools.paramsDimension.maxValue,
            precision: 0,
            step: 1,
            width: scope.uiTools.paramsDimension.slidesWidth,
            height: scope.uiTools.paramsDimension.slidesHeight,
            stype: scope.uiTools.paramsDimension.sliderType
        });
        ui.add('slide', {
            name: 'red',
            callback: adjustRed,
            min: scope.uiTools.paramsDimension.colorMin,
            max: scope.uiTools.paramsDimension.colorMax,
            value: scope.shader.uniforms.alphaColor.value[0] * scope.uiTools.paramsDimension.maxValue,
            precision: 0,
            step: 1,
            width: scope.uiTools.paramsDimension.slidesWidth,
            height: scope.uiTools.paramsDimension.slidesHeight,
            fontColor:'#FF0000'
        });
        ui.add('slide', {
            name: 'green',
            callback: adjustGreen,
            min: scope.uiTools.paramsDimension.colorMin,
            max: scope.uiTools.paramsDimension.colorMax,
            value: scope.shader.uniforms.alphaColor.value[1] * scope.uiTools.paramsDimension.maxValue,
            precision: 0,
            step: 1,
            width: scope.uiTools.paramsDimension.slidesWidth,
            height: scope.uiTools.paramsDimension.slidesHeight,
            fontColor:'#00FF00'
        });
        ui.add('slide', {
            name: 'blue',
            callback: adjustBlue,
            min: scope.uiTools.paramsDimension.colorMin,
            max: scope.uiTools.paramsDimension.colorMax,
            value: scope.shader.uniforms.alphaColor.value[1] * scope.uiTools.paramsDimension.maxValue,
            precision: 0,
            step: 1,
            width: scope.uiTools.paramsDimension.slidesWidth,
            height: scope.uiTools.paramsDimension.slidesHeight,
            fontColor:'#0000FF'
        });
        ui.add('slide', {
            name: 'viewer scale',
            callback: changeDiv,
            min: 0.1,
            max: 1,
            value: scope.divScale,
            precision: 1,
            step: 0.1,
            width: 100,
            height: scope.uiTools.paramsDimension.slidesHeight,
            stype: scope.uiTools.paramsDimension.sliderType
        });
        ui.add('slide', {
            name: 'zoom marble',
            callback: zoomMarble,
            min: 0.1,
            max: 2,
            value: scope.zoom,
            precision: 1,
            step: 0.1,
            width: 100,
            height: scope.uiTools.paramsDimension.slidesHeight,
            stype: scope.uiTools.paramsDimension.sliderType
        });
        ui.add('slide', {
            name: 'move x',
            callback: moveCameraX,
            min: -1,
            max: 1,
            value: 0,
            precision: 2,
            step: 0.01,
            width: 200,
            height: scope.uiTools.paramsDimension.slidesHeight,
            stype: scope.uiTools.paramsDimension.sliderType
        });
        ui.add('slide', {
            name: 'move y',
            callback: moveCameraY,
            min: -1,
            max: 1,
            value: 0,
            precision: 2,
            step: 0.01,
            width: 200,
            height: scope.uiTools.paramsDimension.slidesHeight,
            stype: scope.uiTools.paramsDimension.sliderType
        });

        scope.stats.showPanel(0);
        document.body.appendChild(scope.stats.domElement);
    }

    BlueMarbleApp.prototype.initGL = function () {
        var gl = this.app.renderer.getContext();

        var result = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
        if (result != 0) {
            console.log('Vertex shader is able to read texture (gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS= ' + result + ')');
        }

        var geometry = new THREE.PlaneGeometry(3712, 3712, 1, 1);
        var material = this.shader.buildShaderMaterial();
        this.mesh =  new THREE.Mesh(geometry, material);

        this.app.sceneOrtho.scene.add(this.mesh);
    };

    BlueMarbleApp.prototype.render = function () {
        this.stats.update();
    };

    return BlueMarbleApp;

})();
