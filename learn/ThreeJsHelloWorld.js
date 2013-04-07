var scene = null;
var camera = null;
var renderer = null;
var geometry = null;
var material = null;
var cube = null;
var dom = null;

var divHeader = null;
var divKaijs = null;

var widthScrollBar =12;
var widthHeaderFooter = 24;
var reductionHeight = widthScrollBar + widthHeaderFooter;
var reductionWidth = widthScrollBar;

var glWidth = window.innerWidth - reductionWidth;
var glHeight = window.innerHeight - reductionHeight;

function init() {
	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(new THREE.Color(0, 0, 0), 255);

//	document.body.appendChild(renderer.domElement);
	divKaijs = document.getElementById("kaiWebGL");
	divKaijs.style.width = glWidth + "px";
	divKaijs.style.height = glHeight + "px";
	divHeader = document.getElementById("headline");
	printStats();

	renderer.setSize(glWidth, glHeight);
	camera = new THREE.PerspectiveCamera(75, (glWidth) / (glHeight), 0.1, 1000);

	dom = renderer.domElement;
	divKaijs.appendChild(dom);

	addEventHandlers();

	geometry = new THREE.CubeGeometry(1,1,1);
	material = new THREE.MeshBasicMaterial({color: 0x00ff00});
	cube = new THREE.Mesh(geometry, material);
	scene.add(cube);

	camera.position.z = 5;
}

function render() {
	requestAnimationFrame(render);

	cube.rotation.x += 0.1;
	cube.rotation.y += 0.1;

	renderer.render(scene, camera);
}

function addEventHandlers() {
	dom.addEventListener('mousedown', onMouseDown, false);
	window.onresize = onWindowResize;
}

function onMouseDown(event) {
	event.preventDefault();
	material.color = new THREE.Color(0xff0000);
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
//	renderer.setClearColorHex(0x0000ff, 1.0);
}

