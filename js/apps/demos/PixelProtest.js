/**
 * Created by Kai Salmen.
 */

'use strict';

KSX.apps.demos.PixelProtestApp = (function () {

    const SLIDES_WIDTH = 255;
    const SLIDES_HEIGHT = 32;

    function PixelProtestApp(elementToBindTo) {
        this.app = new KSX.apps.core.ThreeJsApp(this, "PixelProtestApp", elementToBindTo, false, true);

        this.shader = new KSX.apps.shader.PixelProtestShader(this.app.canvas.getWidth(), this.app.canvas.getHeight());
        this.shader.setBaseDir('');

        this.ui = new UIL.Gui({
            css: 'top: 0px; left: 0px;',
            size: 512,
            center: false,
            color: 'rgba(224, 224, 224, 1.0)',
            bg: 'rgba(40, 40, 40, 0.66)'
        });
        this.uiElemWidth = null;
        this.uiElemHeight = null;
        this.animateNoise = false;
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

        scope.ui.clear();

        var adjustWidth = function (value) {
            scope.shader.uniforms.width.value = value;
            scope.recalcRandom();
        };
        var adjustHeight = function (value) {
            scope.shader.uniforms.height.value = value;
            scope.recalcRandom();
        };
        var enableNoiseAnimation = function (enabled) {
            scope.animateNoise = enabled;
            scope.recalcRandom();
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

        scope.ui.add('bool', {
            name: 'Animate',
            value: scope.animateNoise,
            callback: enableNoiseAnimation
        });
        if (width > maxWidth) {
            width = maxWidth;
        }
        scope.uiElemWidth = scope.ui.add('slide', {
            name: 'Width',
            callback: adjustWidth,
            min: 2,
            max: maxWidth,
            value: width,
            precision: 0,
            step: 2,
            width: SLIDES_WIDTH,
            height: SLIDES_HEIGHT,
            stype: 2,
            bColor: 'rgba(255, 50, 50, 1.0)'
        });
        if (height > maxHeight) {
            height = maxHeight;
        }
        scope.uiElemHeight = scope.ui.add('slide', {
            name: 'Height',
            callback: adjustHeight,
            min: 2,
            max: maxHeight,
            value: height,
            precision: 0,
            step: 2,
            width: SLIDES_WIDTH,
            height: SLIDES_HEIGHT,
            stype: 2,
            bColor: 'rgba(255, 50, 50, 1.0)'
        });
        scope.ui.add('bool', {
            name: 'Use R',
            value: scope.shader.uniforms.useR.value,
            callback: enableR
        });
        scope.ui.add('bool', {
            name: 'Use B',
            value: scope.shader.uniforms.useG.value,
            callback: enableG
        });
        scope.ui.add('bool', {
            name: 'Use B',
            value: scope.shader.uniforms.useB.value,
            callback: enableB
        });
    };

    PixelProtestApp.prototype.initGL = function () {
        var geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
        var material = new THREE.ShaderMaterial({
            uniforms: this.shader.uniforms,
            vertexShader: this.shader.vertexShader,
            fragmentShader: this.shader.fragmentShader
        });
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
            this.recalcRandom();
        }
    };

    PixelProtestApp.prototype.recalcRandom = function () {
        this.shader.uniforms.offsetR.value = Math.random();
        this.shader.uniforms.offsetG.value = Math.random();
        this.shader.uniforms.offsetB.value = Math.random();
    };

    return PixelProtestApp;
})();

KSX.apps.demos.PixelProtest = {
    glob : {
        appLifecycle : new KSX.apps.core.AppLifecycle("App Lifecycle")
    },
    func : {
        init : function () {
            var impl = new KSX.apps.demos.PixelProtestApp(document.getElementById("DivGLFullCanvas"));
            KSX.apps.demos.PixelProtest.glob.appLifecycle.addApp(impl.app);

            // kicks init and starts rendering
            KSX.apps.demos.PixelProtest.glob.appLifecycle.initAsync();
        },
        render : function () {
            requestAnimationFrame(KSX.apps.demos.PixelProtest.func.render);
            KSX.apps.demos.PixelProtest.glob.appLifecycle.renderAllApps();
        },
        onWindowResize : function () {
            KSX.apps.demos.PixelProtest.glob.appLifecycle.resizeAll();
        }
    }
};


console.log('Starting application "PixelProtest"...');
window.addEventListener( 'resize', KSX.apps.demos.PixelProtest.func.onWindowResize, false );
KSX.apps.demos.PixelProtest.func.init();
KSX.apps.demos.PixelProtest.func.render();
