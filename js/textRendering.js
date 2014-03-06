/**
 * Created by Kai Salmen on 2014.02.08
 */
var APPTR = {};

APPTR.dom = {
    canvasDiv : null,
    canvasAPPTRFloat : null,
    datGui : null
}
APPTR.glWidth = 1280;
APPTR.glHeight = APPTR.glWidth / 2.35;
APPTR.widthScrollBar = 2;
APPTR.reductionHeight = APPTR.widthScrollBar + APPTR.widthScrollBar;
APPTR.reductionWidth = APPTR.widthScrollBar;
APPTR.shader = {
    vertexShaderText : null,
    fragmentShaderText : null
}
APPTR.datGui = {
    objFunction : function() {
        this.resetCamera = resetTrackballControls;
        this.blend = 0.75;
        this.colorLevelR = 0.0;
        this.colorLevelG = 2 / 3;
        this.colorLevelB = 1.0;
    },
    selfRef : null,
    controllerBlend : null,
    controllerLevelR : null,
    controllerLevelG : null,
    controllerLevelB : null
}
APPTR.datGuiDomElement = null;
APPTR.trackballControls = null;
APPTR.renderer = null;
APPTR.scene = null;
APPTR.camera = null;
APPTR.cameraTarget = null;
APPTR.light = null;
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
    APPTR.dom.canvasDiv = document.getElementById("APPTRWebGL");

    var text = new APPTR.datGui.objFunction();
    var gui = new dat.GUI(
        {
            autoPlace: false
        }
    );
    gui.add(text, 'resetCamera');
//    APPTR.datGui.controllerBlend = gui.add(text, 'blend', 0.0, 1.0);
    APPTR.datGui.controllerLevelR = gui.add(text, 'colorLevelR', 0.0, 1.0);
    APPTR.datGui.controllerLevelG = gui.add(text, 'colorLevelG', 0.0, 1.0);
    APPTR.datGui.controllerLevelB = gui.add(text, 'colorLevelB', 0.0, 1.0);
    gui.close();
    APPTR.datGui.selfRef = text;

    APPTR.dom.canvasAPPTRFloat = document.getElementById("APPTRFloat");
    APPTR.dom.datGui = gui.domElement;
    APPTR.dom.canvasAPPTRFloat.appendChild(APPTR.dom.datGui);

    calcResizeHtml();
}

function initGL() {
    APPTR.renderer = new THREE.WebGLRenderer();
    APPTR.renderer.setClearColor(new THREE.Color(0.02, 0.02, 0.02), 255);
    APPTR.renderer.setSize(APPTR.glWidth, APPTR.glHeight);

    APPTR.scene = new THREE.Scene();

    APPTR.camera = new THREE.PerspectiveCamera(70, (APPTR.glWidth) / (APPTR.glHeight), 0.1, 10000);
    resetCamera();

    APPTR.light = new THREE.DirectionalLight( 0x000000, 1.0);
    APPTR.light.position.set(0, 1, 1);
    updateLight();
    APPTR.scene.add( APPTR.light );

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

    addEventHandlers();

    calcResize();
}

function initPostGL() {
    APPTR.dom.canvasDiv.appendChild(APPTR.renderer.domElement);
}

function addEventHandlers() {
    window.addEventListener('resize', onWindowResize, false);

    APPTR.trackballControls = new THREE.TrackballControls(APPTR.camera);
    APPTR.trackballControls.rotateSpeed = 0.5;
    APPTR.trackballControls.rotateSpeed = 1.0;
    APPTR.trackballControls.panSpeed = 0.5;
    APPTR.trackballControls.noPan = false;
    APPTR.trackballControls.noZoom = false;
    APPTR.trackballControls.addEventListener( 'change', requestRender );

    APPTR.datGui.controllerLevelR.onChange(function(value) {
        APPTR.datGui.selfRef.colorLevelR = value;
        updateLight();
    });
    APPTR.datGui.controllerLevelG.onChange(function(value) {
        APPTR.datGui.selfRef.colorLevelG = value;
        updateLight();
    });
    APPTR.datGui.controllerLevelB.onChange(function(value) {
        APPTR.datGui.selfRef.colorLevelB = value;
        updateLight();
    });
}

function updateLight() {
    APPTR.light.color.setRGB( APPTR.datGui.selfRef.colorLevelR, APPTR.datGui.selfRef.colorLevelG, APPTR.datGui.selfRef.colorLevelB );
}

function animateFrame() {
    requestAnimationFrame(animateFrame);
    render();
}

function requestRender() {
    APPTR.trackballControls.update();
    render();
}

function render() {
    APPTR.renderer.render(APPTR.scene, APPTR.camera);
}

function resetTrackballControls() {
    console.log("resetTrackballControls");
    resetCamera();
    APPTR.trackballControls.reset();
    requestRender();
}

function resetCamera() {
    APPTR.camera.position.set( 0, 0, 250 );
    APPTR.cameraTarget = new THREE.Vector3( 0, 0, 0 );
    APPTR.camera.lookAt( APPTR.cameraTarget );
    APPTR.camera.updateProjectionMatrix();
}

function onWindowResize(event) {
    event.preventDefault();
    calcResize();
}

function calcResizeHtml() {
    APPTR.glWidth  = window.innerWidth - APPTR.reductionWidth;
    APPTR.glHeight = window.innerWidth / 2.35 - APPTR.reductionHeight;

    APPTR.dom.canvasDiv.style.width = APPTR.glWidth + "px";
    APPTR.dom.canvasDiv.style.height = APPTR.glHeight + "px";

    APPTR.dom.canvasAPPTRFloat.style.top = 0 + "px";
    APPTR.dom.canvasAPPTRFloat.style.left = (window.innerWidth - parseInt(APPTR.dom.datGui.style.width)) + "px";
}

function calcResize() {
    APPTR.trackballControls.handleResize();

    calcResizeHtml();

    APPTR.camera.aspect = (APPTR.glWidth / APPTR.glHeight);
    APPTR.camera.updateProjectionMatrix();
    APPTR.renderer.setSize(APPTR.glWidth, APPTR.glHeight);
}