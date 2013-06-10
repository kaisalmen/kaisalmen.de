var scene = null;
var camera = null;
var renderer = null;
var geometry = null;
var material = null;
var mesh = null;
var myText = THREE.ImageUtils.loadTexture("../resource/images/ready01.jpg");
var uniforms = {
	blendFactor : { type: "f", value: 0.0 },
	texture1: { type: "t", texture: THREE.ImageUtils.loadTexture("../resource/images/ready01.jpg") }
	//texture1: { type: "t", texture: THREE.ImageUtils.loadTexture("../resource/images/house02.jpg", new THREE.UVMapping()) }
};

var dom = null;
var divKaijs = null;

var widthScrollBar = 12;
var reductionHeight = widthScrollBar + widthScrollBar;
var reductionWidth = widthScrollBar;

var glWidth = window.innerWidth - reductionWidth;
var glHeight = window.innerHeight - reductionHeight;

var vertexShaderText = null;
var fragmentShaderText = null;

var text = null;
var controller = null;

$(document).ready(
	function() {
	    $.when(
	    	loadVertexShader(),
	    	loadFragmentShader()
	    ).done(
	    	function(vert, frag) {
	    		console.log("Shader loading from file is completed!");
	    		vertexShaderText = vert[0];
	    		fragmentShaderText = frag[0];
	    		
				initPreGL();
				initGL();
				initPostGL();
				render();
	    	}
	    );	    	
	}
);

function initPreGL() {
	divKaijs = document.getElementById("kaiWebGL");
	divKaijs.style.width = glWidth + "px";
	divKaijs.style.height = glHeight + "px";
	
	text = new DatGuiText();
	var gui = new dat.GUI();
	controller = gui.add(text, 'blend', 0.0, 1.0);

	console.log("initPreGL is completed!");
}

var DatGuiText = function() {
	this.blend = 0.75;
};

function loadVertexShader() {
	return $.get("shader/passThrough.vs", function(data) {
		console.log(data);
	});
}

function loadFragmentShader() {
//	return $.get("shader/staticGreenColor.fs", function(data) {
	return $.get("shader/simpleTextureEffect.fs", function(data) {
		console.log(data);
	});
}

function loadTextures() {
	THREE.ImageUtils.loadTexture("../resource/images/ready01.jpg");
}

function initGL() {
	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(new THREE.Color(0, 0, 0), 255);
	renderer.setSize(glWidth, glHeight);
	
	scene = new THREE.Scene();
	
	camera = new THREE.PerspectiveCamera(75, (glWidth) / (glHeight), 0.1, 1000);
	camera.position.set(0, 0, 2);
	
	var light = new THREE.DirectionalLight( 0xaaaaaa, 1.0);
	light.position.set(0, 1, 1);
	scene.add( light );
	
	uniforms.blendFactor.value = text.blend;
	uniforms.texture1.texture.wrapS = uniforms.texture1.texture.wrapT = THREE.Repeat;
	
	console.log(uniforms.texture1.texture);
	
	geometry = new THREE.PlaneGeometry( 2, 2 );
//	geometry = new THREE.SphereGeometry(1,64,64);

	material = new THREE.ShaderMaterial( {
		uniforms: uniforms,
		vertexShader: vertexShaderText,
		fragmentShader: fragmentShaderText
	} );
//	material = new THREE.MeshPhongMaterial({color: 0x00ff00});

	// vertex shader does not apply geometry transform => screen is filled with pixel
	mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);
}

function initPostGL() {	
	addEventHandlers();
	
	dom = renderer.domElement;
	divKaijs.appendChild(dom);
}

function render() {
	requestAnimationFrame(render);

	mesh.rotation.x += 0.01;
	mesh.rotation.y += 0.01;

	uniforms.texture1.value = myText;
	
	renderer.render(scene, camera);
}

function addEventHandlers() {
	window.addEventListener('resize', onWindowResize, false);
	
	controller.onChange(function(value) {
		uniforms.blendFactor.value = value;
	});
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

