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
var animate = false;
var wireframe = false;
var loadingComplete = false;

var daeRoot;
var colladaLoader;
var objRoot = null;
var loadingManager;
var objLoader;

var fileDae = "resource/models/snowtracks.DAE";
var fileObj = "resource/models/snowtracks.obj";
var fileObjMat = "resource/models/snowtracks.mtl";
//var fileDae = "resource/models/Ambulance.dae";
//var fileObj = "resource/models/Ambulance.obj";
//var fileObjMat = "resource/models/Ambulance.mtl";

var text;
var controllerAnimate;
var controllerWireframe;

var DatGuiText = function() {
    this.animate = animate;
    this.resetAnimation = resetGeometry;
    this.resetCamera = resetTrackballControls;
    this.wireframe = wireframe;
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
//        controllerAnimate = gui.add(text, 'animate');
//        gui.add(text, 'resetAnimation');
        gui.add(text, 'resetCamera');
//        controllerWireframe = gui.add(text, 'wireframe');

        console.log("initPreGL is completed!");

        initGL();

        console.log("initGL is completed! Loading objects ...");
        animateFrame();

        initObjLoader();
        //initColladaLoader();

        //postLoad();
    }
);


function initColladaLoader() {
	colladaLoader = new THREE.ColladaLoader();
    colladaLoader.options.convertUpAxis = true;

    colladaLoader.load(fileDae, function ( object ) {
        daeRoot = object.scene;

        if ( daeRoot.children.length > 0 ) {
            for ( var i = 0; i < daeRoot.children.length; i ++ ) {
                var daeGeometry = daeRoot.children[i].geometry;
                var matrix = daeRoot.children[i].matrix;

                var daeMesh = new THREE.Mesh(daeGeometry, materialMaster);
                daeMesh.applyMatrix(matrix);
                scene.add(daeMesh);
            }
        }

        console.log("Loading Collada objects is completed!");

        postLoad();
	} );
}

function initObjLoader() {
    loadingManager = new THREE.LoadingManager();
    loadingManager.onProgress = function ( item, loaded, total ) {
        console.log( item, loaded, total );
    };

    //objLoader = new THREE.OBJLoader( loadingManager );
    objLoader = new THREE.OBJMTLLoader();

    objLoader.load( fileObj, fileObjMat, function ( objRoot ) {

        objRoot.traverse( function (child) {
            if (child instanceof THREE.Mesh) {
//                child.material = materialMaster;
            }
        });

        objRoot.scale.x = 0.05;
        objRoot.scale.y = 0.05;
        objRoot.scale.z = 0.05;
//        objRoot.rotation.x = - Math.PI / 2;
        objRoot.position.y = 5;
        scene.add(objRoot);
        console.log("Loading OBJ objects is completed!");
        postLoad();
    });
}

function postLoad() {
    divText.style.left = -1000;
    divText.style.top = -1000;
    divText.style.visibility = "hidden";
    console.log("Post load completed.");
    render();
}

function resetCamera() {
    camera.position.set(-35, 35, -35);
    camera.updateProjectionMatrix();
}

function initGL() {
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xaaaaaa, 1.0);
    renderer.setSize(glWidth, glHeight, false);

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(75, (glWidth) / (glHeight), 0.1, 1000);
    resetCamera();

	var light1 = new THREE.DirectionalLight( 0xffff99, 1.0);
    var light1Sphere = new THREE.SphereGeometry(0.25, 12, 12);
    var light1Material = new THREE.MeshPhongMaterial({color: 0xffff99, emissive: 0xffff99});
	light1.position.set(-50, 0, 20);
    var meshSphereLight1 = new THREE.Mesh(light1Sphere, light1Material);
    meshSphereLight1.position.set(-50, 0, 20);
	scene.add(meshSphereLight1);
    scene.add(light1);

    var light2 = new THREE.DirectionalLight( 0xffff99, 1.0);
    var light2Sphere = new THREE.SphereGeometry(0.25, 12, 12);
    var light2Material = new THREE.MeshPhongMaterial({color: 0xffff99, emissive: 0xffff99});
    light2.position.set(50, 50, 50);
    var meshSphereLight2 = new THREE.Mesh(light2Sphere, light2Material);
    meshSphereLight2.position.set(50, 50, 50);
    scene.add(meshSphereLight2);
    scene.add(light2);

	// Grid (from three.js example)
    var size = 48, step = 1;
	var geometry = new THREE.Geometry();
	var material = new THREE.LineBasicMaterial({ color: 0x303030 });
    materialMaster = new THREE.MeshPhongMaterial( {color: 0x5555dd, shading: THREE.SmoothShading, blending: THREE.NormalBlending} );

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
        objRoot.rotation.z += 0.001;
    }

    trackballControls.update();
    render();
}

function render() {
    renderer.render(scene, camera);
}

function resetGeometry() {
    console.log("resetGeometry");
    if (objRoot !== null) {
        objRoot.rotation.z = 0;
    }
}

function resetTrackballControls() {
    console.log("resetTrackballControls");
    resetCamera();
    trackballControls.reset();
    render();
}

function addEventHandlers() {
//	dom.addEventListener('mousedown', onMouseDown, false);
	window.addEventListener('resize', onWindowResize, false);
/*
    controllerAnimate.onChange(function(value) {
        animate = value;
    });

    controllerWireframe.onChange(function(value) {
        materialMaster.wireframe = value;
    });
*/
    trackballControls = new THREE.TrackballControls(camera);
    trackballControls.rotateSpeed = 0.5;
    trackballControls.rotateSpeed = 1.0;
    trackballControls.panSpeed = 0.5;
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

