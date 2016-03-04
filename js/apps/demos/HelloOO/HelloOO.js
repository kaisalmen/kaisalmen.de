/**
 * Created by Kai Salmen.
 */

"use strict";

KSX.apps.demos.HelloOO = {
    glob : {
        appLifecycle : new KSX.apps.core.AppLifecycle("App Lifecycle")
    },
    func : {
        init : function () {
            var impl = new KSX.apps.demos.ImageBasedGeometryTransform(document.getElementById("DivGLFullCanvas"));
            KSX.apps.demos.HelloOO.glob.appLifecycle.addApp(impl.app);

            // kicks init and starts rendering
            KSX.apps.demos.HelloOO.glob.appLifecycle.initAsync();
        },
        render : function () {
            requestAnimationFrame(KSX.apps.demos.HelloOO.func.render);
            KSX.apps.demos.HelloOO.glob.appLifecycle.renderAllApps();
        },
        onWindowResize : function () {
            KSX.apps.demos.HelloOO.glob.appLifecycle.resizeAll();
        }
    }
};


console.log('Starting application "ImageBasedGeometryTransform"...');
window.addEventListener( 'resize', KSX.apps.demos.HelloOO.func.onWindowResize, false );
KSX.apps.demos.HelloOO.func.init();
KSX.apps.demos.HelloOO.func.render();
