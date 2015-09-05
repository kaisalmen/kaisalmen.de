/**
 * Created by Kai on 14.03.2015.
 */

/// <reference path="../libs/ts/threejs/three.d.ts" />
/// <reference path="../libs/ts/jquery/jquery.d.ts" />
/// <reference path="./appBase/BrowserContext.ts" />
/// <reference path="./appBase/SceneApp.ts" />
/// <reference path="./appBase/SceneAppPerspective.ts" />

class HelloThreejsFirst implements SceneAppUser {

    sceneApp : SceneApp;
    private cube : THREE.Mesh;

    constructor() {
        this.sceneApp = new SceneAppPerspective(this, document.getElementById("DivGL1"), <HTMLCanvasElement> document.getElementById("DivGL1Canvas"));

        var geometry = new THREE.BoxGeometry(1, 1, 1);
        var material = new THREE.MeshNormalMaterial();
        this.cube = new THREE.Mesh(geometry, material);
    }

    getAppName() {
        return "first";
    }

    initGL() {
        this.sceneApp.scene.add(this.cube);
        this.sceneApp.camera.position.z = 5;
    }

    render() {
        this.cube.rotation.x += 0.1;
        this.cube.rotation.y += 0.1;
        this.sceneApp.render();
    }
}

class HelloThreejsSecond implements SceneAppUser {

    sceneApp : SceneApp;
    private cube : THREE.Mesh;
    private text : THREE.Mesh;

    constructor() {
        this.sceneApp = new SceneAppPerspective(this, document.getElementById("master"), <HTMLCanvasElement> document.getElementById("DivGL4Canvas"));

        var geometry = new THREE.BoxGeometry(1, 2, 1);
        var material = new THREE.MeshNormalMaterial();

        var shapes = THREE.FontUtils.generateShapes( "Hello world", {
            font: "ubuntu mono",
            curveSegments : 10,
            weight: "normal",
            size: 1
        } );
        var geom = new THREE.ShapeGeometry(shapes);
        var mat = new THREE.MeshBasicMaterial();
        this.text = new THREE.Mesh(geom, mat);

        this.cube = new THREE.Mesh(geometry, material);
        this.sceneApp.scene.add(this.cube);
        this.sceneApp.camera.position.z = 5;
    }

    getAppName() {
        return "second";
    }

    initGL() {
        this.sceneApp.scene.add(this.cube);
        this.sceneApp.camera.position.z = 5;

        this.text.position.set(-3, 0, 0);
        this.sceneApp.scene.add(this.text)
    }

    render() {
        this.cube.rotation.x += 0.2;
        this.cube.rotation.y += 0.2;
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
};

render();






