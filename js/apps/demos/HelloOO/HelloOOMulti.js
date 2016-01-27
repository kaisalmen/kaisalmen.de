/**
 * Created by Kai Salmen.
 */

"use strict";

KSX.apps.demos.HelloOOMulti = {
    glob : {
        appLifecycle : null,
    },
    func : {
        init : function () {
            KSX.apps.demos.HelloOOMulti.glob.appLifecycle = new KSX.apps.core.AppLifecycle("App Lifecycle");

            var impl = new KSX.apps.demos.HelloOOSimple(document.getElementById("DivGL1Canvas"));
            KSX.apps.demos.HelloOOMulti.glob.appLifecycle.addSceneApp(impl.sceneApp);

            impl = new KSX.apps.demos.HelloOOShader(document.getElementById("DivGL2Canvas"));
            KSX.apps.demos.HelloOOMulti.glob.appLifecycle.addSceneApp(impl.sceneApp);

            impl = new KSX.apps.demos.HelloOOVideo(document.getElementById("DivGL3Canvas"), "DivGL3Video", "DivGL3VideoBuffer");
            KSX.apps.demos.HelloOOMulti.glob.appLifecycle.addSceneApp(impl.sceneApp);

            impl = new KSX.apps.demos.HelloOOText(document.getElementById("DivGL4Canvas"));
            KSX.apps.demos.HelloOOMulti.glob.appLifecycle.addSceneApp(impl.sceneApp);

            // kicks init and starts rendering
            KSX.apps.demos.HelloOOMulti.glob.appLifecycle.initAsync();
        },
        render : function () {
            requestAnimationFrame(KSX.apps.demos.HelloOOMulti.func.render);
            KSX.apps.demos.HelloOOMulti.glob.appLifecycle.renderAllApps();
        }
    }
}

$(window).resize(function () {
    KSX.apps.demos.HelloOOMulti.glob.appLifecycle.resizeAll();
});

$(document).ready(function () {
    console.log("Document is ready starting applications...");
    KSX.apps.demos.HelloOOMulti.func.init();
    KSX.apps.demos.HelloOOMulti.func.render();
});



