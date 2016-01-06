/**
 * Created by Kai Salmen.
 */

"use strict";

KSX.HelloOO = {
    glob : {
        appLifecycle : null,
    },
    func : {
        init : function () {
            KSX.HelloOO.glob.appLifecycle = new KSX.apps.core.AppLifecycle("App Lifecycle");
            var helloOO = new KSX.apps.demos.ImageBasedGeometryTransform(document.getElementById("DivGLFullCanvas"));

            KSX.HelloOO.glob.appLifecycle.addSceneApp(helloOO.sceneApp);

            // kicks init and starts rendering
            KSX.HelloOO.glob.appLifecycle.initAsync();
        },
        render : function () {
            requestAnimationFrame(KSX.HelloOO.func.render);
            KSX.HelloOO.glob.appLifecycle.renderAllApps();
        }
    }
}

$(window).resize(function () {
    KSX.HelloOO.glob.appLifecycle.resizeAll();
});

$(document).ready(function () {
    console.log("Document is ready starting applications...");
    KSX.HelloOO.func.init();
    KSX.HelloOO.func.render();
});



