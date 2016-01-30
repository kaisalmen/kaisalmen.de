/**
 * Created by Kai Salmen.
 */

"use strict";

KSX.apps.zerosouth.impl.PTV1Loader = (function () {

    function PTV1Loader(elementToBindTo) {
        this.sceneApp = new KSX.apps.core.SceneAppPerspective(this, "PTV1Loader", elementToBindTo, true);
        this.controls = new THREE.TrackballControls(this.sceneApp.getCamera());
        this.objectLoadingTools = new KSX.apps.tools.ObjLoadingTools();
    }

    PTV1Loader.prototype.initAsyncContent = function () {
        console.log("PTV1Loader.initAsyncContent is not required!");
        this.sceneApp.initSynchronuous();
    };

    PTV1Loader.prototype.initGL = function () {
        var gl = this.sceneApp.getRenderer().getContext();
        var scene = this.sceneApp.getScene();
        var camera = this.sceneApp.getCamera();
        camera.position.z = -100;

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

        var directionalLight2 = new THREE.DirectionalLight(0xbbbbbb);
        directionalLight2.position.set(1000, 1000, -1000);
        scene.add(directionalLight2);

        var scene = this.sceneApp.getScene();
        var loadingScene = function (object) {
            //loader.load('../../resource/models/snowtracks.obj', function (object) {
            //object.scale.set(0.01, 0.01, 0.01);
            scene.add(object);
        };
        this.objectLoadingTools.loadObject('../../resource/models/PTV1.obj', loadingScene);
    };

    PTV1Loader.prototype.render = function() {
        this.controls.update();
    };

    PTV1Loader.prototype.resizeDisplayGL = function() {
        this.controls.handleResize();
    };

    return PTV1Loader;
})();