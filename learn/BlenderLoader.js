var scene = null;
var camera = null;
var renderer = null;
var geometry = null;
var material = null;
var mesh = null;
var dom = null;

var divHeader = null;
var divKaijs = null;

var widthScrollBar = 12;
var heightHeader = 6;
var reductionHeight = widthScrollBar + widthScrollBar + heightHeader;
var reductionWidth = widthScrollBar;

var glWidth = window.innerWidth - reductionWidth;
var glHeight = window.innerHeight - reductionHeight;

var loader = new THREE.ColladaLoader();
loader.options.convertUpAxis = true;
loader.load( '../models/monster.dae', function ( collada ) {
	mesh = collada.scene;
	
	initAll();
} );

function initAll() {
	divKaijs = document.getElementById("kaiWebGL");
	divKaijs.style.width = glWidth + "px";
	divKaijs.style.height = glHeight + "px";
	divHeader = document.getElementById("headline");

	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(new THREE.Color(0, 0, 0), 255);
	renderer.setSize(glWidth, glHeight);
	
	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(75, (glWidth) / (glHeight), 0.1, 1000);
	camera.position.set( 0, 0, 100 );

	var light = new THREE.DirectionalLight( 0xaaaaaa, 1.0);
	light.position.set(0, 1, 1);
	scene.add( light );
	
	scene.add( mesh );

	dom = renderer.domElement;
	divKaijs.appendChild(dom);
	
	addEventHandlers();	
	
	printStats();
}

function render() {
	requestAnimationFrame(render);

	//mesh.rotation.x += 0.1;
//	mesh.rotation.y += 0.1;

	renderer.render(scene, camera);
}

function addEventHandlers() {
	dom.addEventListener('mousedown', onMouseDown, false);
	window.onresize = onWindowResize;
}

function onMouseDown(event) {
	event.preventDefault();
	//material.color = new THREE.Color(0xff0000);
	material.wireframe = !material.wireframe;
}

function printStats() {
	divHeader.innerHTML = "Playing around with WebGL: Size: " + glWidth + "x" + glHeight;
}

function onWindowResize(event) {
	event.preventDefault();
	glWidth = window.innerWidth - reductionWidth;
	glHeight = window.innerHeight - reductionHeight;
	divKaijs.style.width = glWidth + "px";
	divKaijs.style.height = glHeight + "px";
	printStats();

	renderer.setSize(glWidth, glHeight);
	camera.aspect = (glWidth / glHeight);
	camera.updateProjectionMatrix();
}

