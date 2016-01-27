/**
 * Created by Kai Salmen.
 */

"use strict";

KSX.apps.demos.VideoPlayer = {
    glob : {
        appLifecycle : new KSX.apps.core.AppLifecycle("App Lifecycle")
    },
    func : {
        init : function () {
            var impl = new KSX.apps.demos.HelloOOVideo(document.getElementById("DivGLFullCanvas"), "DivGLFullVideo", "DivGLFullVideoBuffer");
            KSX.apps.demos.VideoPlayer.glob.appLifecycle.addSceneApp(impl.sceneApp);

            // kicks init and starts rendering
            KSX.apps.demos.VideoPlayer.glob.appLifecycle.initAsync();
        },
        render : function () {
            requestAnimationFrame(KSX.apps.demos.VideoPlayer.func.render);
            KSX.apps.demos.VideoPlayer.glob.appLifecycle.renderAllApps();
        }
    }
}

$(window).resize(function () {
    KSX.apps.demos.VideoPlayer.glob.appLifecycle.resizeAll();
});

$(document).ready(function () {
    console.log("Document is ready starting applications...");
    KSX.apps.demos.VideoPlayer.func.init();
    KSX.apps.demos.VideoPlayer.func.render();
});

