/**
 * Created by Kai Salmen.
 */

"use strict";

KSX.apps.zerosouth.PTV1 = {
    glob : {
        appLifecycle : new KSX.apps.core.AppLifecycle("App Lifecycle for PTV 1 loader")
    },
    func : {
        init : function () {
            var impl = new KSX.apps.zerosouth.impl.PTV1Loader(document.getElementById("DivGLFullCanvas"));
            KSX.apps.zerosouth.PTV1.glob.appLifecycle.addSceneApp(impl.sceneApp);

            // kicks init and starts rendering
            KSX.apps.zerosouth.PTV1.glob.appLifecycle.initAsync();
        },
        render : function () {
            requestAnimationFrame(KSX.apps.zerosouth.PTV1.func.render);
            KSX.apps.zerosouth.PTV1.glob.appLifecycle.renderAllApps();
        },
        onWindowResize : function () {
            KSX.apps.zerosouth.PTV1.glob.appLifecycle.resizeAll();
        }
    }
}

console.log('Starting application "PTV1 loader"...');
if (is.not.ie()) {
    window.addEventListener( 'resize', KSX.apps.zerosouth.PTV1.func.onWindowResize, false );

    KSX.apps.zerosouth.PTV1.func.init();
    KSX.apps.zerosouth.PTV1.func.render();
}
else {
    alert("Internet Explorer is not supported! Please use Chrome, Firefox or Edge.");
}
