/**
 * Created by Kai on 14.03.2015.
 */
/// <reference path="../libs/ts/threejs/three.d.ts" />
/// <reference path="../libs/ts/jquery/jquery.d.ts" />
/// <reference path="./appBase/AppExecFlow.ts" />
/// <reference path="./appBase/BrowserContext.ts" />
/// <reference path="./appBase/SceneApp.ts" />
/// <reference path="./appBase/SceneAppPerspective.ts" />
var HelloThreejsFirst = (function () {
    function HelloThreejsFirst() {
        this.sceneApp = new SceneAppPerspective(this, document.getElementById("DivGL1"));
        var geometry = new THREE.BoxGeometry(1, 1, 1);
        var material = new THREE.MeshNormalMaterial();
        this.cube = new THREE.Mesh(geometry, material);
    }
    HelloThreejsFirst.prototype.getAppName = function () {
        return "first";
    };
    HelloThreejsFirst.prototype.initGL = function () {
        this.sceneApp.scene.add(this.cube);
        this.sceneApp.camera.position.z = 5;
    };
    HelloThreejsFirst.prototype.render = function () {
        this.cube.rotation.x += 0.1;
        this.cube.rotation.y += 0.1;
        this.sceneApp.render();
    };
    return HelloThreejsFirst;
})();
var HelloThreejsSecond = (function () {
    function HelloThreejsSecond() {
        this.sceneApp = new SceneAppPerspective(this, document.getElementById("DivGL4"));
        var geometry = new THREE.BoxGeometry(1, 2, 1);
        var material = new THREE.MeshNormalMaterial();
        this.cube = new THREE.Mesh(geometry, material);
        this.sceneApp.scene.add(this.cube);
        this.sceneApp.camera.position.z = 5;
    }
    HelloThreejsSecond.prototype.getAppName = function () {
        return "second";
    };
    HelloThreejsSecond.prototype.initGL = function () {
        this.sceneApp.scene.add(this.cube);
        this.sceneApp.camera.position.z = 5;
    };
    HelloThreejsSecond.prototype.render = function () {
        this.cube.rotation.x += 0.2;
        this.cube.rotation.y += 0.2;
        this.sceneApp.render();
    };
    return HelloThreejsSecond;
})();
var helloThreejsFirst = new HelloThreejsFirst();
var helloThreejsSecond = new HelloThreejsSecond();
browserContext.addSceneApp(helloThreejsFirst.sceneApp);
browserContext.addSceneApp(helloThreejsSecond.sceneApp);
var render = function () {
    requestAnimationFrame(render);
    helloThreejsFirst.render();
    helloThreejsSecond.render();
};
render();
//# sourceMappingURL=HelloThreejs.js.map