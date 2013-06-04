var scene = null;
var camera = null;
var renderer = null;
var geometry = null;
var material = null;
var plane = null;
var dom = null;

var divHeader = null;
var divKaijs = null;
var divDebug = null; 

var widthScrollBar = 12;
var heightHeader = 6;
var reductionHeight = widthScrollBar + widthScrollBar + heightHeader;
var reductionWidth = widthScrollBar;

var glWidth = window.innerWidth - reductionWidth;
var glHeight = window.innerHeight - reductionHeight;

var vertexShaderText = null;
var fragmentShaderText = null;

function initPreGL() {
	divKaijs = document.getElementById("kaiWebGL");
	divKaijs.style.width = glWidth + "px";
	divKaijs.style.height = glHeight + "px";
	divHeader = document.getElementById("headline");
	
	jQuery.get('./shader/passThrough.vs', function(data) {
		vertexShaderText = data;	    
	});
	jQuery.get('./shader/staticColor.fs', function(data) {
		fragmentShaderText = data;	    
	});
}

function initGL() {
	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(new THREE.Color(0, 0, 0), 255);
	renderer.setSize(glWidth, glHeight);
	
	scene = new THREE.Scene();
	camera = new THREE.Camera();
	camera.position.z = 1;
	
	uniforms = {
	};
	
	geometry = new THREE.PlaneGeometry( 2, 2 );
	material = new THREE.ShaderMaterial( {
		uniforms: uniforms,
		vertexShader: vertexShaderText,
		fragmentShader: fragmentShaderText
	} );
	plane = new THREE.Mesh(geometry, material);
	scene.add(plane);
}

function initPostGL() {	
	dom = renderer.domElement;
	divKaijs.appendChild(dom);
}

function createDebugOutput() {
	divDebug = document.getElementById("debug");
	divDebug.innerHTML = vertexShaderText;
	divDebug.innerHTML = fragmentShaderText;
}

function render() {
	requestAnimationFrame(render);

	renderer.render(scene, camera);
}

function onWindowResize(event) {
	event.preventDefault();
	glWidth = window.innerWidth - reductionWidth;
	glHeight = window.innerHeight - reductionHeight;
	divKaijs.style.width = glWidth + "px";
	divKaijs.style.height = glHeight + "px";

	renderer.setSize(glWidth, glHeight);
	camera.aspect = (glWidth / glHeight);
	camera.updateProjectionMatrix();
}

