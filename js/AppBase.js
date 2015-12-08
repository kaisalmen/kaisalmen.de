/**
 * Created by Kai Salmen on 2014.07.12.
 *
 * Updates
 * 2014.08.10:
 * Added three basic loading functions to AppBase
 */

var APPExecFlow = {};

APPExecFlow =  {
    initShaders : null,
    initPreGL : null,
    resizeDisplayHtml : null,
    initGL : null,
    addEventHandlers : null,
    resizeDisplayGL : null,
    initPostGL : null,
    startAnimation : null
};
APPExecFlow.functions =  {
    run : function() {
        console.log("Starting global initialisation phase...");
        console.log("Kicking initShaders...");
        APPExecFlow.initShaders = initShaders();

        console.log("Kicking initPreGL...");
        APPExecFlow.initPreGL = initPreGL();

        console.log("Kicking resizeDisplayHtml...");
        APPExecFlow.resizeDisplayHtml = resizeDisplayHtml();

        console.log("Kicking initGL...");
        APPExecFlow.initGL = initGL();

        console.log("Kicking addEventHandlers...");
        APPExecFlow.addEventHandlers = addEventHandlers();

        console.log("Kicking resizeDisplayGL...");
        APPExecFlow.resizeDisplayGL = resizeDisplayGL();

        console.log("Kicking initPostGL...");
        APPExecFlow.initPostGL = initPostGL();

        console.log("Kicking animateFrame...");
        APPExecFlow.startAnimation = animateFrame();
    }
};

var APPG = {
    screen : null,
    dom : null,
    functions : null,
    shaders : {
        shaderTools : new ShaderTools(),
        functions : {
            loadShader: function () {
                console.log("Currently no shaders are used.");
            },
            updateShader: function () {
                console.log("Currently no shaders are used.");
            }
        }
    },
    renderer : null,
    scenes : null,
    controls : null,
    textBuffer : null
};
APPG.textBuffer = {
    params : null,
    functions : null,
    textBaseNode2d : null,
    textBaseNode3d : null,
    material2d : null,
    material2dParams : null,
    material3d : null,
    material3dParams : null
};
APPG.textBuffer.characterCache2d = new Map();
APPG.textBuffer.characterCache3d = new Map();
APPG.textBuffer.characterCountsRender2d = new Array(256);
APPG.textBuffer.characterCountsRender3d = new Array(256);
APPG.textBuffer.textNodes2d = new Map();
APPG.textBuffer.textContents2d = new Map();
APPG.textBuffer.textNodes3d = new Map();
APPG.textBuffer.textContents3d = new Map();
APPG.textBuffer.functions = {
    addTextNode2d : function (name, textContent) {
        console.log("Adding node with the following name to textBuffer (2d): " + name);
        APPG.textBuffer.textNodes2d.set(name, new THREE.Object3D());
        APPG.textBuffer.textContents2d.set(name, textContent);
    },
    addTextNode3d : function (name, textContent) {
        console.log("Adding node with the following name to textBuffer (3d): " + name);
        APPG.textBuffer.textNodes3d.set(name, new THREE.Object3D());
        APPG.textBuffer.textContents3d.set(name, textContent);
    },
    updateTextNode2d : function (name, textContent) {
        APPG.textBuffer.textContents2d.set(name, textContent);
    },
    updateTextNode3d : function (name, textContent) {
        APPG.textBuffer.textContents3d.set(name, textContent);
    },
    removeNode2d : function (name) {
        APPG.textBuffer.textNodes2d.delete(name);
        APPG.textBuffer.textContents2d.delete(name);
    },
    removeNode3d : function (name) {
        APPG.textBuffer.textNodes3d.delete(name);
        APPG.textBuffer.textContents3d.delete(name);
    },
    completeInit : function(material2d, material2dParams, material3d, material3dParams) {
        APPG.textBuffer.material2d = material2d;
        APPG.textBuffer.material2dParams = material2dParams;
        APPG.textBuffer.material3d = material3d;
        APPG.textBuffer.material3dParams = material3dParams;
        if (APPG.textBuffer.material2dParams == null || APPG.textBuffer.material2dParams.length == 0) {
            APPG.textBuffer.material2dParams = {
                font : "ubuntu mono",
                weight : "normal",
                style : "normal",
            }
        }
        if (APPG.textBuffer.material3dParams == null || APPG.textBuffer.material3dParams.length == 0) {
            APPG.textBuffer.material3dParams = {
                font : "ubuntu mono",
                weight : "normal",
                style : "normal",
            }
        }

        var character = "";
        var textGeometry2d = null;
        var textGeometry3d = null;
        var characterMesh2d = null;
        var characterMeshes2d = null;
        var characterMesh3d = null;
        var characterMeshes3d = null;

        if (APPG.textBuffer.material2d !== null && APPG.textBuffer.material2dParams !== null) {
            for (var i = 0; i < 256; i++) {
                character = String.fromCharCode(i);
                textGeometry2d = new THREE.TextGeometry(character, APPG.textBuffer.material2dParams);
                textGeometry2d.computeBoundingBox();
                textGeometry2d.computeVertexNormals();
                characterMesh2d = new THREE.Mesh(textGeometry2d, APPG.textBuffer.material2d);
                characterMeshes2d = new Set();
                characterMeshes2d.add(characterMesh2d);
                APPG.textBuffer.characterCache2d.set(character, characterMeshes2d);
            }
        }

        if (APPG.textBuffer.material3d !== null && APPG.textBuffer.material3dParams !== null) {
            for (var i = 0; i < 256; i++) {
                character = String.fromCharCode(i);
                textGeometry3d = new THREE.TextGeometry(character, APPG.textBuffer.material3dParams);
                textGeometry3d.computeBoundingBox();
                textGeometry3d.computeVertexNormals();
                characterMesh3d = new THREE.Mesh(textGeometry3d, APPG.textBuffer.material3d);
                characterMeshes3d = new Set();
                characterMeshes3d.add(characterMesh3d);
                APPG.textBuffer.characterCache3d.set(character, characterMeshes3d);
            }
        }

        APPG.textBuffer.textBaseNode2d = new THREE.Object3D();
        APPG.textBuffer.textBaseNode3d = new THREE.Object3D();
        APPG.textBuffer.functions.updateBaseNode();
        APPG.scenes.ortho.Billboard.functions.addMesh(APPG.textBuffer.textBaseNode2d);
        APPG.scenes.perspective.scene.add(APPG.textBuffer.textBaseNode3d);
    },
    updateBaseNode : function() {
        APPG.textBuffer.textBaseNode2d.children = [];
        APPG.textBuffer.textBaseNode3d.children = [];
        var allValues2d = APPG.textBuffer.textNodes2d.values();
        for (var i = 0; i < allValues2d.length; i++) {
            APPG.textBuffer.textBaseNode2d.add(allValues2d[i]);
        }
        var allValues3d = APPG.textBuffer.textNodes3d.values();
        for (var i = 0; i < allValues3d.length; i++) {
            APPG.textBuffer.textBaseNode3d.add(allValues3d[i]);
        }
    },
    verifyTextGeometries : function() {
        var characterCountsRef2d = new Array(APPG.textBuffer.characterCountsRender2d.length);
        for (var i = 0; i < characterCountsRef2d.length; i++) {
            characterCountsRef2d[i] = 0;
            APPG.textBuffer.characterCountsRender2d[i] = 0;
        }
        var characterCountsRef3d = new Array(APPG.textBuffer.characterCountsRender3d.length);
        for (var i = 0; i < characterCountsRef3d.length; i++) {
            characterCountsRef3d[i] = 0;
            APPG.textBuffer.characterCountsRender3d[i] = 0;
        }

        var character = "";
        var characterMeshes = null;
        var characterCount = 0;

        var countsPos = 0;
        var meshClone = null;

        var text2d = "";
        var texts2d = APPG.textBuffer.textContents2d.values();
        for (var i = 0; i < texts2d.length; i++) {
            text2d = texts2d[i];

            for (var j = 0; j < text2d.length; j++) {
                character = text2d[j];
                characterMeshes = APPG.textBuffer.characterCache2d.get(character);
                countsPos = text2d.charCodeAt(j);

                characterCount = characterCountsRef2d[countsPos];
                if (characterCount > 0 && characterMeshes.length === characterCount) {
                    meshClone = characterMeshes.toArray()[0].clone();
                    characterMeshes.add(meshClone);
                    APPG.textBuffer.characterCache2d.set(character, characterMeshes);
                }
                characterCountsRef2d[countsPos] = characterCount + 1;
            }
        }

        var text3d = "";
        var texts3d = APPG.textBuffer.textContents3d.values();
        for (var i = 0; i < texts3d.length; i++) {
            text3d = texts3d[i];

            for (var j = 0; j < text3d.length; j++) {
                character = text3d[j];
                characterMeshes = APPG.textBuffer.characterCache3d.get(character);
                countsPos = text3d.charCodeAt(j);

                characterCount = characterCountsRef3d[countsPos];
                if (characterCount > 0 && characterMeshes.length === characterCount) {
                    meshClone = characterMeshes.toArray()[0].clone();
                    characterMeshes.add(meshClone);
                    APPG.textBuffer.characterCache3d.set(character, characterMeshes);
                }
                characterCountsRef3d[countsPos] = characterCount + 1;
            }
        }
    },
    processTextNode : function (use2d, textNodeName, baseX, baseY, defaultSpacing, scaleVector) {
        var textNode = null;
        var text = null;
        var characterCache = null;
        if (use2d) {
            textNode = APPG.textBuffer.textNodes2d.get(textNodeName);
            text = APPG.textBuffer.textContents2d.get(textNodeName);
            characterCache = APPG.textBuffer.characterCache2d;
        }
        else {
            textNode = APPG.textBuffer.textNodes3d.get(textNodeName);
            text = APPG.textBuffer.textContents3d.get(textNodeName);
            characterCache = APPG.textBuffer.characterCache3d;
        }

        textNode.children = [];
        var posX = 0;
        var posY = 0;

        var character = "";
        var characterMeshes = null;
        var characterCount = 0;

        var mesh = null;
        var countsPos = 0;

        for (var i = 0; i < text.length; i++) {
            character = text[i];
            countsPos = text.charCodeAt(i);

            characterMeshes = characterCache.get(character);
            characterCount = use2d ? APPG.textBuffer.characterCountsRender2d[countsPos] : APPG.textBuffer.characterCountsRender3d[countsPos];
            mesh = characterMeshes.toArray()[characterCount];
            if (mesh !== null && mesh !== undefined) {
                if (use2d) {
                    APPG.textBuffer.characterCountsRender2d[countsPos] = characterCount + 1;
                }
                else {
                    APPG.textBuffer.characterCountsRender3d[countsPos] = characterCount + 1;
                }

                mesh.position.set(posX, posY, 0);
                posX += defaultSpacing;

                textNode.add(mesh);
            }
        }
        if (scaleVector !== null && scaleVector !== undefined) {
            textNode.scale.set(scaleVector.x, scaleVector.y, scaleVector.z);
        }
        textNode.position.set(baseX, baseY, 0);
        use2d ? APPG.textBuffer.textBaseNode2d.add(textNode) : APPG.textBuffer.textBaseNode3d.add(textNode);
    }
};

APPG.screen = {
    aspectRatio : 2.35,
    glWidth : 1280.0,
    glHeight : 1280.0 / 2.35,
    glMinWidth : 800,
    glMinHeight : 800 / 2.35
};
APPG.frameNumber = 0;
APPG.fpsFrameRef = 0;
APPG.fpsCheckTime = new Date().getTime();
APPG.fps = 0;
APPG.dom = {
    widthScrollBar : 2,
    canvasGL : null,
    canvasAppFloat : null,
    reductionHeight : null,
    reductionWidth : null
};
APPG.functions = {
    resizeDisplayHtmlDefault: function(widthScrollBar) {
        APPG.dom.widthScrollBar = widthScrollBar;
        APPG.dom.reductionHeight = APPG.dom.widthScrollBar + APPG.dom.widthScrollBar;
        APPG.dom.reductionWidth = APPG.dom.widthScrollBar;
        APPG.screen.glWidth = window.innerWidth > APPG.screen.glMinWidth ? window.innerWidth : APPG.screen.glMinWidth;
        var heightTemp = window.innerWidth / APPG.screen.aspectRatio;
        APPG.screen.glHeight = heightTemp > APPG.screen.glMinHeight ? heightTemp : APPG.screen.glMinHeight;

        APPG.dom.canvasGL.style.width = APPG.screen.glWidth - APPG.dom.reductionWidth + "px";
        APPG.dom.canvasGL.style.height = APPG.screen.glHeight - APPG.dom.reductionHeight + "px";
    },
    addFrameNumber : function() {
        APPG.frameNumber++;
        var now = new Date().getTime();
        if (now > (APPG.fpsCheckTime + 1000)) {
            APPG.fps = 1000 * (APPG.frameNumber - APPG.fpsFrameRef) / (now - APPG.fpsCheckTime);
            APPG.fpsCheckTime = now;
            APPG.fpsFrameRef = APPG.frameNumber;
        }
    }
};

APPG.shaders.functions = {

};
APPG.renderer = {
    domElement : null
};
APPG.renderer.functions = {
    createDefault: function (antialiasValue) {
        if (antialiasValue === undefined || antialiasValue === null) {
            antialiasValue = true;
        }
        APPG.renderer = new THREE.WebGLRenderer( {antialias : antialiasValue});
        APPG.renderer.setClearColor(new THREE.Color(0.02, 0.02, 0.02), 255);
        APPG.renderer.setSize(APPG.screen.glWidth, APPG.screen.glHeight);
        APPG.renderer.autoClear = false;
    }
};
APPG.scenes = {
    perspective : null,
    lights : null,
    geometry : null
};
APPG.scenes.perspective = {
    camera : null,
    cameraTarget : null,
    scene : null
};
APPG.scenes.perspective.functions = {
    createDefault: function () {
        APPG.scenes.perspective.scene = new THREE.Scene();
        APPG.scenes.perspective.camera = new THREE.PerspectiveCamera(45, (APPG.screen.glWidth) / (APPG.screen.glHeight), 0.1, 10000);
    },
    resetCameraDefault: function () {
        APPG.scenes.perspective.camera.position.set(0, 0, 250);
        APPG.scenes.perspective.cameraTarget = new THREE.Vector3(0, 0, 0);
        APPG.scenes.perspective.camera.lookAt(APPG.scenes.perspective.cameraTarget);
        APPG.scenes.perspective.camera.updateProjectionMatrix();
    },
    resizePerspectiveCameraDefault: function () {
        APPG.scenes.perspective.camera.aspect = (APPG.screen.glWidth / APPG.screen.glHeight);
        APPG.scenes.perspective.camera.updateProjectionMatrix();
    }
};
APPG.scenes.ortho = {
    camera : null,
    scene : null,
    pixelLeft : null,
    pixelRight : null,
    pixelTop : null,
    pixelBottom : null,
    Billboard : null
};
APPG.scenes.ortho.functions = {
    createDefault : function(near, far) {
        APPG.scenes.ortho.scene = new THREE.Scene();
        APPG.scenes.ortho.camera = new THREE.OrthographicCamera( - APPG.screen.glWidth / 2, APPG.screen.glWidth / 2, APPG.screen.glHeight / 2, - APPG.screen.glHeight / 2, near, far);
    },
    resizeOrthoCameraDefault : function() {
        // calc screen dimension
        APPG.scenes.ortho.pixelLeft = -APPG.screen.glWidth / 2;
        APPG.scenes.ortho.pixelRight = APPG.screen.glWidth / 2;
        APPG.scenes.ortho.pixelTop = APPG.screen.glHeight / 2;
        APPG.scenes.ortho.pixelBottom = -APPG.screen.glHeight / 2;

        // update camera
        APPG.scenes.ortho.camera.left = APPG.scenes.ortho.pixelLeft;
        APPG.scenes.ortho.camera.right = APPG.scenes.ortho.pixelRight;
        APPG.scenes.ortho.camera.top = APPG.scenes.ortho.pixelTop;
        APPG.scenes.ortho.camera.bottom = APPG.scenes.ortho.pixelBottom;
        APPG.scenes.ortho.camera.updateProjectionMatrix();
    }
};
APPG.scenes.ortho.Billboard = {
    shaderMesh : null
};
APPG.scenes.ortho.Billboard.functions = {
    addShaderMesh : function (shaderMesh) {
        APPG.scenes.ortho.Billboard.shaderMesh = shaderMesh;
        APPG.scenes.ortho.scene.add(shaderMesh);
    },
    addMesh : function (mesh) {
        APPG.scenes.ortho.scene.add(mesh);
    },
    removeMesh : function (mesh) {
        APPG.scenes.ortho.scene.remove(mesh);
    },
    resizeBillboard : function () {
        APPG.scenes.ortho.functions.resizeOrthoCameraDefault();

        // update billboard geometries dimensions
        if (APPG.scenes.ortho.Billboard.shaderMesh.geometry !== null) {
            APPG.scenes.ortho.Billboard.shaderMesh.geometry.vertices[0].x = APPG.scenes.ortho.pixelLeft;
            APPG.scenes.ortho.Billboard.shaderMesh.geometry.vertices[0].y = APPG.scenes.ortho.pixelTop;
            APPG.scenes.ortho.Billboard.shaderMesh.geometry.vertices[1].x = APPG.scenes.ortho.pixelRight;
            APPG.scenes.ortho.Billboard.shaderMesh.geometry.vertices[1].y = APPG.scenes.ortho.pixelTop;
            APPG.scenes.ortho.Billboard.shaderMesh.geometry.vertices[2].x = APPG.scenes.ortho.pixelLeft;
            APPG.scenes.ortho.Billboard.shaderMesh.geometry.vertices[2].y = APPG.scenes.ortho.pixelBottom;
            APPG.scenes.ortho.Billboard.shaderMesh.geometry.vertices[3].x = APPG.scenes.ortho.pixelRight;
            APPG.scenes.ortho.Billboard.shaderMesh.geometry.vertices[3].y = APPG.scenes.ortho.pixelBottom;

            APPG.scenes.ortho.Billboard.shaderMesh.geometry.verticesNeedUpdate = true;
        }
    }
};
APPG.scenes.lights =  {
    light1 : null,
    light2 : null,
    light3 : null,
    light4 : null,
    light5 : null,
    light6 : null,
    light7 : null,
    light8 : null
};
APPG.scenes.lights.functions = {
    createDefault: function () {
        APPG.scenes.lights.light1 = new THREE.DirectionalLight(0xffffff, 1.0);
        APPG.scenes.lights.light1.position.set(100, 100, 100);
        APPG.scenes.perspective.scene.add(APPG.scenes.lights.light1);

        APPG.scenes.lights.light2 = new THREE.DirectionalLight(0xeeeeff, 1.0);
        APPG.scenes.lights.light2.position.set(-100, 0, -100);
        APPG.scenes.perspective.scene.add(APPG.scenes.lights.light2);
    }
};
APPG.scenes.geometry = {
    functions : null
};
APPG.scenes.geometry.functions = {
    createGrid : function(size, steps, gridYOffset, colorValueHex) {
        // Grid (from three.js example)
        var geometry = new THREE.Geometry();
        var material = new THREE.LineBasicMaterial({ color: colorValueHex });

        for ( var i = - size; i <= size; i += steps ) {
            geometry.vertices.push(new THREE.Vector3(-size, -gridYOffset, i));
            geometry.vertices.push(new THREE.Vector3( size, -gridYOffset, i));

            geometry.vertices.push(new THREE.Vector3(i, -gridYOffset, -size));
            geometry.vertices.push(new THREE.Vector3(i, -gridYOffset,  size));
        }
        return new THREE.Line( geometry, material, THREE.LinePieces );
    }
};
APPG.controls = {
    trackball : null
};
APPG.controls.functions = {
    createDefault: function(camera) {
        APPG.controls.trackball = new THREE.TrackballControls(camera);
        APPG.controls.trackball.rotateSpeed = 0.5;
        APPG.controls.trackball.rotateSpeed = 1.0;
        APPG.controls.trackball.panSpeed = 0.5;
        APPG.controls.trackball.noPan = false;
        APPG.controls.trackball.noZoom = false;
    }
};