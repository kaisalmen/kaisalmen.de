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

            var impl = new KSX.apps.demos.HelloOOSimple(document.getElementById("DivGL1Canvas"));
            KSX.HelloOOMulti.glob.appLifecycle.addSceneApp(impl.sceneApp);

            impl = new KSX.apps.demos.HelloOOShader(document.getElementById("DivGL2Canvas"));
            KSX.HelloOOMulti.glob.appLifecycle.addSceneApp(impl.sceneApp);

            impl = new KSX.apps.demos.HelloOOVideo(document.getElementById("DivGL3Canvas"), "DivGL3Video", "DivGL3VideoBuffer");
            KSX.HelloOOMulti.glob.appLifecycle.addSceneApp(impl.sceneApp);

            impl = new KSX.apps.demos.HelloOOText(document.getElementById("DivGL4Canvas"));
            KSX.HelloOOMulti.glob.appLifecycle.addSceneApp(impl.sceneApp);

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



