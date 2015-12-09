/**
 * Created by Kai Salmen.
 */

"use strict";

KSX.HelloOO = {
    glob : {
        appLifecycle : null,
        helloOOSimple : null,
        helloOOShader : null,
        helloOOVideo : null,
        helloOOText : null
    },
    func : {
        init : function () {
            KSX.HelloOO.glob.appLifecycle = new KSX.appBase.AppLifecycle("App Lifecycle"),
            KSX.HelloOO.glob.helloOOSimple = new HelloOOSimple(document.getElementById("DivGL1Canvas")),
            KSX.HelloOO.glob.helloOOShader = new HelloOOShader(document.getElementById("DivGL2Canvas")),
            KSX.HelloOO.glob.helloOOVideo = new HelloOOVideo(document.getElementById("DivGL3Canvas")),
            KSX.HelloOO.glob.helloOOText = new HelloOOText(document.getElementById("DivGL4Canvas"))

            KSX.HelloOO.glob.appLifecycle.addSceneApp(KSX.HelloOO.glob.helloOOSimple.sceneApp),
            KSX.HelloOO.glob.appLifecycle.addSceneApp(KSX.HelloOO.glob.helloOOShader.sceneApp),
            KSX.HelloOO.glob.appLifecycle.addSceneApp(KSX.HelloOO.glob.helloOOVideo.sceneApp),
            KSX.HelloOO.glob.appLifecycle.addSceneApp(KSX.HelloOO.glob.helloOOText.sceneApp),
            KSX.HelloOO.glob.appLifecycle.init()
        },
        render : function () {
            requestAnimationFrame(KSX.HelloOO.func.render);
            KSX.HelloOO.glob.helloOOSimple.render();
            KSX.HelloOO.glob.helloOOShader.render();
            KSX.HelloOO.glob.helloOOVideo.render();
            KSX.HelloOO.glob.helloOOText.render();
            //document.getElementById("DivGL1").style.width = "50%";
            //document.getElementById("DivGL2").style.width = "50%";
            //document.getElementById("DivGL3").style.width = "50%";
            //document.getElementById("DivGL4").style.width = "50%";
        }
    }
}

$(window).resize(function () {
    KSX.HelloOO.glob.appLifecycle.resizeAll();
});

$(document).ready(function () {
    console.log("run");
    KSX.HelloOO.func.init();
    KSX.HelloOO.func.render();
});



