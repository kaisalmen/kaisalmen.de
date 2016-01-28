/**
 * Created by Kai Salmen.
 */

"use strict";

KSX.apps.zerosouth.PTV1 = {
    glob : {
        appLifecycle : new KSX.apps.core.AppLifecycle("App Lifecycle for GLCheck")
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
        }
    }
}

$(window).resize(function () {
    KSX.apps.zerosouth.PTV1.glob.appLifecycle.resizeAll();
});

$(document).ready(function () {
    console.log("Document is ready starting applications...");
    KSX.apps.zerosouth.PTV1.func.init();
    KSX.apps.zerosouth.PTV1.func.render();
});