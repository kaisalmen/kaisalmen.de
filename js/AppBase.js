/**
 * Created by Kai Salmen on 2014.07.12.
 *
 * Updates
 * 2014.08.10:
 * Added three basic loading functions to AppBase
 */
var APPExecFlow = {}

APPExecFlow =  {
    initShaders : null,
    initPreGL : null,
    resizeDisplayHtml : null,
    initGL : null,
    addEventHandlers : null,
    resizeDisplayGL : null,
    initPostGL : null,
    startAnimation : null
}
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
}

var APPG = {
    screen : null,
    dom : null,
    functions : null,
    shaders : null,
    renderer : null,
    scenes : null,
    controls : null,
    textBuffer : null
}
APPG.textBuffer = {
    params : null,
    objects : null,
    functions : null,
    material : null
}
APPG.textBuffer.params = {
    name : "blah",
    size: 40,
    amount: 0,
    curveSegments: 3,
    bevelEnabled: false,
    font: "optimer",
    weight: "normal",
    style: "normal",
    material: 0,
    extrudeMaterial: 0
}
APPG.textBuffer.objects = new Array(256),
APPG.textBuffer.functions = {
    createSingle : function(text) {
        var textGeometry = new THREE.TextGeometry(text, APPG.textBuffer.params);
        textGeometry.computeBoundingBox();
        textGeometry.computeVertexNormals();

        return new THREE.Mesh(textGeometry, APPG.textBuffer.material);
    },
    createAll : function() {
        APPG.textBuffer.material = new THREE.MeshFaceMaterial( [
            new THREE.MeshPhongMaterial( {
                emissive: 0xff0000,
                transparent : true,
                opacity : 1.0,
                shading: THREE.FlatShading,
                side : THREE.DoubleSide
            } )
        ] );
        for (var i = 0; i < APPG.textBuffer.objects.length; i++) {
            var character = String.fromCharCode(i);
            APPG.textBuffer.objects[i] = APPG.textBuffer.functions.createSingle(character);
        }
    },
    renderText : function (providedText, spacing) {
        var group = new THREE.Object3D();
        var posx = 0;
        for (var i = 0; i < providedText.length; i++) {
            var mesh = APPG.textBuffer.objects[providedText.charCodeAt(i)];
            var meshClone = mesh.clone();
            meshClone.position.set(posx, 0, 0);
            meshClone.geometry.computeBoundingBox();
            var sFac = 0;
            if (meshClone.geometry.boundingBox.max.x !== Infinity && meshClone.geometry.boundingBox.min.x !== Infinity) {
                sFac = meshClone.geometry.boundingBox.max.x - meshClone.geometry.boundingBox.min.x;
            }
            else {
                sFac = 10;
            }
            console.log(sFac);
            posx += sFac + spacing;
            group.add(meshClone);
        }
        return group;
    }

}

APPG.screen = {
    aspectRatio : 2.35,
    glWidth : 1280.0,
    glHeight : 1280.0 / 2.35,
    glMinWidth : 800,
    glMinHeight : 800 / 2.35
}
APPG.frameNumber = 0;
APPG.dom = {
    widthScrollBar : 2,
    canvasGL : null,
    canvasAppFloat : null,
    reductionHeight : null,
    reductionWidth : null
}
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
    }
}

APPG.shaders = {};
APPG.shaders.functions = {
    loadShader : function() {
        console.log("Currently no shaders are used.");
    },
    updateShader : function() {
        console.log("Currently no shaders are used.");
    }
}
APPG.renderer = {
    domElement : null
}
APPG.renderer.functions = {
    createDefault: function () {
        APPG.renderer = new THREE.WebGLRenderer();
        APPG.renderer.setClearColor(new THREE.Color(0.02, 0.02, 0.02), 255);
        APPG.renderer.setSize(APPG.screen.glWidth, APPG.screen.glHeight);
        APPG.renderer.autoClear = false;
    }
}
APPG.scenes = {
    perspective : null,
    lights : null,
    geometry : null
};
APPG.scenes.perspective = {
    camera : null,
    cameraTarget : null,
    scene : null
}
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
}
APPG.scenes.ortho = {
    camera : null,
    scene : null,
    pixelLeft : null,
    pixelRight : null,
    pixelTop : null,
    pixelBottom : null,
    Billboard : null
}
APPG.scenes.ortho.functions = {
    createDefault : function(near, far) {
        APPG.scenes.ortho.scene = new THREE.Scene();
        APPG.scenes.ortho.camera = new THREE.OrthographicCamera( - APPG.screen.glWidth / 2, APPG.screen.glWidth / 2, APPG.screen.glHeight / 2, - APPG.screen.glHeight / 2, near, far);
    }
}
APPG.scenes.ortho.Billboard = {
    shaderMesh : null
}
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
}
APPG.scenes.lights =  {
    light1 : null,
    light2 : null,
    light3 : null,
    light4 : null,
    light5 : null,
    light6 : null,
    light7 : null,
    light8 : null
}
APPG.scenes.lights.functions = {
    createDefault: function () {
        APPG.scenes.lights.light1 = new THREE.DirectionalLight(0xffffff, 1.0);
        APPG.scenes.lights.light1.position.set(100, 100, 100);
        APPG.scenes.perspective.scene.add(APPG.scenes.lights.light1);

        APPG.scenes.lights.light2 = new THREE.DirectionalLight(0xeeeeff, 1.0);
        APPG.scenes.lights.light2.position.set(-100, 0, -100);
        APPG.scenes.perspective.scene.add(APPG.scenes.lights.light2);
    }
}
APPG.scenes.geometry = {
    functions : null
}
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
        var line = new THREE.Line( geometry, material, THREE.LinePieces );
        return line;
    }
}
APPG.controls = {
    trackball : null
}
APPG.controls.functions = {
    createDefault: function(camera) {
        APPG.controls.trackball = new THREE.TrackballControls(camera);
        APPG.controls.trackball.rotateSpeed = 0.5;
        APPG.controls.trackball.rotateSpeed = 1.0;
        APPG.controls.trackball.panSpeed = 0.5;
        APPG.controls.trackball.noPan = false;
        APPG.controls.trackball.noZoom = false;
    }
}