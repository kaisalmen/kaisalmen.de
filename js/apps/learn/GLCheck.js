/**
 * Created by Kai Salmen.
 */

"use strict";

KSX.apps.learn.GLCheck = {
    glob : {
        appLifecycle : new KSX.apps.core.AppLifecycle("App Lifecycle for GLCheck")
    },
    func : {
        init : function () {
            var impl = new KSX.apps.learn.impl.GLCheckApp(document.getElementById("DivGLFullCanvas"));
            KSX.apps.learn.GLCheck.glob.appLifecycle.addApp(impl.app);

            // kicks init and starts rendering
            KSX.apps.learn.GLCheck.glob.appLifecycle.initAsync();
        },
        render : function () {
            requestAnimationFrame(KSX.apps.learn.GLCheck.func.render);
            KSX.apps.learn.GLCheck.glob.appLifecycle.renderAllApps();
        },
        onWindowResize : function () {
            KSX.apps.demos.HelloOOMulti.glob.appLifecycle.resizeAll();
        }
    }
}


console.log('Starting application "GLCheck"...');
window.addEventListener( 'resize', KSX.apps.learn.GLCheck.func.onWindowResize, false );
KSX.apps.learn.GLCheck.func.init();
KSX.apps.learn.GLCheck.func.render();
