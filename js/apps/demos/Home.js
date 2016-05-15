/**
 * Created by Kai Salmen.
 */

'use strict';

KSX.apps.demos.HomeApp = (function () {

    function HomeApp(elementToBindTo) {
        this.app = new KSX.apps.core.ThreeJsApp(this, "HomeApp", elementToBindTo, true, true);

        this.shader = new KSX.apps.shader.BlockShader();
    }

    HomeApp.prototype.initAsyncContent = function() {
        var scope = this;

        var callbackOnSuccess = function () {
            scope.app.initSynchronuous();
        };
        this.shader.loadResources(callbackOnSuccess);
    };

    HomeApp.prototype.initPreGL = function () {

    };

    HomeApp.prototype.initGL = function () {
        var renderer = this.app.renderer;
        var scenePerspective = this.app.scenePerspective;
        var sceneOrtho = this.app.sceneOrtho;

        var gl = renderer.getContext();

        var result = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
        if (result != 0) {
            console.log("Vertex shader is able to read texture: " + result);
        }

        renderer.setClearColor( 0x3B3B3B );
        renderer.autoClear = false;

        scenePerspective.camera.position.set( 48, 10, 0 );
        scenePerspective.updateCamera();

        var helper = new THREE.GridHelper( 100, 2 );
        helper.setColors( 0xFF4444, 0x404040 );
        scenePerspective.scene.add(helper);

        var geometry = new THREE.BoxBufferGeometry( 48, 1, 48, 48, 1, 48 );
        var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
        material.wireframe = true;
        var cube = new THREE.Mesh( geometry, material );
        scenePerspective.scene.add( cube );


        var materialBlockShader = this.shader.buildShaderMaterial();
    };

    HomeApp.prototype.resizeDisplayGL = function () {

    };

    HomeApp.prototype.render = function () {
    };

    HomeApp.prototype.renderPost = function () {

    };

    return HomeApp;
})();

KSX.apps.demos.Home = {
    glob : {
        appLifecycle : new KSX.apps.core.AppLifecycle("App Lifecycle")
    },
    func : {
        checkBrowserSupport : function () {
            var versions = {
                msie : {
                    supported : false
                }
            };
            var browserSupport = new KSX.apps.tools.BrowserSupport(versions);
            return browserSupport.checkSupport();
        },
        init : function () {
            console.log('Starting application "PixelProtest"...');
            window.addEventListener( 'resize', KSX.apps.demos.Home.func.onWindowResize, false );

            var impl = new KSX.apps.demos.HomeApp(document.getElementById("DivGLFullCanvas"));
            KSX.apps.demos.Home.glob.appLifecycle.addApp(impl.app);

            // kicks init and starts rendering
            KSX.apps.demos.Home.glob.appLifecycle.initAsync();
        },
        render : function () {
            requestAnimationFrame(KSX.apps.demos.Home.func.render);
            KSX.apps.demos.Home.glob.appLifecycle.renderAllApps();
        },
        onWindowResize : function () {
            KSX.apps.demos.Home.glob.appLifecycle.resizeAll();
        }
    }
};


if (KSX.apps.demos.Home.func.checkBrowserSupport()) {
    KSX.apps.demos.Home.func.init();
    KSX.apps.demos.Home.func.render();
}
