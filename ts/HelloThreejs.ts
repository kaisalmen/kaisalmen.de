/**
 * Created by Kai on 14.03.2015.
 */

/// <reference path="../libs/ts/threejs/three.d.ts" />
/// <reference path="../libs/ts/jquery/jquery.d.ts" />
/// <reference path="./appBase/BrowserContext.ts" />
/// <reference path="./appBase/SceneApp.ts" />
/// <reference path="./appBase/SceneAppPerspective.ts" />
/// <reference path="./appBase/TextUnit.ts" />
/// <reference path="./appBase/Text2d.ts" />

class HelloThreejsFirst implements SceneAppUser {

    sceneApp : SceneApp;
    private cube : THREE.Mesh;

    constructor() {
        this.sceneApp = new SceneAppPerspective(this, document.getElementById("DivGL1"), <HTMLCanvasElement> document.getElementById("DivGL1Canvas"));

        var geometry = new THREE.SphereGeometry(1, 32, 32);
        var material = new THREE.MeshNormalMaterial();
        this.sphere = new THREE.Mesh(geometry, material);
    }

    getAppName() {
        return "first";
    }

    initGL() {
        this.sceneApp.scene.add(this.sphere);
        this.sceneApp.camera.position.z = 5;
    }

    render() {
        this.sphere.rotation.x += 0.1;
        this.sphere.rotation.y += 0.1;
        this.sceneApp.render();
    }
}

class HelloThreejsSecond implements SceneAppUser {

    sceneApp : SceneApp;
    private cube : THREE.Mesh;
    private text : TextUnit;
    private textStorage : Text2d;

    constructor() {
        this.sceneApp = new SceneAppPerspective(this, document.getElementById("DivGL4"), <HTMLCanvasElement> document.getElementById("DivGL4Canvas"));

        var geometry = new THREE.BoxGeometry(1, 2, 1);
        var material = new THREE.MeshNormalMaterial();

        this.textStorage = new Text2d();
        this.text = this.textStorage.addText("Hello", "Hello world sldfjsfj  sdkf jsadf aslkdf asj flas fasjklflas fasfljasldf ask ldf", new THREE.MeshBasicMaterial(), 0.1, 10);

        this.sphere = new THREE.Mesh(geometry, material);
        this.sceneApp.scene.add(this.sphere);
        this.sceneApp.camera.position.z = 5;
    }

    getAppName() {
        return "second";
    }

    initGL() {
        this.sceneApp.scene.add(this.sphere);
        this.sceneApp.camera.position.z = 5;

        this.text.mesh.position.set(-3, 0, 0);
        this.sceneApp.scene.add(this.text.mesh)
    }

    render() {
        this.sphere.rotation.x += 0.2;
        this.sphere.rotation.y += 0.2;
        this.sceneApp.render();
    }
}

var helloThreejsFirst = new HelloThreejsFirst();
var helloThreejsSecond = new HelloThreejsSecond();

browserContext.addSceneApp(helloThreejsFirst.sceneApp);
browserContext.addSceneApp(helloThreejsSecond.sceneApp);

var render = function () {
    requestAnimationFrame(render);
    helloThreejsFirst.render();
    helloThreejsSecond.render();

    document.getElementById("DivGL1").style.width = "70%";
    document.getElementById("DivGL2").style.width = "30%";
    document.getElementById("DivGL3").style.width = "70%";
    document.getElementById("DivGL4").style.width = "30%";
};

render();






