/**
 * Created by Kai Salmen.
 */

"use strict";

KSX.HelloOOMulti = {
    glob : {
        appLifecycle : null,
    },
    func : {
        init : function () {
            KSX.HelloOOMulti.glob.appLifecycle = new KSX.apps.core.AppLifecycle("App Lifecycle");
            var helloOOSimple = new KSX.apps.demos.HelloOOSimple(document.getElementById("DivGL1Canvas"));
            var helloOOShader = new KSX.apps.demos.HelloOOShader(document.getElementById("DivGL2Canvas"));
            var helloOOVideo = new KSX.apps.demos.HelloOOVideo(document.getElementById("DivGL3Canvas"));
            var helloOOText = new KSX.apps.demos.HelloOOText(document.getElementById("DivGL4Canvas"));

            KSX.HelloOOMulti.glob.appLifecycle.addSceneApp(helloOOSimple.sceneApp);
            KSX.HelloOOMulti.glob.appLifecycle.addSceneApp(helloOOShader.sceneApp);
            KSX.HelloOOMulti.glob.appLifecycle.addSceneApp(helloOOVideo.sceneApp);
            KSX.HelloOOMulti.glob.appLifecycle.addSceneApp(helloOOText.sceneApp);

                // kicks init and starts rendering
            KSX.HelloOOMulti.glob.appLifecycle.initAsync();
        },
        render : function () {
            requestAnimationFrame(KSX.HelloOOMulti.func.render);
            KSX.HelloOOMulti.glob.appLifecycle.renderAllApps();
        }
    }
}

$(window).resize(function () {
    KSX.HelloOOMulti.glob.appLifecycle.resizeAll();
});

$(document).ready(function () {
    console.log("Document is ready starting applications...");
    KSX.HelloOOMulti.func.init();
    KSX.HelloOOMulti.func.render();
});



