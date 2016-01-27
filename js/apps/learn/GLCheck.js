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
            KSX.apps.learn.GLCheck.glob.appLifecycle.addSceneApp(impl.sceneApp);

            // kicks init and starts rendering
            KSX.apps.learn.GLCheck.glob.appLifecycle.initAsync();
        },
        render : function () {
            requestAnimationFrame(KSX.apps.learn.GLCheck.func.render);
            KSX.apps.learn.GLCheck.glob.appLifecycle.renderAllApps();
        }
    }
}

$(window).resize(function () {
    KSX.apps.learn.GLCheck.glob.appLifecycle.resizeAll();
});

$(document).ready(function () {
    console.log("Document is ready starting applications...");
    KSX.apps.learn.GLCheck.func.init();
    KSX.apps.learn.GLCheck.func.render();
});