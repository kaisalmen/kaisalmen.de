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
            var helloOOSimple = new KSX.apps.demos.HelloOOSimple(document.getElementById("DivGL1Canvas"));
            var helloOOShader = new KSX.apps.demos.HelloOOShader(document.getElementById("DivGL2Canvas"));
            var helloOOVideo = new KSX.apps.demos.HelloOOVideo(document.getElementById("DivGL3Canvas"));
            var helloOOText = new KSX.apps.demos.HelloOOText(document.getElementById("DivGL4Canvas"));

            KSX.HelloOO.glob.appLifecycle.addSceneApp(helloOOSimple.sceneApp);
            KSX.HelloOO.glob.appLifecycle.addSceneApp(helloOOShader.sceneApp);
            KSX.HelloOO.glob.appLifecycle.addSceneApp(helloOOVideo.sceneApp);
            KSX.HelloOO.glob.appLifecycle.addSceneApp(helloOOText.sceneApp);

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



