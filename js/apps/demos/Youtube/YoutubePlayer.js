/**
 * Created by Kai Salmen.
 */

"use strict";

KSX.apps.demos.YoutubePlayer = {
    glob : {
        appLifecycle : new KSX.apps.core.AppLifecycle("App Lifecycle")
    },
    func : {
        init : function () {
            var impl = new KSX.apps.demos.YoutubePlayerApp(document.getElementById("DivGLFullCanvas"), "player", "DivGLFullVideoBuffer");
            KSX.apps.demos.YoutubePlayer.glob.appLifecycle.addApp(impl.app);

            // kicks init and starts rendering
            KSX.apps.demos.YoutubePlayer.glob.appLifecycle.initAsync();
        },
        render : function () {
            requestAnimationFrame(KSX.apps.demos.YoutubePlayer.func.render);
            KSX.apps.demos.YoutubePlayer.glob.appLifecycle.renderAllApps();
        },
        onWindowResize : function () {
            KSX.apps.demos.YoutubePlayer.glob.appLifecycle.resizeAll();
        }
    }
};

console.log('Starting application "Youtube Player"...');
/*
window.addEventListener( 'resize', KSX.apps.demos.YoutubePlayer.func.onWindowResize, false );

KSX.apps.demos.YoutubePlayer.func.init();
KSX.apps.demos.YoutubePlayer.func.render();
*/

var player;

var ref;

// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '390',
        width: '640',
        videoId: 'M7lc1UVf-VE',
        playerVars: {
            enablejsapi: 1,
            origin: 'http://localhost:8080/'
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
    window.addEventListener( 'resize', KSX.apps.demos.YoutubePlayer.func.onWindowResize, false );


    KSX.apps.demos.YoutubePlayer.func.init();
    KSX.apps.demos.YoutubePlayer.func.render();

    event.target.playVideo();


    var iFrame = player.getIframe();
/*
    var contentWindow = iFrame.contentWindow;
    var elem = contentWindow.getElementByName('html5-main-video');
*/
    console.log(player.getVideoUrl());
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING && !done) {
        setTimeout(stopVideo, 6000);
        done = true;
    }
}


function stopVideo() {
    player.stopVideo();
}
