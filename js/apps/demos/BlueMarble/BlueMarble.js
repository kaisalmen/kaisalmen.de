/**
 * Created by Kai Salmen.
 */

"use strict";

KSX.apps.demos.BlueMarble = {
    glob : {
        appLifecycle : new KSX.apps.core.AppLifecycle("App Lifecycle")
    },
    func : {
        init : function () {
            var impl = new KSX.apps.demos.impl.BlueMarbleApp(document.getElementById("DivGLFullCanvas"));
            KSX.apps.demos.BlueMarble.glob.appLifecycle.addApp(impl.app);

            // kicks init and starts rendering
            KSX.apps.demos.BlueMarble.glob.appLifecycle.initAsync();
        },
        render : function () {
            requestAnimationFrame(KSX.apps.demos.BlueMarble.func.render);
            KSX.apps.demos.BlueMarble.glob.appLifecycle.renderAllApps();
        },
        onWindowResize : function () {
            KSX.apps.demos.BlueMarble.glob.appLifecycle.resizeAll();
        }
    }
};


console.log('Starting application "BlueMarbleApp"');

window.addEventListener( 'resize', KSX.apps.demos.BlueMarble.func.onWindowResize, false );

KSX.apps.demos.BlueMarble.func.init();
KSX.apps.demos.BlueMarble.func.render();
