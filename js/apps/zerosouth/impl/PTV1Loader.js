/**
 * Created by Kai Salmen.
 */

"use strict";

KSX.apps.zerosouth.impl.PTV1Loader = (function () {

    function PTV1Loader(elementToBindTo) {
        this.sceneApp = new KSX.apps.core.SceneAppPerspective(this, "PTV1Loader", elementToBindTo, true);
        this.controls = new THREE.TrackballControls(this.sceneApp.getCamera());
        this.useZip = true;
        this.objectLoadingTools = new KSX.apps.tools.ObjLoadingTools();

        this.helper = null;
    }

    PTV1Loader.prototype.initAsyncContent = function () {
        console.log("PTV1Loader.initAsyncContent is not required!");
        this.sceneApp.initSynchronuous();
    };

    PTV1Loader.prototype.initGL = function () {
        var gl = this.sceneApp.getRenderer().getContext();
        var scene = this.sceneApp.getScene();
        var camera = this.sceneApp.getCamera();
        camera.position.x = 300;
        camera.position.y = 300;
        camera.position.z = 400;

        this.controls.rotateSpeed = 0.5;
        this.controls.zoomSpeed = 0.5;
        this.controls.panSpeed = 0.8;

        this.controls.noZoom = false;
        this.controls.noPan = false;

        this.controls.staticMoving = true;
        this.controls.dynamicDampingFactor = 0.3;

        this.controls.keys = [ 65, 83, 68 ];
//        this.controls.addEventListener( 'change', render );

        var ambient = new THREE.AmbientLight(0x1011030);
        scene.add( ambient );

        var directionalLight1 = new THREE.DirectionalLight(0xffeedd);
        directionalLight1.position.set(0, 0, 1000);
        scene.add(directionalLight1);

        var directionalLight2 = new THREE.DirectionalLight(0x909090);
        directionalLight2.position.set(1000, 1000, -1000);
        scene.add(directionalLight2);

        this.helper = new THREE.GridHelper(1000, 20);
        this.helper.setColors(0xFF4444, 0xB0B0B0);
        scene.add(this.helper);

        var scope = this;
        if (this.useZip) {
            var zipTools = new KSX.apps.tools.ZipTools();

            var loadCallbackZip = function () {
                var rootGroup = scope.objectLoadingTools.parse(zipTools.unzipFile("PTV1.obj"));
                scope.adjustScene(rootGroup);
            };
            zipTools.loadBinaryData("../../resource/models/PTV1.zip", loadCallbackZip);
        }
        else {
            var loadCallbackDirect = function (rootGroup) {
                scene.add(rootGroup);
            };
            this.objectLoadingTools.loadObject("../../resource/models/PTV1.obj", loadCallbackDirect);
        }
    };

    PTV1Loader.prototype.adjustScene = function(rootGroup) {
        rootGroup.position.y = 20;
        rootGroup.position.z = 250;
        this.sceneApp.getScene().add(rootGroup);
    };

    PTV1Loader.prototype.render = function() {
        this.controls.update();
    };

    PTV1Loader.prototype.resizeDisplayGL = function() {
        this.controls.handleResize();
    };

    return PTV1Loader;
})();