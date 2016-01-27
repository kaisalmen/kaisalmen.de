/**
 * Created by Kai Salmen.
 */

"use strict";

KSX.apps.demos.HelloOO = {
    glob : {
        appLifecycle : null,
    },
    func : {
        init : function () {
            KSX.apps.demos.HelloOO.glob.appLifecycle = new KSX.apps.core.AppLifecycle("App Lifecycle");

            var impl = new KSX.apps.demos.ImageBasedGeometryTransform(document.getElementById("DivGLFullCanvas"));
            KSX.apps.demos.HelloOO.glob.appLifecycle.addSceneApp(impl.sceneApp);

            // kicks init and starts rendering
            KSX.apps.demos.HelloOO.glob.appLifecycle.initAsync();
        },
        render : function () {
            requestAnimationFrame(KSX.apps.demos.HelloOO.func.render);
            KSX.apps.demos.HelloOO.glob.appLifecycle.renderAllApps();
        }
    }
}

$(window).resize(function () {
    KSX.apps.demos.HelloOO.glob.appLifecycle.resizeAll();
});

$(document).ready(function () {
    console.log("Document is ready starting applications...");
    KSX.apps.demos.HelloOO.func.init();
    KSX.apps.demos.HelloOO.func.render();
});



