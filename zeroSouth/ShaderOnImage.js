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
var widthScrollBar = 12;
var reductionHeight = widthScrollBar + widthScrollBar;
var reductionWidth = widthScrollBar;
var glWidth = window.innerWidth - reductionWidth;
var glHeight = window.innerHeight - reductionHeight;

// scene, animation, rendering related
var scene;
var camera;
var renderer;
var trackballControls;

var geometry;
var material;
var mesh;
var animate = true;

// shader related
var imageUrl = "../resource/images/house02.jpg";
var myTexture;
var uniforms;

var vertexShaderText;
var fragmentShaderText;

// dat gui related
var text;
var controllerBlend, controllerLevelR, controllerLevelG, controllerLevelB, controllerAnimate;

var DatGuiText = function() {
    this.blend = 0.75;
    this.colorLevelR = 1.0;
    this.colorLevelG = 1.0;
    this.colorLevelB = 1.0;
    this.animate = true;
    this.resetAnimation = resetGeometry;
    this.resetCamera = resetTrackballControls;
};

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
                controllerBlend = gui.add(text, 'blend', 0.0, 1.0);
                controllerLevelR = gui.add(text, 'colorLevelR', 0.0, 1.0);
                controllerLevelG = gui.add(text, 'colorLevelG', 0.0, 1.0);
                controllerLevelB = gui.add(text, 'colorLevelB', 0.0, 1.0);
                controllerAnimate = gui.add(text, 'animate');
                gui.add(text, 'resetAnimation');
                gui.add(text, 'resetCamera');

                myTexture = THREE.ImageUtils.loadTexture(imageUrl, null, updateTextures);
                uniforms = {
                    blendFactor : { type: "f", value: 0.75 },
                    colorFactor : { type: "fv1", value: [1.0, 1.0, 1.0] },
                    texture1: { type: "t", texture: null }
                };

                console.log("initPreGL is completed!");

				initGL();
                animateFrame();
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
        transparent: true,
        side: THREE.DoubleSide
	} );

	mesh = new THREE.Mesh(geometry, material);

	scene.add(mesh);

    dom = renderer.domElement;
    addEventHandlers();

    divKaiJs.appendChild(dom);
}

function animateFrame() {
	requestAnimationFrame(animateFrame);

    if (animate) {
	    mesh.rotation.z += 0.001;
    }
    trackballControls.update();
    render();
}

function render() {
    renderer.render(scene, camera);
}

function resetGeometry() {
    console.log("resetGeometry");
    mesh.rotation.z = 0;
}

function resetTrackballControls() {
    console.log("resetTrackballControls");
    camera.position.set(0, 0, 2);
    trackballControls.reset();
    render();
}

function updateTextures() {
    console.log("Texture loading was completed successfully!");
    myTexture.wrapS = myTexture.wrapT = THREE.RepeatWrapping;
    var aspectRatio = myTexture.image.width / myTexture.image.height;
    console.log("Adjusting aspectRatio to: " + aspectRatio + " Image Props: width: " + myTexture.image.width + " height: " + myTexture.image.height);
    mesh.scale.x *= aspectRatio;
    console.log(mesh.scale.x, mesh.scale.y);
    uniforms.texture1.value = myTexture;
}

function addEventHandlers() {
	window.addEventListener('resize', onWindowResize, false);
	
	controllerBlend.onChange(function(value) {
		uniforms.blendFactor.value = value;
	});
    controllerLevelR.onChange(function(value) {
        uniforms.colorFactor.value[0] = value;
    });
    controllerLevelG.onChange(function(value) {
        uniforms.colorFactor.value[1] = value;
    });
    controllerLevelB.onChange(function(value) {
        uniforms.colorFactor.value[2] = value;
    });
    controllerAnimate.onChange(function(value) {
        animate = value;
    });

    trackballControls = new THREE.TrackballControls(camera, renderer.domElement);
    trackballControls.rotateSpeed = 0.5;
    trackballControls.addEventListener( 'change', render );
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