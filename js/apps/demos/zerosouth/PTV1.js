/**
 * Created by Kai Salmen.
 */

"use strict";

KSX.apps.zerosouth.PTV1 = {
    glob : {
        appLifecycle : new KSX.apps.core.AppLifecycle("App Lifecycle for PTV 1 loader")
    },
    func : {
        checkBrowserSupport : function () {
            var versions = {
                msedge : {
                    minVersion : 13.10586
                },
                msie : {
                    supported : false
                },
                firefox : {
                    mobileWarning : 'Mobile Firefox is considered unstable, but it may work!'
                },
                safari : {
                    mobileWarning : 'Mobile Safari has memory issues and is considered unstable, but it may work!'
                }
            };
            var browserSupport = new KSX.apps.tools.BrowserSupport(versions);
            return browserSupport.checkSupport();
        },
        init : function () {
            window.addEventListener( 'resize', KSX.apps.zerosouth.PTV1.func.onWindowResize, false );

            var impl = new KSX.apps.zerosouth.impl.PTV1Loader(document.getElementById("DivGLFullCanvas"));
            KSX.apps.zerosouth.PTV1.glob.appLifecycle.addApp(impl.app);

            // kicks init and starts rendering
            KSX.apps.zerosouth.PTV1.glob.appLifecycle.initAsync();
        },
        render : function () {
            requestAnimationFrame(KSX.apps.zerosouth.PTV1.func.render);
            KSX.apps.zerosouth.PTV1.glob.appLifecycle.renderAllApps();
        },
        onWindowResize : function () {
            KSX.apps.zerosouth.PTV1.glob.appLifecycle.resizeAll();
        }
    }
};


if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

if (KSX.apps.zerosouth.PTV1.func.checkBrowserSupport()) {
    KSX.apps.zerosouth.PTV1.func.init();
    KSX.apps.zerosouth.PTV1.func.render();
}
