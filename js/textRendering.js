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
        this.opacity = 1.0;
        this.red = 0;
        this.green = 170;
        this.blue = 255;
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
        loadShader("../resource/shader/noise2D.glsl"),
        loadShader("../resource/shader/passThrough.glsl"),
        loadShader("../resource/shader/simpleTextureEffect.glsl")
    ).done(
        function(base, vert, frag) {
            console.log("Shader and texture loading from file is completed!");

            APPTR.shader.vertexShaderText = vert[0];
            console.log("Vertex Shader: " + APPTR.shader.vertexShaderText);
            APPTR.shader.fragmentShaderText = base[0] + "\n" + frag[0];
            console.log("Fragment Shader: " + APPTR.shader.fragmentShaderText);

            initPreGL();
            initGL();
            initPostGL();

            animateFrame();
        }
    )
)
.on({
    mouseenter: function() {
        APPTR.trackballControls.enabled = false;
        APPTR.trackballControls.noPan = true;
    },
    mouseleave: function() {
        APPTR.trackballControls.enabled = true;
        APPTR.trackballControls.noPan = false;
    }
}, "#APPTRFloat")
.on({
    mouseenter: function() {
        APPTR.trackballControls.enabled = true;
        APPTR.trackballControls.noPan = false;
    },
    mouseleave: function() {
        APPTR.trackballControls.enabled = false;
        APPTR.trackballControls.noPan = true;
    }
}, "#APPTRWebGL");

$(window).resize(function() {
    console.log("Window Resize called!");
    calcResize();
});

function loadShader(path) {
    return $.get(path, function(data) {
    });
}

function initPreGL() {
    APPTR.dom.canvasDiv = document.getElementById("APPTRWebGL");

    var text = new APPTR.datGui.objFunction();
    APPTR.datGui.selfRef = text;
    var gui = new dat.GUI(
        {
            autoPlace: false
        }
    );
    gui.add(text, 'resetCamera');
    APPTR.datGui.controllerBlend =  gui.add(text, 'opacity', 0.0, 1.0);
    APPTR.datGui.controllerLevelR = gui.add(text, 'red', 0, 255);
    APPTR.datGui.controllerLevelG = gui.add(text, 'green', 0, 255);
    APPTR.datGui.controllerLevelB = gui.add(text, 'blue', 0, 255);
    gui.close();

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

    APPTR.light = new THREE.DirectionalLight( 0xffffff, 1.0);
    APPTR.light.position.set(0, 1, 1);
    APPTR.scene.add( APPTR.light );

    APPTR.objectText.geometry = new THREE.TextGeometry(APPTR.textParams.name, APPTR.textParams);
    APPTR.objectText.geometry.computeBoundingBox();
    APPTR.objectText.geometry.computeVertexNormals();

    console.log("BB: " + APPTR.objectText.geometry.boundingBox.max.x + "|" + APPTR.objectText.geometry.boundingBox.min.x);
    console.log("BB: " + APPTR.objectText.geometry.boundingBox.max.y + "|" + APPTR.objectText.geometry.boundingBox.min.y);
    console.log("BB: " + APPTR.objectText.geometry.boundingBox.max.z + "|" + APPTR.objectText.geometry.boundingBox.min.z);

    APPTR.objectText.material = new THREE.MeshFaceMaterial( [
        // front
        new THREE.MeshPhongMaterial( {
            color: 0xffffff,
            shading: THREE.FlatShading,
            transparent: true,
            opacity: APPTR.datGui.selfRef.opacity,
            side: THREE.DoubleSide
        } ),
        // side
        new THREE.MeshPhongMaterial({
            color: 0xffffff,
            shading: THREE.SmoothShading,
            transparent: true,
            opacity: APPTR.datGui.selfRef.opacity,
            side: THREE.DoubleSide
        } )
    ] );
    updateMaterials();

    APPTR.objectText.mesh = new THREE.Mesh( APPTR.objectText.geometry, APPTR.objectText.material );
    APPTR.objectText.mesh.position.x = -(APPTR.objectText.geometry.boundingBox.max.x - APPTR.objectText.geometry.boundingBox.min.x) / 2;
    APPTR.objectText.mesh.position.y = -(APPTR.objectText.geometry.boundingBox.max.y - APPTR.objectText.geometry.boundingBox.min.y) / 2;
    APPTR.objectText.mesh.position.z = -(APPTR.objectText.geometry.boundingBox.max.z - APPTR.objectText.geometry.boundingBox.min.z) / 2;
    APPTR.scene.add(APPTR.objectText.mesh);

    var map = THREE.ImageUtils.loadTexture("../../resource/images/house02.jpg");
    var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff, fog: true } );
    var sprite = new THREE.Sprite( material );
    APPTR.scene.add( sprite );

    // init trackball controls
    APPTR.trackballControls = new THREE.TrackballControls(APPTR.camera);
    APPTR.trackballControls.rotateSpeed = 0.5;
    APPTR.trackballControls.rotateSpeed = 1.0;
    APPTR.trackballControls.panSpeed = 0.5;
    APPTR.trackballControls.noPan = false;
    APPTR.trackballControls.noZoom = false;

    addEventHandlers();

    calcResize();
}

function initPostGL() {
    APPTR.dom.canvasDiv.appendChild(APPTR.renderer.domElement);
}

function addEventHandlers() {
    APPTR.datGui.controllerBlend.onChange(function(value) {
        APPTR.datGui.selfRef.opacity = value;
        for (var i in APPTR.objectText.material.materials) {
            var mat = APPTR.objectText.material.materials[i];
            mat.opacity = value;
        }
    });
    APPTR.datGui.controllerLevelR.onChange(function(value) {
        APPTR.datGui.selfRef.red = value;
        updateMaterials();
    });
    APPTR.datGui.controllerLevelG.onChange(function(value) {
        APPTR.datGui.selfRef.green = value;
        updateMaterials();
    });
    APPTR.datGui.controllerLevelB.onChange(function(value) {
        APPTR.datGui.selfRef.blue = value;
        updateMaterials();
    });
}

function updateMaterials() {
    for (var i in APPTR.objectText.material.materials) {
        var mat = APPTR.objectText.material.materials[i];
        mat.color.setRGB(
            APPTR.datGui.selfRef.red / 255,
            APPTR.datGui.selfRef.green / 255,
            APPTR.datGui.selfRef.blue / 255);
    }
}

function animateFrame() {
    requestAnimationFrame(animateFrame);
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
    render();
}

function resetCamera() {
    APPTR.camera.position.set( 0, 0, 250 );
    APPTR.cameraTarget = new THREE.Vector3( 0, 0, 0 );
    APPTR.camera.lookAt( APPTR.cameraTarget );
    APPTR.camera.updateProjectionMatrix();
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