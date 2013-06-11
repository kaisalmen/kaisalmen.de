var scene;
var camera;
var renderer;
var geometry;
var material;
var mesh;

var myTexture;
var uniforms;

var dom;
var divKaiJs;

var widthScrollBar = 12;
var reductionHeight = widthScrollBar + widthScrollBar;
var reductionWidth = widthScrollBar;

var glWidth = window.innerWidth - reductionWidth;
var glHeight = window.innerHeight - reductionHeight;

var vertexShaderText;
var fragmentShaderText;

var text;
var controller;

$(document).ready(
	function() {
	    $.when(
	    	loadVertexShader(),
	    	loadFragmentShader()
	    ).done(
	    	function(vert, frag) {
	    		console.log("Shader and texture loading from file is completed!");
	    		vertexShaderText = vert[0];
	    		fragmentShaderText = frag[0];

                divKaiJs = document.getElementById("kaiWebGL");
                divKaiJs.style.width = glWidth + "px";
                divKaiJs.style.height = glHeight + "px";

                text = new DatGuiText();
                var gui = new dat.GUI();
                controller = gui.add(text, 'blend', 0.0, 1.0);

                myTexture = THREE.ImageUtils.loadTexture("../resource/images/ready01.jpg", null, updateTextures);
                uniforms = {
                    blendFactor : { type: "f", value: 0.75 },
                    texture1: { type: "t", texture: null }
                };

                console.log("initPreGL is completed!");

				initGL();
				initPostGL();
				render();
	    	}
	    );	    	
	}
);

function loadVertexShader() {
	return $.get("shader/passThrough.vs", function(data) {
		console.log(data);
	});
}

function loadFragmentShader() {
	return $.get("shader/simpleTextureEffect.fs", function(data) {
		console.log(data);
	});
}

var DatGuiText = function() {
    this.blend = 0.75;
};

function initGL() {
	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(new THREE.Color(0, 0, 0), 255);
	renderer.setSize(glWidth, glHeight, false);
	
	scene = new THREE.Scene();
	
	camera = new THREE.PerspectiveCamera(75, (glWidth) / (glHeight), 0.1, 1000);
	camera.position.set(0, 0, 2);
	
	var light = new THREE.DirectionalLight( 0xaaaaaa, 1.0);
	light.position.set(0, 1, 1);
	scene.add( light );

	geometry = new THREE.PlaneGeometry( 2, 2 );

	material = new THREE.ShaderMaterial( {
		uniforms: uniforms,
		vertexShader: vertexShaderText,
		fragmentShader: fragmentShaderText,
        transparent: true
	} );

	mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);
}

function initPostGL() {	
	addEventHandlers();
	
	dom = renderer.domElement;
    divKaiJs.appendChild(dom);
}

function render() {
	requestAnimationFrame(render);

	mesh.rotation.z += 0.001;

	renderer.render(scene, camera);
}

function updateTextures() {
    console.log("Texture loading was completed successfully!");
    myTexture.wrapS = myTexture.wrapT = THREE.RepeatWrapping;
    uniforms.texture1.value = myTexture;
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
    divKaiJs.style.width = glWidth + "px";
    divKaiJs.style.height = glHeight + "px";

	renderer.setSize(glWidth, glHeight);
	camera.aspect = (glWidth / glHeight);
	camera.updateProjectionMatrix();
}