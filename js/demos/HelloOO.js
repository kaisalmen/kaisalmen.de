/**
 * Created by Kai Salmen.
 */

"use strict";

var appLifecycle = new AppLifecycle("App Lifecycle");

var helloOOSimple = new HelloOOSimple(document.getElementById("DivGL1Canvas"));
var helloOOShader = new HelloOOShader(document.getElementById("DivGL2Canvas"));
var helloOOVideo = new HelloOOVideo(document.getElementById("DivGL3Canvas"));
var helloOOText = new HelloOOText(document.getElementById("DivGL4Canvas"));

appLifecycle.addSceneApp(helloOOSimple.sceneApp);
appLifecycle.addSceneApp(helloOOShader.sceneApp);
appLifecycle.addSceneApp(helloOOVideo.sceneApp);
appLifecycle.addSceneApp(helloOOText.sceneApp);

$(window).resize(function () {
    appLifecycle.resizeAll();
});

$(document).ready(function () {
    appLifecycle.run();
});

var render = function () {
    requestAnimationFrame(render);
    helloOOSimple.render();
    helloOOShader.render();
    helloOOVideo.render();
    helloOOText.render();
    //document.getElementById("DivGL1").style.width = "50%";
    //document.getElementById("DivGL2").style.width = "50%";
    //document.getElementById("DivGL3").style.width = "50%";
    //document.getElementById("DivGL4").style.width = "50%";
};

render();
