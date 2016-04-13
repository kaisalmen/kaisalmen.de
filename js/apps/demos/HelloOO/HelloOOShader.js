/**
 * Created by Kai Salmen.
 */

"use strict";

KSX.apps.demos.HelloOOShader = {
    glob : {
        appLifecycle : new KSX.apps.core.AppLifecycle("App Lifecycle")
    },
    func : {
        init : function () {
            var impl = new KSX.apps.demos.TextureWithNoiseShaderApp(document.getElementById("DivGLFullCanvas"));
            KSX.apps.demos.HelloOOShader.glob.appLifecycle.addApp(impl.app);

            // kicks init and starts rendering
            KSX.apps.demos.HelloOOShader.glob.appLifecycle.initAsync();
        },
        render : function () {
            requestAnimationFrame(KSX.apps.demos.HelloOOShader.func.render);
            KSX.apps.demos.HelloOOShader.glob.appLifecycle.renderAllApps();
        },
        onWindowResize : function () {
            KSX.apps.demos.HelloOOShader.glob.appLifecycle.resizeAll();
        }
    }
};


console.log('Starting application "ImageBasedGeometryTransform"...');
window.addEventListener( 'resize', KSX.apps.demos.HelloOOShader.func.onWindowResize, false );
KSX.apps.demos.HelloOOShader.func.init();
KSX.apps.demos.HelloOOShader.func.render();
