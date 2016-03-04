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
            KSX.apps.demos.HelloOOMulti.glob.appLifecycle.addApp(impl.app);

            impl = new KSX.apps.demos.HelloOOShader(document.getElementById("DivGL2Canvas"));
            KSX.apps.demos.HelloOOMulti.glob.appLifecycle.addApp(impl.app);

            impl = new KSX.apps.demos.HelloOOVideo(document.getElementById("DivGL3Canvas"), "DivGL3Video", "DivGL3VideoBuffer");
            KSX.apps.demos.HelloOOMulti.glob.appLifecycle.addApp(impl.app);

            impl = new KSX.apps.demos.HelloOOText(document.getElementById("DivGL4Canvas"));
            KSX.apps.demos.HelloOOMulti.glob.appLifecycle.addApp(impl.app);

            // kicks init and starts rendering
            KSX.apps.demos.HelloOOMulti.glob.appLifecycle.initAsync();
        },
        render : function () {
            requestAnimationFrame(KSX.apps.demos.HelloOOMulti.func.render);
            KSX.apps.demos.HelloOOMulti.glob.appLifecycle.renderAllApps();
        },
        onWindowResize : function () {
            KSX.apps.demos.HelloOOMulti.glob.appLifecycle.resizeAll();
        }
    }
}


console.log('Starting multiple applications...');
window.addEventListener( 'resize', KSX.apps.demos.HelloOOMulti.func.onWindowResize, false );
KSX.apps.demos.HelloOOMulti.func.init();
KSX.apps.demos.HelloOOMulti.func.render();
