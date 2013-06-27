// WebGL check first
if (!Detector.webgl) {
    Detector.addGetWebGLMessage();
}
else {
    console.log("WebGL is available!")
}

// dom related
var dom;
var divKaiJs;
var divText;

var widthScrollBar = 12;
var reductionHeight = widthScrollBar + widthScrollBar;
var reductionWidth = widthScrollBar;
var glWidth = window.innerWidth - reductionWidth;
var glHeight = window.innerHeight - reductionHeight;

// three.js
var scene;
var camera;
var renderer;
var trackballControls;

var materialMaster;
var animate = true;
var loadingComplete = false;

var daeRoot;
var colladaLoader;
var objRoot;
var objLoader;
//var loadDae = "../resource/models/cylinder.dae";
//var loadDae = "../resource/models/multiObjects.dae";
//var loadDae = "../resource/models/Alaska.dae";
var fileDae = "../resource/models/Ambulance.dae";
var fileObj = "../resource/models/Ambulance.obj";
//var fileObjMat = "../resource/models/Ambulance.mtl";

var text;
var controllerAnimate;
var DatGuiText = function() {
    this.animate = true;
    this.resetAnimation = resetGeometry;
    this.resetCamera = resetTrackballControls;
};

$(document).ready(
    function() {
        console.log("Document loaded! Starting main init!");

        divText = document.getElementById('textOverlay');
        divText.style.visibility = "visible";
        divText.style.left = (glWidth - 400) / 2 + "px";
        divText.style.top = 48 + "px";

        divKaiJs = document.getElementById("kaiWebGL");
        divKaiJs.style.width = glWidth + "px";
        divKaiJs.style.height = glHeight + "px";

        text = new DatGuiText();
        var gui = new dat.GUI();
        controllerAnimate = gui.add(text, 'animate');
        gui.add(text, 'resetAnimation');
        gui.add(text, 'resetCamera');

        console.log("initPreGL is completed!");

        initGL();

        console.log("initGL is completed! Loading objects ...");
        animateFrame();

        initObjLoader();
        //initColladaLoader();
    }
);


function initColladaLoader() {
	colladaLoader = new THREE.ColladaLoader();
    colladaLoader.options.convertUpAxis = true;

    colladaLoader.load(fileDae, function ( collada ) {
        daeRoot = collada.scene;
        console.log("Loading Collada objects is completed!");
	} );
}

function initObjLoader() {
    objLoader = new THREE.OBJLoader();

    objLoader.addEventListener( 'load', function ( event ) {
        objRoot = event.content;
        objRoot.scale.x = 0.01;
        objRoot.scale.y = 0.01;
        objRoot.scale.z = 0.01;
        scene.add(objRoot);
        console.log("Loading OBJ objects is completed!");
        postLoad();
    });
    objLoader.load(fileObj);
}

function postLoad() {
    divText.style.left = -1000;
    divText.style.top = -1000;
    divText.style.visibility = "hidden";
    console.log("Post load completed.");
    render();
}

function initGL() {
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x000000, 1.0);
    renderer.setSize(glWidth, glHeight, false);

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(75, (glWidth) / (glHeight), 0.1, 1000);
	camera.position.set(0, 0, 10);

	var light = new THREE.DirectionalLight( 0xbbbbbb, 1.0);
	light.position.set(100, -100, -100);
	scene.add(light);

    var light2 = new THREE.DirectionalLight( 0x0000dd, 1.0);
    light2.position.set(200, 200, 200);
    scene.add(light2);
	
	// Grid (from three.js example)
    var size = 24, step = 1;
	var geometry = new THREE.Geometry();
	var material = new THREE.LineBasicMaterial({ color: 0x303030 });
    materialMaster = new THREE.MeshPhongMaterial( {color: 0x00ff00, shading: THREE.SmoothShading, blending: THREE.NormalBlending} );

	for ( var i = - size; i <= size; i += step ) {
		geometry.vertices.push(new THREE.Vector3(- size, - 0.04, i));
		geometry.vertices.push(new THREE.Vector3(  size, - 0.04, i));

		geometry.vertices.push(new THREE.Vector3(i, - 0.04, - size));
		geometry.vertices.push(new THREE.Vector3(i, - 0.04,   size));
	}
	var line = new THREE.Line( geometry, material, THREE.LinePieces );
	
	scene.add(line);

    dom = renderer.domElement;
	addEventHandlers();

    divKaiJs.appendChild(dom);
}

function animateFrame() {
	requestAnimationFrame(animateFrame);
	
    if (animate && objRoot !== null) {
//        objRoot.rotation.z += 0.001;
    }

    trackballControls.update();
}

function render() {
    renderer.render(scene, camera);
}

function resetGeometry() {
    console.log("resetGeometry");
    if (objRoot !== null) {
//        objRoot.rotation.z = 0;
    }
}

function resetTrackballControls() {
    console.log("resetTrackballControls");
    camera.position.set(0, 0, 10);
    trackballControls.reset();
    render();
}

function addEventHandlers() {
	dom.addEventListener('mousedown', onMouseDown, false);
	window.addEventListener('resize', onWindowResize, false);

    controllerAnimate.onChange(function(value) {
        animate = value;
    });

    trackballControls = new THREE.TrackballControls(camera, renderer.domElement);
    trackballControls.rotateSpeed = 0.5;
    trackballControls.addEventListener( 'change', render );
}

function onMouseDown(event) {
	event.preventDefault();
    materialMaster.wireframe = !materialMaster.wireframe;
}

function onWindowResize(event) {
	event.preventDefault();
	glWidth = window.innerWidth - reductionWidth;
	glHeight = window.innerHeight - reductionHeight;

	camera.aspect = (glWidth / glHeight);
	camera.updateProjectionMatrix();
	renderer.setSize(glWidth, glHeight);
}

