/**
 * Created by Kai Salmen.
 */

"use strict";

KSX.apps.zerosouth.PTV1 = {
    glob : {
        appLifecycle : new KSX.apps.core.AppLifecycle("App Lifecycle for PTV 1 loader")
    },
    func : {
        init : function () {
            var impl = new KSX.apps.zerosouth.impl.PTV1Loader(document.getElementById("DivGLFullCanvas"));
            KSX.apps.zerosouth.PTV1.glob.appLifecycle.addSceneApp(impl.sceneApp);

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
}

if (bowser.msie) {
    alert('Internet Explorer is not supported!\nPlease use Chrome 48+, Firefox 44+ or Edge 13+.');
}
else if (bowser.msedge && bowser.version < 13.10586) {
    alert('Edge ' + bowser.version + ' is not supported!\nPlease use Chrome 48+, Firefox 44+ or Edge 13+.');
}
else if (bowser.safari && bowser.version < 9.0) {
    alert('Safari ' + bowser.version + ' is not supported!\nPlease use Chrome 48+, Firefox 44+ or Safari 9+.');
}
else if (bowser.chrome && bowser.version < 48.0) {
    alert('Safari ' + bowser.version + ' is not supported!\nPlease use Chrome 48+, Firefox 44+ or Safari 9+.');
}
else if (bowser.firefoc && bowser.version < 44.0) {
    alert('Safari ' + bowser.version + ' is not supported!\nPlease use Chrome 48+, Firefox 44+ or Safari 9+.');
}
else {
    window.addEventListener( 'resize', KSX.apps.zerosouth.PTV1.func.onWindowResize, false );

    KSX.apps.zerosouth.PTV1.func.init();
    KSX.apps.zerosouth.PTV1.func.render();
}
