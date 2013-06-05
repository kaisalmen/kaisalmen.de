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

function initPreGL() {
	divKaijs = document.getElementById("kaiWebGL");
	divKaijs.style.width = glWidth + "px";
	divKaijs.style.height = glHeight + "px";
	divHeader = document.getElementById("headline");
}

function initGL() {
	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(new THREE.Color(0, 0, 0), 255);
	renderer.setSize(glWidth, glHeight);
	
	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(75, (glWidth) / (glHeight), 0.1, 1000);
	camera.position.set( 0, 0, 2 );

	var light = new THREE.DirectionalLight( 0xaaaaaa, 1.0);
	light.position.set(0, 1, 1);
	scene.add( light );

	geometry = new THREE.SphereGeometry(1,64,64);
	//material = new THREE.MeshBasicMaterial({color: 0x00ff00});
	material = new THREE.MeshPhongMaterial({color: 0x00ff00});
	mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);
}

function initPostGL() {	
	dom = renderer.domElement;
	divKaijs.appendChild(dom);
	
	addEventHandlers();	
	
	printStats();
}

function render() {
	requestAnimationFrame(render);

	//mesh.rotation.x += 0.1;
	mesh.rotation.y += 0.1;

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

