/**
 * Created by Kai Salmen on 2014.02.08
 */
var APPTR = {};

APPTR.dom = {
    canvasDiv : null,
    canvasAPPTRFloat : null,
    datGui : null
}
APPTR.glWidth = 1280.0;
APPTR.glHeight = APPTR.glWidth / 2.35;
APPTR.widthScrollBar = 2;
APPTR.reductionHeight = APPTR.widthScrollBar + APPTR.widthScrollBar;
APPTR.reductionWidth = APPTR.widthScrollBar;
APPTR.shader = {
    vertexShaderText : null,
    fragmentShaderText : null,
    uniforms : {
        blendFactor : { type: "f", value: 0.15 },
        ilFactor : { type: "f", value: APPTR.glHeight * 2 },
        colorFactor : { type: "fv1", value: [1.0, 1.0, 1.0] },
        texture1: { type: "t", value: null }
    }
}
APPTR.datGui = {
    objFunction : function() {
        this.resetCamera = resetTrackballControls;
        this.opacityText = 1.0;
        this.opacityShader = 0.15;
        this.red = 0;
        this.green = 170;
        this.blue = 255;
        this.enableShader = true;
    },
    selfRef : null,
    controllerBlendText : null,
    controllerBlendShader : null,
    controllerLevelR : null,
    controllerLevelG : null,
    controllerLevelB : null
}
APPTR.datGuiDomElement = null;
APPTR.trackballControls = null;
APPTR.renderer = null;
APPTR.scenes = {};
APPTR.scenes.perspective = {
    camera : null,
    cameraTarget : null,
    scene : null
}
APPTR.scenes.ortho = {
    camera : null,
    scene : null,
    Billboard : {
        geometry : null,
        material : null,
        mesh : null
    },
    pixelLeft : null,
    pixelRight : null,
    pixelTop : null,
    pixelBottom : null
}
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
        ShaderTools.FileUtils.loadShader("../resource/shader/passThrough.glsl"),
        ShaderTools.FileUtils.loadShader("../resource/shader/overlayEffectTextureEffect.glsl")
    ).done(
        function(vert, frag) {
            console.log("Shader and texture loading from file is completed!");

            APPTR.shader.vertexShaderText = vert[0];
            console.log("Vertex Shader: " + APPTR.shader.vertexShaderText);
            //APPTR.shader.fragmentShaderText = base[0] + "\n" + frag[0];
            APPTR.shader.fragmentShaderText = frag[0];
            console.log("Fragment Shader: " + APPTR.shader.fragmentShaderText);

            APPTR.shader.uniforms.texture1.value = THREE.ImageUtils.loadTexture("../../resource/images/noise.jpg", THREE.UVMapping, updateTextures);

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
    calcResize();
});

function updateTextures() {
    console.log("Texture loading was completed successfully!");
    APPTR.shader.uniforms.texture1.value.wrapS = THREE.RepeatWrapping;
    APPTR.shader.uniforms.texture1.value.wrapT = THREE.RepeatWrapping;
    APPTR.shader.uniforms.texture1.value.repeat.set( 2, 2 );
}

function initPreGL() {
    APPTR.dom.canvasDiv = document.getElementById("APPTRWebGL");

    var text = new APPTR.datGui.objFunction();
    APPTR.datGui.selfRef = text;
    var gui = new dat.GUI(
        {
            autoPlace : false,
        }
    );
    gui.add(text, 'resetCamera');
    APPTR.datGui.controllerBlendText =  gui.add(text, 'opacityText', 0.0, 1.0);
    APPTR.datGui.controllerLevelR = gui.add(text, 'red', 0, 255);
    APPTR.datGui.controllerLevelG = gui.add(text, 'green', 0, 255);
    APPTR.datGui.controllerLevelB = gui.add(text, 'blue', 0, 255);
    gui.add(text, 'enableShader');
    APPTR.datGui.controllerBlendShader =  gui.add(text, 'opacityShader', 0.0, 1.0);

    APPTR.dom.canvasAPPTRFloat = document.getElementById("APPTRFloat");
    APPTR.dom.datGui = gui.domElement;
    APPTR.dom.canvasAPPTRFloat.appendChild(APPTR.dom.datGui);

    calcResizeHtml();
}

function initGL() {
    APPTR.renderer = new THREE.WebGLRenderer();
    APPTR.renderer.setClearColor(new THREE.Color(0.02, 0.02, 0.02), 255);
    APPTR.renderer.setSize(APPTR.glWidth, APPTR.glHeight);
    APPTR.renderer.autoClear = false;

    APPTR.scenes.perspective.scene = new THREE.Scene();
    APPTR.scenes.perspective.camera = new THREE.PerspectiveCamera(70, (APPTR.glWidth) / (APPTR.glHeight), 0.1, 10000);

    APPTR.scenes.ortho.scene = new THREE.Scene();
    APPTR.scenes.ortho.camera = new THREE.OrthographicCamera( - APPTR.glWidth / 2, APPTR.glWidth / 2, APPTR.glHeight / 2, - APPTR.glHeight / 2, 1, 10 );
    resetCamera();

    APPTR.light = new THREE.DirectionalLight( 0xffffff, 1.0);
    APPTR.light.position.set(0, 1, 1);
    APPTR.scenes.perspective.scene.add( APPTR.light );

    APPTR.objectText.geometry = new THREE.TextGeometry(APPTR.textParams.name, APPTR.textParams);
    APPTR.objectText.geometry.computeBoundingBox();
    APPTR.objectText.geometry.computeVertexNormals();

    APPTR.objectText.material = new THREE.MeshFaceMaterial( [
        // front
        new THREE.MeshPhongMaterial( {
            color: 0xffffff,
            shading: THREE.FlatShading,
            transparent: true,
            opacity: APPTR.datGui.selfRef.opacityText,
            side: THREE.DoubleSide
        } ),
        // side
        new THREE.MeshPhongMaterial({
            color: 0xffffff,
            shading: THREE.SmoothShading,
            transparent: true,
            opacity: APPTR.datGui.selfRef.opacityText,
            side: THREE.DoubleSide
        } )
    ] );
    updateMaterials();

    APPTR.objectText.mesh = new THREE.Mesh( APPTR.objectText.geometry, APPTR.objectText.material );
    APPTR.objectText.mesh.position.x = -(APPTR.objectText.geometry.boundingBox.max.x - APPTR.objectText.geometry.boundingBox.min.x) / 2;
    APPTR.objectText.mesh.position.y = -(APPTR.objectText.geometry.boundingBox.max.y - APPTR.objectText.geometry.boundingBox.min.y) / 2;
    APPTR.objectText.mesh.position.z = -(APPTR.objectText.geometry.boundingBox.max.z - APPTR.objectText.geometry.boundingBox.min.z) / 2;
    APPTR.scenes.perspective.scene.add(APPTR.objectText.mesh);

    APPTR.scenes.ortho.Billboard.material = new THREE.ShaderMaterial( {
        uniforms: APPTR.shader.uniforms,
        vertexShader: APPTR.shader.vertexShaderText,
        fragmentShader: APPTR.shader.fragmentShaderText,
        transparent: true,
        side: THREE.DoubleSide
    } );
    APPTR.scenes.ortho.Billboard.geometry = new THREE.PlaneGeometry(APPTR.glWidth, APPTR.glHeight);
    APPTR.scenes.ortho.Billboard.mesh = new THREE.Mesh(APPTR.scenes.ortho.Billboard.geometry, APPTR.scenes.ortho.Billboard.material);
    APPTR.scenes.ortho.scene.add(APPTR.scenes.ortho.Billboard.mesh);

    // init trackball controls
    APPTR.trackballControls = new THREE.TrackballControls(APPTR.scenes.perspective.camera);
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
    APPTR.datGui.controllerBlendText.onChange(function(value) {
        APPTR.datGui.selfRef.opacityText = value;
        for (var i in APPTR.objectText.material.materials) {
            var mat = APPTR.objectText.material.materials[i];
            mat.opacity = value;
        }
    });
    APPTR.datGui.controllerBlendShader.onChange(function(value) {
        APPTR.datGui.selfRef.opacityShader = value;
        APPTR.shader.uniforms.blendFactor.value = value;
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
    var red = APPTR.datGui.selfRef.red / 255;
    var green = APPTR.datGui.selfRef.green / 255;
    var blue = APPTR.datGui.selfRef.blue / 255;
    for (var i in APPTR.objectText.material.materials) {
        var mat = APPTR.objectText.material.materials[i];
        mat.color.setRGB(red, green, blue);
    }
    APPTR.shader.uniforms.colorFactor.value[0] = red;
    APPTR.shader.uniforms.colorFactor.value[1] = green;
    APPTR.shader.uniforms.colorFactor.value[2] = blue;
}

function animateFrame() {
    requestAnimationFrame(animateFrame);
    APPTR.trackballControls.update();
    render();
}

function render() {
    APPTR.renderer.clear();
    APPTR.renderer.render(APPTR.scenes.perspective.scene, APPTR.scenes.perspective.camera);
    if (APPTR.datGui.selfRef.enableShader) {
        APPTR.renderer.clearDepth();
        APPTR.renderer.render(APPTR.scenes.ortho.scene, APPTR.scenes.ortho.camera);
    }
}

function resetTrackballControls() {
    console.log("resetTrackballControls");
    resetCamera();
    APPTR.trackballControls.reset();
    render();
}

function resetCamera() {
    APPTR.scenes.perspective.camera.position.set( 0, 0, 250 );
    APPTR.scenes.perspective.cameraTarget = new THREE.Vector3( 0, 0, 0 );
    APPTR.scenes.perspective.camera.lookAt( APPTR.scenes.perspective.cameraTarget );
    APPTR.scenes.perspective.camera.updateProjectionMatrix();
    if (APPTR.datGui.selfRef.enableShader) {
        APPTR.scenes.ortho.camera.position.set(0, 0, 10);
    }
}

function calcResizeHtml() {
    APPTR.glWidth  = window.innerWidth;
    APPTR.glHeight = window.innerWidth / 2.35;

    APPTR.dom.canvasDiv.style.width = APPTR.glWidth - APPTR.reductionWidth + "px";
    APPTR.dom.canvasDiv.style.height = APPTR.glHeight  - APPTR.reductionHeight + "px";

    APPTR.dom.canvasAPPTRFloat.style.top = 0 + "px";
    APPTR.dom.canvasAPPTRFloat.style.left = (window.innerWidth - parseInt(APPTR.dom.datGui.style.width)) + "px";
}

function calcResize() {
    APPTR.trackballControls.handleResize();
    calcResizeHtml();
    calcResizePerspectiveCamera();
    if (APPTR.datGui.selfRef.enableShader) {
        calcResizeBillboardCamera();
    }
    APPTR.renderer.setSize(APPTR.glWidth, APPTR.glHeight);
}

function calcResizePerspectiveCamera() {
    APPTR.scenes.perspective.camera.aspect = (APPTR.glWidth / APPTR.glHeight);
    APPTR.scenes.perspective.camera.updateProjectionMatrix();
}

function calcResizeBillboardCamera() {
    // calc screen dimension halfs
    APPTR.scenes.ortho.pixelLeft = -APPTR.glWidth / 2;
    APPTR.scenes.ortho.pixelRight = APPTR.glWidth / 2;
    APPTR.scenes.ortho.pixelTop = APPTR.glHeight / 2;
    APPTR.scenes.ortho.pixelBottom = -APPTR.glHeight / 2;

    // update camera
    APPTR.scenes.ortho.camera.left = APPTR.scenes.ortho.pixelLeft;
    APPTR.scenes.ortho.camera.right = APPTR.scenes.ortho.pixelRight;
    APPTR.scenes.ortho.camera.top = APPTR.scenes.ortho.pixelTop;
    APPTR.scenes.ortho.camera.bottom = APPTR.scenes.ortho.pixelBottom;
    APPTR.scenes.ortho.camera.updateProjectionMatrix();

    // update billboard geometries dimensions
    APPTR.scenes.ortho.Billboard.mesh.geometry.vertices[0].x = APPTR.scenes.ortho.pixelLeft;
    APPTR.scenes.ortho.Billboard.mesh.geometry.vertices[0].y = APPTR.scenes.ortho.pixelTop;
    APPTR.scenes.ortho.Billboard.mesh.geometry.vertices[1].x = APPTR.scenes.ortho.pixelRight;
    APPTR.scenes.ortho.Billboard.mesh.geometry.vertices[1].y = APPTR.scenes.ortho.pixelTop;
    APPTR.scenes.ortho.Billboard.mesh.geometry.vertices[2].x = APPTR.scenes.ortho.pixelLeft;
    APPTR.scenes.ortho.Billboard.mesh.geometry.vertices[2].y = APPTR.scenes.ortho.pixelBottom;
    APPTR.scenes.ortho.Billboard.mesh.geometry.vertices[3].x = APPTR.scenes.ortho.pixelRight;
    APPTR.scenes.ortho.Billboard.mesh.geometry.vertices[3].y = APPTR.scenes.ortho.pixelBottom;

    APPTR.scenes.ortho.Billboard.mesh.geometry.verticesNeedUpdate = true;
}