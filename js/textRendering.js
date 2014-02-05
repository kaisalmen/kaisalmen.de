/**
 * Created by Kai on 24.01.14.
 */

var APPTR = {};

APPTR.dom = {
    canvasDiv : null
}
APPTR.renderer = null;
APPTR.glWidth = 1280;
APPTR.glHeight = 720;
APPTR.scene = null;
APPTR.camera = null;
APPTR.cameraTarget = null;
APPTR.objectText = {
    mesh : null,
    geometry : null,
    material : null
}
APPTR.textParams = {
    name : "Magnificent void",
    height : 20,
    size : 70,
    hover : 30,
    curveSegments : 3,
    bevelThickness : 2,
    bevelSize : 1.0,
    bevelSegments : 3,
    bevelEnabled : true,
    font : "optimer",
    weight : "normal",
    style : "normal",
    material : 0,
    extrudeMaterial : 1
}

function initPreGL() {
    APPTR.dom.canvasDiv = document.getElementById("kaiWebGL");
    APPTR.dom.canvasDiv.style.width = APPTR.glWidth + "px";
    APPTR.dom.canvasDiv.style.height = APPTR.glHeight + "px";
}

function initGL() {
    APPTR.renderer = new THREE.WebGLRenderer();
    APPTR.renderer.setClearColor(new THREE.Color(0, 0, 0), 255);
    APPTR.renderer.setSize(APPTR.glWidth, APPTR.glHeight);

    APPTR.scene = new THREE.Scene();

    APPTR.camera = new THREE.PerspectiveCamera(75, (APPTR.glWidth) / (APPTR.glHeight), 0.1, 1000);
    APPTR.camera.position.set( 0, 200, 700 );
    APPTR.cameraTarget = new THREE.Vector3( 0, 150, 0 );

    var light = new THREE.DirectionalLight( 0xaaaaaa, 1.0);
    light.position.set(0, 1, 1);
    APPTR.scene.add( light );

    APPTR.objectText.geometry = new THREE.TextGeometry(APPTR.textParams.name, APPTR.textParams);
    APPTR.objectText.geometry.computeBoundingBox();
    APPTR.objectText.geometry.computeVertexNormals();

    APPTR.objectText.material = new THREE.MeshFaceMaterial( [
        new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.FlatShading } ), // front
        new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.SmoothShading } ) // side
    ] );

    APPTR.objectText.mesh = new THREE.Mesh( APPTR.objectText.geometry, APPTR.objectText.material );
    APPTR.objectText.mesh.position.x = -100;
    APPTR.objectText.mesh.position.y = 0;
    APPTR.objectText.mesh.position.z = 0;
    APPTR.scene.add(APPTR.objectText.mesh);
}

function initPostGL() {
    APPTR.dom.canvasDiv.appendChild(APPTR.renderer.domElement);
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    APPTR.camera.lookAt( APPTR.cameraTarget );

    APPTR.renderer.render(APPTR.scene, APPTR.camera);
}