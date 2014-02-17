/**
 * Created by Kai Salmen on 2014.02.08
 */
var APPTR = {};

APPTR.dom = {
    canvasDiv : null
}
APPTR.glWidth = 1280;
APPTR.glHeight = 720;
APPTR.widthScrollBar = 12;
APPTR.reductionHeight = APPTR.widthScrollBar + APPTR.widthScrollBar;
APPTR.reductionWidth = APPTR.widthScrollBar;
APPTR.shader = {
    vertexShaderText : null,
    fragmentShaderText : null
}
APPTR.DatGuiText = function() {
    this.resetCamera = false;
}
APPTR.datGui = {
    handler : null,
    text : null,
    controllerResetCamera : null
}
APPTR.renderer = null;
APPTR.scene = null;
APPTR.camera = null;
APPTR.cameraTarget = null;
APPTR.objectText = {
    mesh : null,
    geometry : null,
    material : null
}
APPTR.textParams = {
    name : "Magnificent void!",
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

$(document).ready(
    $.when(
        loadVertexShader(),
        loadFragmentShader()
    ).done(
        function(vert, frag) {
            console.log("Shader and texture loading from file is completed!");
            APPTR.shader.fragmentShaderText = vert[0];
            APPTR.shader.fragmentShaderText = frag[0];

            initPreGL();
            initGL();
            initPostGL();

            animateFrame();
        }
    )
);

function loadVertexShader() {
    return $.get("../resource/shader/passThrough.vs", function(data) {
        console.log(data);
    });
}

function loadFragmentShader() {
    return $.get("../resource/shader/simpleTextureEffect.fs", function(data) {
        console.log(data);
    });
}

function initPreGL() {
    APPTR.dom.canvasDiv = document.getElementById("kaiWebGL");
    APPTR.dom.canvasDiv.style.width = APPTR.glWidth + "px";
    APPTR.dom.canvasDiv.style.height = APPTR.glHeight + "px";

    APPTR.datGui.handler = new dat.GUI();
    APPTR.datGui.text = new APPTR.DatGuiText();
    APPTR.datGui.controllerResetCamera = APPTR.datGui.handler.add(APPTR.datGui.text, 'resetCamera');
}

function initGL() {
    APPTR.renderer = new THREE.WebGLRenderer();
    APPTR.renderer.setClearColor(new THREE.Color(0, 0, 0), 255);
    APPTR.renderer.setSize(APPTR.glWidth, APPTR.glHeight);

    APPTR.scene = new THREE.Scene();

    APPTR.camera = new THREE.PerspectiveCamera(75, (APPTR.glWidth) / (APPTR.glHeight), 0.1, 1000);
    APPTR.camera.position.set( 0, 0, 500 );
    APPTR.cameraTarget = new THREE.Vector3( 0, 0, 0 );

    var light = new THREE.DirectionalLight( 0x00aaff, 1.0);
    light.position.set(0, 1, 1);
    APPTR.scene.add( light );

    APPTR.objectText.geometry = new THREE.TextGeometry(APPTR.textParams.name, APPTR.textParams);
    APPTR.objectText.geometry.computeBoundingBox();
    APPTR.objectText.geometry.computeVertexNormals();

    console.log("BB: " + APPTR.objectText.geometry.boundingBox.max.x + "|" + APPTR.objectText.geometry.boundingBox.min.x);
    console.log("BB: " + APPTR.objectText.geometry.boundingBox.max.y + "|" + APPTR.objectText.geometry.boundingBox.min.y);
    console.log("BB: " + APPTR.objectText.geometry.boundingBox.max.z + "|" + APPTR.objectText.geometry.boundingBox.min.z);

    APPTR.objectText.material = new THREE.MeshFaceMaterial( [
        new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.FlatShading } ), // front
        new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.SmoothShading } ) // side
    ] );

    APPTR.objectText.mesh = new THREE.Mesh( APPTR.objectText.geometry, APPTR.objectText.material );
    APPTR.objectText.mesh.position.x = -(APPTR.objectText.geometry.boundingBox.max.x - APPTR.objectText.geometry.boundingBox.min.x) / 2;
    APPTR.objectText.mesh.position.y = -(APPTR.objectText.geometry.boundingBox.max.y - APPTR.objectText.geometry.boundingBox.min.y) / 2;
    APPTR.objectText.mesh.position.z = -(APPTR.objectText.geometry.boundingBox.max.z - APPTR.objectText.geometry.boundingBox.min.z) / 2;
    APPTR.scene.add(APPTR.objectText.mesh);

    calcResize();
}

function initPostGL() {
    addEventHandlers();
    APPTR.dom.canvasDiv.appendChild(APPTR.renderer.domElement);
}

function addEventHandlers() {
    window.addEventListener('resize', onWindowResize, false);
}

function animateFrame() {
    requestAnimationFrame(animateFrame);
    render();
}

function render() {
    APPTR.camera.lookAt( APPTR.cameraTarget );

    APPTR.renderer.render(APPTR.scene, APPTR.camera);
}

function onWindowResize(event) {
    event.preventDefault();
    calcResize();
}

function calcResize() {
    APPTR.glWidth  = window.innerWidth - APPTR.reductionWidth;
    APPTR.glHeight = window.innerHeight - APPTR.reductionHeight;

    APPTR.camera.aspect = (APPTR.glWidth / APPTR.glHeight);
    APPTR.camera.updateProjectionMatrix();
    APPTR.renderer.setSize(APPTR.glWidth, APPTR.glHeight);
}