/**
 * Updated by Kai Salmen on 2014.05.06
 */
var ATR = {};

var EXEC_FLOW = {}
EXEC_FLOW =  {
    initShaders : null,
    initPreGL : null,
    initGL : null,
    initPostGL : null,
    animateFrame : null
}

ATR.dom = {
    canvasDiv : null,
    canvasAPPTRFloat : null
}
ATR.screen = {
    aspectRatio : 2.35,
    glWidth : 1280.0,
    glHeight : 1280.0 / 2.35,
    glMinWidth : 800,
    glMinHeight : 800 / 2.35
}

ATR.widthScrollBar = 2;
ATR.frameNumber = 0;
ATR.reductionHeight = ATR.widthScrollBar + ATR.widthScrollBar;
ATR.reductionWidth = ATR.widthScrollBar;
ATR.shader = {
    vertexShaderText : null,
    fragmentShaderText : null,
    uniforms : {
        blendFactor : { type: "f", value: 0.15 },
        ilFactor : { type: "f", value: ATR.screen.glHeight / 2.0 },
        seed : { type: "f", value: Math.random() },
        colorFactor : { type: "fv1", value: [0.0, 1.0, 0.0] },
        texture1: { type: "t", value: null }
    },
    updateTextureRef : null,
    loadShaderFunc : function(vert, frag) {
        console.log("Shader and texture loading from file is completed!");
        ShaderTools.FileUtils.printShader(vert, "Vertex Shader");
        ShaderTools.FileUtils.printShader(frag, "Fragment Shader");

        ATR.shader.vertexShaderText = vert[0];
        //ATR.shader.fragmentShaderText = base[0] + "\n" + frag[0];
        ATR.shader.fragmentShaderText = frag[0];

        ATR.shader.uniforms.texture1.value = THREE.ImageUtils.loadTexture("../../resource/images/noise.jpg", THREE.UVMapping);
        ATR.shader.uniforms.texture1.value.wrapS = THREE.RepeatWrapping;
        ATR.shader.uniforms.texture1.value.wrapT = THREE.RepeatWrapping;
        ATR.shader.uniforms.texture1.value.repeat.set(2, 2);
        console.log("Textures were updated successfully!");
    },
    updateShaderFunc : function() {
        ATR.shader.uniforms.ilFactor.value = ATR.screen.glHeight / 2.0;
    }
}
ATR.datGui = {
    paramFunction : function(defaultText) {
        this.resetCamera = resetTrackballControls;
        this.content = defaultText;
        this.opacityText = 1.0;
        this.red = 0;
        this.green = 170;
        this.blue = 255;
        this.enableShader = true;
        this.opacityShader = 0.15;
        this.flickerShader = true;
        this.colorShader = "#00AAFF";
    },
    paramFunctionRef : null,
    datGuiRef : null,
    controllerTextContent : null,
    controllerBlendText : null,
    controllerLevelR : null,
    controllerLevelG : null,
    controllerLevelB : null,
    controllerEnableShader : null,
    controllerBlendShader : null,
    controllerColorShader : null
}
ATR.datGuiDomElement = null;
ATR.trackballControls = null;
ATR.renderer = null;
ATR.scenes = {};
ATR.scenes.perspective = {
    camera : null,
    cameraTarget : null,
    scene : null
}
ATR.scenes.ortho = {
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
    pixelBottom : null,
    calcResizeBillboardFunc : function() {
        if (ATR.datGui.paramFunctionRef.enableShader) {
            // calc screen dimension
            ATR.scenes.ortho.pixelLeft = -ATR.screen.glWidth / 2;
            ATR.scenes.ortho.pixelRight = ATR.screen.glWidth / 2;
            ATR.scenes.ortho.pixelTop = ATR.screen.glHeight / 2;
            ATR.scenes.ortho.pixelBottom = -ATR.screen.glHeight / 2;

            // update camera
            ATR.scenes.ortho.camera.left = ATR.scenes.ortho.pixelLeft;
            ATR.scenes.ortho.camera.right = ATR.scenes.ortho.pixelRight;
            ATR.scenes.ortho.camera.top = ATR.scenes.ortho.pixelTop;
            ATR.scenes.ortho.camera.bottom = ATR.scenes.ortho.pixelBottom;
            ATR.scenes.ortho.camera.updateProjectionMatrix();

            // update billboard geometries dimensions
            ATR.scenes.ortho.Billboard.mesh.geometry.vertices[0].x = ATR.scenes.ortho.pixelLeft;
            ATR.scenes.ortho.Billboard.mesh.geometry.vertices[0].y = ATR.scenes.ortho.pixelTop;
            ATR.scenes.ortho.Billboard.mesh.geometry.vertices[1].x = ATR.scenes.ortho.pixelRight;
            ATR.scenes.ortho.Billboard.mesh.geometry.vertices[1].y = ATR.scenes.ortho.pixelTop;
            ATR.scenes.ortho.Billboard.mesh.geometry.vertices[2].x = ATR.scenes.ortho.pixelLeft;
            ATR.scenes.ortho.Billboard.mesh.geometry.vertices[2].y = ATR.scenes.ortho.pixelBottom;
            ATR.scenes.ortho.Billboard.mesh.geometry.vertices[3].x = ATR.scenes.ortho.pixelRight;
            ATR.scenes.ortho.Billboard.mesh.geometry.vertices[3].y = ATR.scenes.ortho.pixelBottom;

            ATR.scenes.ortho.Billboard.mesh.geometry.verticesNeedUpdate = true;

            ATR.shader.updateShaderFunc();
        }
    }
}
ATR.light = null;
ATR.objectText = {
    mesh : null,
    geometry : null,
    material : null
}
ATR.text = {};
ATR.text.textParams = {
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
ATR.text.possibleContent = ["Change me!", "Adjust me!", "Modify me!", "Play with me!", "Reload me!"];
ATR.text.update = true;
ATR.text.lengthLimit = 50;

$(document).ready(
    $.when(
        ShaderTools.FileUtils.loadShader("../resource/shader/passThrough.glsl"),
        ShaderTools.FileUtils.loadShader("../resource/shader/overlayEffectTextureEffect.glsl")
    ).done(
        function(vert, frag) {
            EXEC_FLOW.initShaders = ATR.shader.loadShaderFunc(vert, frag);

            EXEC_FLOW.initPreGL = initPreGL();
            EXEC_FLOW.initGL = initGL();
            EXEC_FLOW.initPostGL = initPostGL();

            EXEC_FLOW.animateFrame = animateFrame();
        }
    )
)
.on({
    mouseenter: function() {
        ATR.trackballControls.enabled = false;
        ATR.trackballControls.noPan = true;
    },
    mouseleave: function() {
        ATR.trackballControls.enabled = true;
        ATR.trackballControls.noPan = false;
    }
}, "#APPTRFloat")
.on({
    mouseenter: function() {
        ATR.trackballControls.enabled = true;
        ATR.trackballControls.noPan = false;
    },
    mouseleave: function() {
        ATR.trackballControls.enabled = false;
        ATR.trackballControls.noPan = true;
    }
}, "#APPTRWebGL");

$(window).resize(function() {
    calcResize();
});

function initPreGL() {
    ATR.dom.canvasDiv = document.getElementById("APPTRWebGL");

    ATR.datGui.paramFunctionRef = new ATR.datGui.paramFunction(selectRandomText());
    ATR.datGui.datGuiRef = new dat.GUI(
        {
            autoPlace : false
        }
    );
    ATR.datGui.datGuiRef.add(ATR.datGui.paramFunctionRef, "resetCamera").name("Reset camera!");
    var textControls = ATR.datGui.datGuiRef.addFolder("Text Controls");
    var textText = "Text (length: " + ATR.text.lengthLimit + "):";
    ATR.datGui.controllerTextContent = textControls.add(ATR.datGui.paramFunctionRef, "content").name(textText).listen();
    ATR.datGui.controllerBlendText = textControls.add(ATR.datGui.paramFunctionRef, "opacityText", 0.0, 1.0).name("Opacity:");
    ATR.datGui.controllerLevelR = textControls.add(ATR.datGui.paramFunctionRef, "red", 0, 255).name("Red:");
    ATR.datGui.controllerLevelG = textControls.add(ATR.datGui.paramFunctionRef, "green", 0, 255).name("Green:");
    ATR.datGui.controllerLevelB = textControls.add(ATR.datGui.paramFunctionRef, "blue", 0, 255).name("Blue:");
    textControls.open();

    var shaderControls = ATR.datGui.datGuiRef.addFolder("Shader Controls");
    ATR.datGui.controllerEnableShader = shaderControls.add(ATR.datGui.paramFunctionRef, "enableShader").name("Enable:");
    ATR.datGui.controllerBlendShader = shaderControls.add(ATR.datGui.paramFunctionRef, "opacityShader", 0.0, 1.0).name("Opacity:");
    shaderControls.add(ATR.datGui.paramFunctionRef, "flickerShader").name("Flicker:");
    ATR.datGui.controllerColorShader = shaderControls.addColor(ATR.datGui.paramFunctionRef, "colorShader").name("Color:");
    shaderControls.open();

    ATR.dom.canvasAPPTRFloat = document.getElementById("APPTRFloat");
    ATR.dom.canvasAPPTRFloat.appendChild(ATR.datGui.datGuiRef.domElement);

    calcResizeHtml();
}

function initGL() {
    ATR.renderer = new THREE.WebGLRenderer();
    ATR.renderer.setClearColor(new THREE.Color(0.02, 0.02, 0.02), 255);
    ATR.renderer.setSize(ATR.screen.glWidth, ATR.screen.glHeight);
    ATR.renderer.autoClear = false;

    ATR.scenes.perspective.scene = new THREE.Scene();
    ATR.scenes.perspective.camera = new THREE.PerspectiveCamera(70, (ATR.screen.glWidth) / (ATR.screen.glHeight), 0.1, 10000);

    ATR.scenes.ortho.scene = new THREE.Scene();
    ATR.scenes.ortho.camera = new THREE.OrthographicCamera( - ATR.screen.glWidth / 2, ATR.screen.glWidth / 2, ATR.screen.glHeight / 2, - ATR.screen.glHeight / 2, 1, 10 );
    resetCamera();

    ATR.light = new THREE.DirectionalLight( 0xffffff, 1.0);
    ATR.light.position.set(0, 1, 1);
    ATR.scenes.perspective.scene.add( ATR.light );

    createText();

    ATR.scenes.ortho.Billboard.material = new THREE.ShaderMaterial( {
        uniforms: ATR.shader.uniforms,
        vertexShader: ATR.shader.vertexShaderText,
        fragmentShader: ATR.shader.fragmentShaderText,
        transparent: true,
        side: THREE.DoubleSide
    } );
    ATR.scenes.ortho.Billboard.geometry = new THREE.PlaneGeometry(ATR.screen.glWidth, ATR.screen.glHeight);
    ATR.scenes.ortho.Billboard.mesh = new THREE.Mesh(ATR.scenes.ortho.Billboard.geometry, ATR.scenes.ortho.Billboard.material);
    ATR.scenes.ortho.scene.add(ATR.scenes.ortho.Billboard.mesh);

    // init trackball controls
    ATR.trackballControls = new THREE.TrackballControls(ATR.scenes.perspective.camera);
    ATR.trackballControls.rotateSpeed = 0.5;
    ATR.trackballControls.rotateSpeed = 1.0;
    ATR.trackballControls.panSpeed = 0.5;
    ATR.trackballControls.noPan = false;
    ATR.trackballControls.noZoom = false;

    addEventHandlers();

    calcResize();
}

/**
 * select random text on start-up
 */
function selectRandomText() {
    var randomStartText = ATR.text.possibleContent[parseInt(Math.random() * ATR.text.possibleContent.length)]
    ATR.text.textParams.name = randomStartText;
    return randomStartText;
}

function createText() {
    ATR.objectText.geometry = new THREE.TextGeometry(ATR.text.textParams.name, ATR.text.textParams);
    ATR.objectText.geometry.computeBoundingBox();
    ATR.objectText.geometry.computeVertexNormals();

    ATR.objectText.material = new THREE.MeshFaceMaterial( [
        // front
        new THREE.MeshPhongMaterial( {
            color: 0xffffff,
            shading: THREE.FlatShading,
            transparent: true,
            opacity: ATR.datGui.paramFunctionRef.opacityText,
            side: THREE.DoubleSide
        } ),
        // side
        new THREE.MeshPhongMaterial({
            color: 0xffffff,
            shading: THREE.SmoothShading,
            transparent: true,
            opacity: ATR.datGui.paramFunctionRef.opacityText,
            side: THREE.DoubleSide
        } )
    ] );
    updateTextMaterials();

    ATR.objectText.mesh = new THREE.Mesh( ATR.objectText.geometry, ATR.objectText.material );
    ATR.objectText.mesh.position.x = -(ATR.objectText.geometry.boundingBox.max.x - ATR.objectText.geometry.boundingBox.min.x) / 2;
    ATR.objectText.mesh.position.y = -(ATR.objectText.geometry.boundingBox.max.y - ATR.objectText.geometry.boundingBox.min.y) / 2;
    ATR.objectText.mesh.position.z = -(ATR.objectText.geometry.boundingBox.max.z - ATR.objectText.geometry.boundingBox.min.z) / 2;
    ATR.scenes.perspective.scene.add(ATR.objectText.mesh);
}

function removeText() {
    ATR.scenes.perspective.scene.remove(ATR.objectText.mesh);
}

function initPostGL() {
    ATR.dom.canvasDiv.appendChild(ATR.renderer.domElement);
}

function addEventHandlers() {
    ATR.datGui.controllerTextContent.onChange(function(value) {
        ATR.text.update = true;

        if (ATR.datGui.paramFunctionRef.content.length < ATR.text.lengthLimit) {
            ATR.text.textParams.name = value;
            ATR.datGui.paramFunctionRef.content = ATR.text.textParams.name;
        }
        else {
            ATR.text.textParams.name = value.substring(0, ATR.text.lengthLimit);
            ATR.datGui.paramFunctionRef.content = ATR.text.textParams.name;
        }
    });
    ATR.datGui.controllerBlendText.onChange(function(value) {
        ATR.datGui.paramFunctionRef.opacityText = value;
        for (var i in ATR.objectText.material.materials) {
            var mat = ATR.objectText.material.materials[i];
            mat.opacity = value;
        }
    });
    ATR.datGui.controllerLevelR.onChange(function(value) {
        ATR.datGui.paramFunctionRef.red = value;
        updateTextMaterials();
    });
    ATR.datGui.controllerLevelG.onChange(function(value) {
        ATR.datGui.paramFunctionRef.green = value;
        updateTextMaterials();
    });
    ATR.datGui.controllerLevelB.onChange(function(value) {
        ATR.datGui.paramFunctionRef.blue = value;
        updateTextMaterials();
    });
    ATR.datGui.controllerBlendShader.onChange(function(value) {
        ATR.datGui.paramFunctionRef.opacityShader = value;
        ATR.shader.uniforms.blendFactor.value = value;
    });
    ATR.datGui.controllerColorShader.onChange(function(value) {
        ATR.datGui.paramFunctionRef.colorShader = value;
        updateTextMaterials();
    });

}

function updateTextMaterials() {
    var red = ATR.datGui.paramFunctionRef.red / 255;
    var green = ATR.datGui.paramFunctionRef.green / 255;
    var blue = ATR.datGui.paramFunctionRef.blue / 255;
    for (var i in ATR.objectText.material.materials) {
        var mat = ATR.objectText.material.materials[i];
        mat.color.setRGB(red, green, blue);
    }
    var rgb = ShaderTools.hexToRGB(ATR.datGui.paramFunctionRef.colorShader, true);
    ATR.shader.uniforms.colorFactor.value[0] = rgb[0];
    ATR.shader.uniforms.colorFactor.value[1] = rgb[1];
    ATR.shader.uniforms.colorFactor.value[2] = rgb[2];
}

function animateFrame() {
    requestAnimationFrame(animateFrame);
    ATR.trackballControls.update();
    render();
}

function render() {
    ATR.renderer.clear();
    ATR.renderer.render(ATR.scenes.perspective.scene, ATR.scenes.perspective.camera);
    ATR.frameNumber++;

    if (ATR.text.update && ATR.frameNumber % 30 === 0) {
        ATR.text.update = false;
        removeText();
        createText();
    }

    if (ATR.datGui.paramFunctionRef.enableShader) {
        if (ATR.datGui.paramFunctionRef.flickerShader) {
            var ranVal = Math.random();
            var range = 16 + parseInt(32 * ranVal);
            if (ATR.frameNumber % range === 0) {
                ATR.shader.uniforms.seed.value = ranVal;
            }
        }
        ATR.renderer.clearDepth();
        ATR.renderer.render(ATR.scenes.ortho.scene, ATR.scenes.ortho.camera);
    }
}

function resetTrackballControls() {
    console.log("resetTrackballControls");
    resetCamera();
    ATR.trackballControls.reset();
    render();
}

function resetCamera() {
    ATR.scenes.perspective.camera.position.set( 0, 0, 250 );
    ATR.scenes.perspective.cameraTarget = new THREE.Vector3( 0, 0, 0 );
    ATR.scenes.perspective.camera.lookAt( ATR.scenes.perspective.cameraTarget );
    ATR.scenes.perspective.camera.updateProjectionMatrix();
    if (ATR.datGui.paramFunctionRef.enableShader) {
        ATR.scenes.ortho.camera.position.set(0, 0, 10);
    }
}

function calcResizeHtml() {
    ATR.screen.glWidth  = window.innerWidth > ATR.screen.glMinWidth ? window.innerWidth : ATR.screen.glMinWidth;
    var heightTemp = window.innerWidth / ATR.screen.aspectRatio;
    ATR.screen.glHeight = heightTemp > ATR.screen.glMinHeight ? heightTemp : ATR.screen.glMinHeight;

    ATR.dom.canvasDiv.style.width = ATR.screen.glWidth - ATR.reductionWidth + "px";
    ATR.dom.canvasDiv.style.height = ATR.screen.glHeight  - ATR.reductionHeight + "px";

    ATR.dom.canvasAPPTRFloat.style.top = 0 + "px";
    ATR.dom.canvasAPPTRFloat.style.left = (window.innerWidth - parseInt(ATR.datGui.datGuiRef.domElement.style.width)) + "px";
}

function calcResize() {
    ATR.trackballControls.handleResize();
    calcResizeHtml();
    calcResizePerspectiveCamera();

    ATR.scenes.ortho.calcResizeBillboardFunc();

    ATR.renderer.setSize(ATR.screen.glWidth, ATR.screen.glHeight);
}

function calcResizePerspectiveCamera() {
    ATR.scenes.perspective.camera.aspect = (ATR.screen.glWidth / ATR.screen.glHeight);
    ATR.scenes.perspective.camera.updateProjectionMatrix();
}
