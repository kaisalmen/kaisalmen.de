/**
 * Created by Kai Salmen.
 */

'use strict';

KSX.apps.demos.PixelProtestApp = (function () {

    function PixelProtestApp(elementToBindTo) {
        this.app = new KSX.apps.core.ThreeJsApp(this, "PixelProtestApp", elementToBindTo, false, true);

        this.shader = new KSX.apps.shader.PixelProtestShader();
        this.shader.setBaseDir('');
    }

    PixelProtestApp.prototype.initAsyncContent = function() {
        var scope = this;

        var callbackOnSuccess = function () {
            scope.app.initSynchronuous();
        };
        this.shader.loadResources(callbackOnSuccess);
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
