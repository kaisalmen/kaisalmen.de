/**
 * Created by Kai Salmen.
 */

"use strict";

KSX.apps.zerosouth.PTV1 = {
    glob : {
        go : false,
        appLifecycle : new KSX.apps.core.AppLifecycle("App Lifecycle for PTV 1 loader")
    },
    func : {
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
}

if (bowser.msie) {
    alert('Internet Explorer is not supported!\nPlease use Chrome 46+, Firefox 42+ or Edge 13+.');
}
else if (bowser.msedge && bowser.version < 13.10586) {
    alert('Edge ' + bowser.version + ' is not supported!\nPlease use Chrome 46+, Firefox 42+ or Edge 13+.');
}
else if (bowser.safari) {
    if (bowser.version < 9.0) {
        alert('Safari ' + bowser.version + ' is not supported!\nPlease use Chrome 46+, Firefox 42+ or Safari 9+.');
    }
    else {
        alert('Safari is considered unstable. It may or may not work (WIP)...');
        KSX.apps.zerosouth.PTV1.glob.go = true;
    }
}
else if (bowser.chrome && bowser.version < 46.0) {
    alert('Chrome ' + bowser.version + ' is not supported!\nPlease use Chrome 46+, Firefox 42+ or Safari 9+.');
}
else if (bowser.firefox) {
    if (bowser.version < 42.0) {
        alert('Firefox ' + bowser.version + ' is not supported!\nPlease use Chrome 46+, Firefox 42+ or Safari 9+.');
    }
    else if (bowser.mobile) {
        alert('Mobile Firefox is considered unstable, but it may work');
        KSX.apps.zerosouth.PTV1.glob.go = true;
    }
    else {
        KSX.apps.zerosouth.PTV1.glob.go = true;
    }
}
else {
    KSX.apps.zerosouth.PTV1.glob.go = true;
}

if (KSX.apps.zerosouth.PTV1.glob.go) {
    KSX.apps.zerosouth.PTV1.func.init();
    KSX.apps.zerosouth.PTV1.func.render();
}
