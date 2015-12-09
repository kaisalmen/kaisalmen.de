/**
 * Created by Kai Salmen
 */

var ATR = {};

APPG.shaders.shaderFlicker = {
    vertexShaderText : null,
    fragmentShaderText : null,
    uniforms : {
        blendFactor : { type: "f", value: 0.15 },
        ilFactor : { type: "f", value: APPG.screen.glHeight / 2.0 },
        seed : { type: "f", value: Math.random() },
        colorFactor : { type: "fv1", value: [0.0, 1.0, 0.0] },
        texture1: { type: "t", value: null }
    },
    updateTextureRef : null
};
APPG.shaders.functions = {
    loadShader : function() {
        console.log("Shader and texture loading from file is completed!");
        APPG.shaders.shaderTools.printShader(APPG.shaders.shaderFlicker.vertexShaderText, "Vertex Shader");
        APPG.shaders.shaderTools.printShader(APPG.shaders.shaderFlicker.fragmentShaderText, "Fragment Shader");

        //APPG.shaders.shaderFlicker.fragmentShaderText = base[0] + "\n" + frag[0];

        APPG.shaders.shaderFlicker.uniforms.texture1.value = THREE.ImageUtils.loadTexture("../../resource/images/noise.jpg", THREE.UVMapping);
        APPG.shaders.shaderFlicker.uniforms.texture1.value.wrapS = THREE.RepeatWrapping;
        APPG.shaders.shaderFlicker.uniforms.texture1.value.wrapT = THREE.RepeatWrapping;
        APPG.shaders.shaderFlicker.uniforms.texture1.value.repeat.set(2, 2);
        console.log("Textures were updated successfully!");
    },
    updateShader : function() {
        APPG.shaders.shaderFlicker.uniforms.ilFactor.value = APPG.screen.glHeight / 2.0;
    }
};
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
};
ATR.objectText = {
    mesh : null,
    geometry : null,
    material2d : null,
    material2dParams : null,
    material3d : null,
    material3dParams : null
};
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
    font : "ubuntu mono",
    weight : "normal",
    style : "normal",
    material : 0,
    extrudeMaterial : 1
};
ATR.text.possibleContent = ["Change me!", "Adjust me!", "Modify me!", "Play with me!", "Reload me!"];
ATR.text.update = true;
ATR.text.lengthLimit = 50;

$(document).ready(
    $.when(
        APPG.shaders.shaderTools.loadShader("../resource/shader/passThrough.glsl"),
        APPG.shaders.shaderTools.loadShader("../resource/shader/overlayEffectTextureEffect.glsl")
    ).done(
        function(vert, frag) {
            APPG.shaders.shaderFlicker.vertexShaderText = vert[0];
            APPG.shaders.shaderFlicker.fragmentShaderText = frag[0];

            APPExecFlow.functions.init();
        }
    )
)
.on({
    mouseenter: function() {
        APPG.controls.trackball.enabled = false;
        APPG.controls.trackball.noPan = true;
    },
    mouseleave: function() {
        APPG.controls.trackball.enabled = true;
        APPG.controls.trackball.noPan = false;
    }
}, "#AppFloat")
.on({
    mouseenter: function() {
        APPG.controls.trackball.enabled = true;
        APPG.controls.trackball.noPan = false;
    },
    mouseleave: function() {
        APPG.controls.trackball.enabled = false;
        APPG.controls.trackball.noPan = true;
    }
}, "#AppWebGL");

$(window).resize(function() {
    resizeDisplayGL();
});


/**
 * Life-cycle functions
 */
function initShaders() {
    APPG.shaders.functions.loadShader();
}

function initPreGL() {
    APPG.dom.canvasGL = document.getElementById("AppWebGL");

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

    APPG.dom.canvasAppFloat = document.getElementById("AppFloat");
    APPG.dom.canvasAppFloat.appendChild(ATR.datGui.datGuiRef.domElement);
}

function resizeDisplayHtml() {
    APPG.functions.resizeDisplayHtmlDefault(2);

    APPG.dom.canvasAppFloat.style.top = 0 + "px";
    APPG.dom.canvasAppFloat.style.left = (window.innerWidth - parseInt(ATR.datGui.datGuiRef.domElement.style.width)) + "px";
}

function initGL() {
    APPG.renderer.functions.createDefault();

    APPG.scenes.perspective.functions.createDefault();
    APPG.scenes.perspective.camera.fov = 70;
    APPG.scenes.ortho.functions.createDefault(-10, 10);
    resetCamera();

    APPG.scenes.lights.functions.createDefault();

    initText();

    var material = new THREE.ShaderMaterial( {
        uniforms : APPG.shaders.shaderFlicker.uniforms,
        vertexShader : APPG.shaders.shaderFlicker.vertexShaderText,
        fragmentShader : APPG.shaders.shaderFlicker.fragmentShaderText,
        transparent : true,
        side : THREE.DoubleSide
    } );
    var geometry = new THREE.PlaneGeometry(APPG.screen.glWidth, APPG.screen.glHeight);
    var mesh = new THREE.Mesh(geometry, material);
    APPG.scenes.ortho.Billboard.functions.addShaderMesh(mesh);

    // init trackball controls
    APPG.controls.functions.createDefault(APPG.scenes.perspective.camera);
}

function initText() {
    ATR.objectText.material2d = new THREE.MeshFaceMaterial( [
        new THREE.MeshPhongMaterial( {
            emissive: 0x00ff00,
            transparent : true,
            opacity : 1.0,
            shading: THREE.FlatShading,
            side : THREE.DoubleSide
        } )
    ] );
    ATR.objectText.material3d = new THREE.MeshFaceMaterial( [
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
    APPG.textBuffer.functions.addTextNode2d("textFrameNode", "None");

    ATR.objectText.material2dParams = {
        name: "blah",
        height : 20,
        size: 18,
        amount: 0,
        hover : 30,
        curveSegments: 2,
        bevelEnabled: true,
        bevelSegments : 2,
        bevelThickness : 2,
        bevelSize : 1.0,
        font: "ubuntu mono",
        weight: "normal",
        style: "normal",
        material: 0,
        extrudeMaterial: 1
    };
    ATR.objectText.material3dParams = {
        name : "Magnificent void!",
        height : 20,
        size : 18,
        hover : 30,
        curveSegments : 2,
        bevelEnabled : true,
        bevelSegments : 2,
        bevelThickness : 2,
        bevelSize : 1.0,
        font : "ubuntu mono",
        weight : "normal",
        style : "normal",
        material : 0,
        extrudeMaterial : 1
    };
    APPG.textBuffer.functions.addTextNode3d("textNode3d", "Magnificent void");

    ATR.objectText.geometry = new THREE.TextGeometry(ATR.text.textParams.name, ATR.text.textParams);
    ATR.objectText.geometry.computeBoundingBox();
    ATR.objectText.geometry.computeVertexNormals();

//    var matText3d = updateTextMaterials();
//    ATR.objectText.mesh = new THREE.Mesh( ATR.objectText.geometry, matText3d.materials );
//    ATR.objectText.mesh.position.x = -(ATR.objectText.geometry.boundingBox.max.x - ATR.objectText.geometry.boundingBox.min.x) / 2;
//    ATR.objectText.mesh.position.y = -(ATR.objectText.geometry.boundingBox.max.y - ATR.objectText.geometry.boundingBox.min.y) / 2;
//    ATR.objectText.mesh.position.z = -(ATR.objectText.geometry.boundingBox.max.z - ATR.objectText.geometry.boundingBox.min.z) / 2;
//    APPG.scenes.perspective.scene.add(ATR.objectText.mesh);

    APPG.textBuffer.functions.completeInit(ATR.objectText.material2d, ATR.objectText.material2dParams,
                                           ATR.objectText.material3d, ATR.objectText.material3dParams);
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
        for (var i in ATR.objectText.material3d) {
            var mat = ATR.objectText.material3d[i];
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
        APPG.shaders.shaderFlicker.uniforms.blendFactor.value = value;
    });
    ATR.datGui.controllerColorShader.onChange(function(value) {
        ATR.datGui.paramFunctionRef.colorShader = value;
        updateTextMaterials();
    });
}

function resizeDisplayGL() {
    APPG.controls.trackball.handleResize();
    resizeDisplayHtml();
    APPG.scenes.perspective.functions.resizePerspectiveCameraDefault();

    if (ATR.datGui.paramFunctionRef.enableShader) {
        APPG.scenes.ortho.Billboard.functions.resizeBillboard();
        APPG.shaders.functions.updateShader();
    }

    APPG.renderer.setSize(APPG.screen.glWidth, APPG.screen.glHeight);
}

function initPostGL() {
    APPG.renderer.domElement.id = "AppWebGLCanvas";
    APPG.dom.canvasGL.appendChild(APPG.renderer.domElement);
}

function animateFrame() {
    render();
    requestAnimationFrame(animateFrame, $("AppWebGLCanvas"));
}

function render() {
    APPG.controls.trackball.update();
    APPG.renderer.clear();
    APPG.renderer.render(APPG.scenes.perspective.scene, APPG.scenes.perspective.camera);
    APPG.functions.addFrameNumber();

    if (ATR.text.update && APPG.frameNumber % 30 === 0) {
        ATR.text.update = false;
        removeText();
        createText();
    }

    if (ATR.datGui.paramFunctionRef.enableShader) {
        if (ATR.datGui.paramFunctionRef.flickerShader) {
            var ranVal = Math.random();
            var range = 16 + parseInt(32 * ranVal);
            if (APPG.frameNumber % range === 0) {
                APPG.shaders.shaderFlicker.uniforms.seed.value = ranVal;
            }
        }

        updateText2d();

        APPG.renderer.clearDepth();
        APPG.renderer.render(APPG.scenes.ortho.scene, APPG.scenes.ortho.camera);
    }
}

function updateText2d() {
    var text = "Frame: " + APPG.frameNumber + " FPS:" + APPG.fps.toFixed(1);
    APPG.textBuffer.functions.updateTextNode2d("textFrameNode", text);
    APPG.textBuffer.functions.verifyTextGeometries();

    var spacing = 18;
    var scale = new THREE.Vector3(0.75, 0.75, 0.75);
    var textPosX = -(text.length * scale.x * spacing) - 24 + APPG.screen.glWidth / 2;
    var textPosY = 24 - APPG.screen.glHeight / 2;
    APPG.textBuffer.functions.processTextNode(true, "textFrameNode", textPosX, textPosY, spacing, scale);
}

/**
 * Extra functions (helper, init, etc.)
 */

/**
 * select random text on start-up
 */
function selectRandomText() {
    var randomStartText = ATR.text.possibleContent[parseInt(Math.random() * ATR.text.possibleContent.length)];
    ATR.text.textParams.name = randomStartText;
    return randomStartText;
}

function removeText() {
    APPG.scenes.perspective.scene.remove(ATR.objectText.mesh);
}

function updateTextMaterials() {
    var red = ATR.datGui.paramFunctionRef.red / 255;
    var green = ATR.datGui.paramFunctionRef.green / 255;
    var blue = ATR.datGui.paramFunctionRef.blue / 255;

    APPG.textBuffer.material3d.materials.forEach(function (mat) {
        mat.color.setRGB(red, green, blue);
    });
    var rgb = APPG.shaders.shaderTools.hexToRGB(ATR.datGui.paramFunctionRef.colorShader, true);
    APPG.shaders.shaderFlicker.uniforms.colorFactor.value[0] = rgb[0];
    APPG.shaders.shaderFlicker.uniforms.colorFactor.value[1] = rgb[1];
    APPG.shaders.shaderFlicker.uniforms.colorFactor.value[2] = rgb[2];

    return matText3d;
}

function resetTrackballControls() {
    console.log("resetTrackballControls");
    resetCamera();
    APPG.controls.trackball.reset();
    render();
}

function resetCamera() {
    APPG.scenes.perspective.functions.resetCameraDefault();
    if (ATR.datGui.paramFunctionRef.enableShader) {
        APPG.scenes.ortho.camera.position.set(0, 0, 10);
    }
}
