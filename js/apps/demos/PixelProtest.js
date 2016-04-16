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
            css: 'top: 0px; left: 250px;',
            size: 500,
            center: true
        });
        this.animateNoise = true;
    }

    PixelProtestApp.prototype.initAsyncContent = function() {
        var scope = this;

        var callbackOnSuccess = function () {
            scope.app.initSynchronuous();
        };
        this.shader.loadResources(callbackOnSuccess);
    };

    PixelProtestApp.prototype.initPreGL = function () {
        var scope = this;

        var adjustWidth = function (value) {
            scope.shader.uniforms.width.value = value;
        };
        var adjustHeight = function (value) {
            scope.shader.uniforms.height.value = value;
        };
        var enableNoiseAnimation = function (enabled) {
            scope.animateNoise = enabled;
        };

        this.ui.add('bool', {
            name: 'Animate',
            value: this.animateNoise,
            callback: enableNoiseAnimation,
            height: SLIDES_HEIGHT
        });
        scope.ui.add('slide', {
            name: 'Width',
            callback: adjustWidth,
            min: 0,
            max: this.app.canvas.getWidth(),
            value: this.app.canvas.getWidth(),
            precision: 1,
            step: 1,
            width: SLIDES_WIDTH,
            height: SLIDES_HEIGHT
        });
        scope.ui.add('slide', {
            name: 'Height',
            callback: adjustHeight,
            min: 0,
            max: this.app.canvas.getHeight(),
            value: this.app.canvas.getHeight(),
            precision: 1,
            step: 1,
            width: SLIDES_WIDTH,
            height: SLIDES_HEIGHT
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
    };

    PixelProtestApp.prototype.render = function () {
        if (this.animateNoise) {
            this.shader.uniforms.offsetR.value = Math.random();
            this.shader.uniforms.offsetG.value = Math.random();
            this.shader.uniforms.offsetB.value = Math.random();
        }
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
