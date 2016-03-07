/**
 * Created by Kai Salmen.
 */

'use strict';

const MAX_VALUE = 255.0;
const COLOR_MIN = 0;
const COLOR_MAX = 255;
const SLIDES_WIDTH = 255;
const SLIDES_HEIGHT = 32;

const NORMAL_WIDTH = 3712.0;
const NORMAL_HEIGHT = 3712.0;

KSX.apps.demos.impl.BlueMarbleApp = class {

    constructor(elementToBindTo) {
        this.app = new KSX.apps.core.ThreeJsApp(this, 'BlueMarbleApp', elementToBindTo, true, true);

        this.textureTools = new KSX.apps.tools.TextureTools();
        this.shaderTools = new KSX.apps.tools.ShaderTools();

        this.uniforms = {
            blendFactor : { type : 'f', value : 1.0 },
            alphaColor : { type : 'fv1', value : [1.0, 1.0, 1.0] },
            lowerBoundary : { type: 'f', value: 50.0 / MAX_VALUE },
            upperBoundary : { type: 'f', value: 127.0 / MAX_VALUE },
            textureMarble : { type : 't', value : null },
            textureSat : { type : 't', value : null }
        };

        this.vertexShader = null;
        this.fragmentShader = null;

        this.ui = new UIL.Gui({
            css: 'top: 0px; left: 225px;',
            size: 450,
            center: true
        });

        this.stats = new Stats();

        this.controls = null;
    }

    initAsyncContent () {
        var scope = this;

        var promises = new Set();
        promises.add(this.textureTools.loadTexture('../../resource/images/BlueMarble/bluemarble_rgba.png'));
        promises.add(this.textureTools.loadTexture('../../resource/images/BlueMarble/sat_rgba.png'));

        promises.add(this.shaderTools.loadShader('../../resource/shader/passThrough.glsl', false, 'VS: Pass Through'));
        promises.add(this.shaderTools.loadShader('../../resource/shader/blueMarble.glsl', false, 'FS: BlueMarble'));

        Promise.all(promises).then(
            function (results) {
                scope.uniforms.textureMarble.value = results[0];
                scope.uniforms.textureSat.value = results[1];
                scope.vertexShader = results[2];
                scope.fragmentShader = results[3];
                scope.app.initSynchronuous();
            }
        ).catch(
            function (error) {
                console.log('The following error occurred: ', error);
            }
        );
    }

    initPreGL () {
        var scope = this;

        var adjustLowerBoundary = function (value) {
            scope.uniforms.lowerBoundary.value = value / MAX_VALUE;
        };

        var adjustUpperBoundary = function (value) {
            scope.uniforms.upperBoundary.value = value / MAX_VALUE;
        };

        var adjustRed = function (value) {
            scope.uniforms.alphaColor.value[0] = value / MAX_VALUE;
        };

        var adjustGreen = function (value) {
            scope.uniforms.alphaColor.value[1] = value / MAX_VALUE;
        };

        var adjustBlue = function (value) {
            scope.uniforms.alphaColor.value[2] = value / MAX_VALUE;
        };

        var changeScale = function (value) {
            if (scope.app.renderingEndabled) {
                scope.app.canvas.resetWidth(NORMAL_WIDTH * value, NORMAL_HEIGHT * value);
                scope.app.resizeDisplayGL();
            }
        };

        scope.ui.add('slide', {
            name: 'lowerBoundary',
            callback: adjustLowerBoundary,
            min: COLOR_MIN,
            max: COLOR_MAX,
            value: scope.uniforms.lowerBoundary.value * MAX_VALUE,
            precision: 0,
            step: 1,
            width: SLIDES_WIDTH,
            height: SLIDES_HEIGHT
        });
        scope.ui.add('slide', {
            name: 'upperBoundary',
            callback: adjustUpperBoundary,
            min: COLOR_MIN,
            max: COLOR_MAX,
            value: scope.uniforms.upperBoundary.value * MAX_VALUE,
            precision: 0,
            step: 1,
            width: SLIDES_WIDTH,
            height: SLIDES_HEIGHT
        });
        scope.ui.add('slide', {
            name: 'red',
            callback: adjustRed,
            min: COLOR_MIN,
            max: COLOR_MAX,
            value: scope.uniforms.alphaColor.value[0] * MAX_VALUE,
            precision: 0,
            step: 1,
            width: SLIDES_WIDTH,
            height: SLIDES_HEIGHT,
            fontColor:'#FF0000'
        });
        scope.ui.add('slide', {
            name: 'green',
            callback: adjustGreen,
            min: COLOR_MIN,
            max: COLOR_MAX,
            value: scope.uniforms.alphaColor.value[1] * MAX_VALUE,
            precision: 0,
            step: 1,
            width: SLIDES_WIDTH,
            height: SLIDES_HEIGHT,
            fontColor:'#00FF00'
        });
        scope.ui.add('slide', {
            name: 'blue',
            callback: adjustBlue,
            min: COLOR_MIN,
            max: COLOR_MAX,
            value: scope.uniforms.alphaColor.value[1] * MAX_VALUE,
            precision: 0,
            step: 1,
            width: SLIDES_WIDTH,
            height: SLIDES_HEIGHT,
            fontColor:'#0000FF'
        });
        scope.ui.add('slide', {
            name: 'marble scale',
            callback: changeScale,
            min: 0.1,
            max: 1,
            value: 1,
            precision: 1,
            step: 0.1,
            width: 100,
            height: SLIDES_HEIGHT
        });

        scope.stats.setMode(0);
        document.body.appendChild(scope.stats.domElement);
    }

    initGL () {
        var gl = this.app.renderer.getContext();

        this.controls = new THREE.OrthographicTrackballControls(this.app.sceneOrtho.camera);
        this.controls.noRotate = true;
        this.controls.noPan = true;
        this.controls.noRoll = true;


        var result = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
        if (result != 0) {
            console.log('Vertex shader is able to read texture (gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS= ' + result + ')');
        }

        var geometry = new THREE.PlaneGeometry(3712, 3712, 1, 1);
        var material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: this.vertexShader,
            fragmentShader: this.fragmentShader
        });
        this.mesh =  new THREE.Mesh(geometry, material);

        this.app.sceneOrtho.scene.add(this.mesh);
    }

    render () {
        this.stats.update();
        this.controls.update();
    }

}
