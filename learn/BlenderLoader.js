// HTML Stuff
var divHeader = null;
var divContent = null;
var dom = null;

var reductionHeight = 16;
var reductionWidth = 0;

var glWidth = 0;
var glHeight = 0;

// three.js
var scene = null;
var camera = null;
var renderer = null;
var materialDae = null;
var dae = null;
var loader = null;

var outputExtra = "";
//var loadDae = "../models/cylinder.dae";
var loadDae = "../models/multiObjects.dae";

function initCollada() {
	var loader = new THREE.ColladaLoader();
	loader.options.convertUpAxis = true;
	loader.load(loadDae, function ( collada ) {
		dae = collada.scene;
		init();
		render();
	} );
}

function init() {
	scene = new THREE.Scene();

	glWidth = window.innerWidth - reductionWidth;
	glHeight = window.innerHeight - reductionHeight;
	
	camera = new THREE.PerspectiveCamera(75, (glWidth) / (glHeight), 0.1, 1000);
	camera.position.set(5, 5, 5);

	var light = new THREE.DirectionalLight( 0xaaaaaa, 1.0);
	light.position.set(0, 0, 10);
	scene.add(light);
	
	// Grid (from three.js example)

	var size = 14, step = 1;
	var geometry = new THREE.Geometry();
	var material = new THREE.LineBasicMaterial({ color: 0x303030 });

	for ( var i = - size; i <= size; i += step ) {
		geometry.vertices.push(new THREE.Vector3(- size, - 0.04, i));
		geometry.vertices.push(new THREE.Vector3(  size, - 0.04, i));

		geometry.vertices.push(new THREE.Vector3(i, - 0.04, - size));
		geometry.vertices.push(new THREE.Vector3(i, - 0.04,   size));
	}
	var line = new THREE.Line( geometry, material, THREE.LinePieces );
	
	scene.add(line);	
	
	materialDae = new THREE.MeshPhongMaterial( {color: 0x00ff00, shading: THREE.SmoothShading, blending: THREE.NormalBlending} );
	if ( dae.children.length > 0 ) {
		for ( var i = 0; i < dae.children.length; i ++ ) {
			outputExtra += " " + dae.children[i].name;
			var daeGeometry = dae.children[i].geometry;
			var matrix = dae.children[i].matrix;
		
			var daeMesh = new THREE.Mesh(daeGeometry, materialDae);
			daeMesh.applyMatrix(matrix);
			scene.add(daeMesh);
		}
	}	

	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(0xaaaaaa, 1.0);
	renderer.setSize(glWidth, glHeight);

	divHeader = document.getElementById("headline");
	divContent = document.getElementById("kaiWebGL");
	dom = renderer.domElement;
	divContent.appendChild(dom);
	
	printStats();
	
	addEventHandlers();
}

function render() {
	requestAnimationFrame(render);
	
	var timer = Date.now() * 0.0005;

	camera.position.x = Math.cos( timer ) * 5;
	camera.position.y = 2;
	camera.position.z = Math.sin( timer ) * 5;
	
	camera.lookAt( scene.position );
	renderer.render(scene, camera);
}

function printStats() {
	divHeader.innerHTML = "Playing around with WebGL: Size: " + glWidth + "x" + glHeight + " Scene listing:" + outputExtra;
}

function addEventHandlers() {
	dom.addEventListener('mousedown', onMouseDown, false);
	window.addEventListener('resize', onWindowResize, false);
}

function onMouseDown(event) {
	event.preventDefault();
	materialDae.wireframe = !materialDae.wireframe;
}

function onWindowResize(event) {
	event.preventDefault();
	glWidth = window.innerWidth - reductionWidth;
	glHeight = window.innerHeight - reductionHeight;
	printStats();
	
	camera.aspect = (glWidth / glHeight);
	camera.updateProjectionMatrix();
	renderer.setSize(glWidth, glHeight);
}

