/**
 * Created by Kai Salmen.
 */


"use strict";

KSX.apps.demos.impl.SkyboxCubeMapApp = (function () {

    function SkyboxCubeMapApp(elementToBindTo) {
        this.app = new KSX.apps.core.ThreeJsApp(this, 'SkyboxCubeMapApp', elementToBindTo, true, false, true);

        this.textureTools = new KSX.apps.tools.TextureTools();

        this.stats = new Stats();
    }

    SkyboxCubeMapApp.prototype.initAsyncContent = function () {
        var scope = this;


        var promises = new Set();
        var cubeBasePath = '../../resource/textures/skybox';
        var imageFileNames = [ 'px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg' ];
        promises.add(this.textureTools.loadTextureCube(cubeBasePath, imageFileNames));

        Promise.all(promises).then(
            function (results) {
                scope.textureCubeLoader = results[0];
                scope.app.initSynchronuous();
            }
        ).catch(
            function (error) {
                console.log('The following error occurred: ', error);
            }
        );
    };

    SkyboxCubeMapApp.prototype.initPreGL = function () {
        this.stats.setMode(0);
        document.body.appendChild(this.stats.domElement);
    };

    SkyboxCubeMapApp.prototype.initGL = function () {
        var renderer = this.app.renderer;
        var scenePerspective = this.app.scenePerspective;
        var sceneCube = scenePerspective.sceneCube;
        var scene = scenePerspective.scene;
        var camera = scenePerspective.camera;

        renderer.setClearColor( 0x3B3B3B );
        renderer.autoClear = false;

        camera.position.set( 20, 20, 20 );
        scenePerspective.updateCamera();

        this.controls = new THREE.TrackballControls(camera);
        this.controls.rotateSpeed = 0.5;
        this.controls.zoomSpeed = 1.0;
        this.controls.panSpeed = 0.8;
        this.controls.staticMoving = true;
        this.controls.dynamicDampingFactor = 0.3;
        this.controls.keys = [ 65, 83, 68 ];


        var ambient = new THREE.AmbientLight(0x404040);
        scene.add(ambient);

        var geometry = new THREE.SphereBufferGeometry(5, 64, 64);
        var material = new THREE.MeshStandardMaterial();
        material.envMap = this.textureCubeLoader;
        material.envMapIntensity = 1.0;
        material.roughness = 0.1;
        var meshSphere =  new THREE.Mesh(geometry, material);

        scene.add( meshSphere );

        // Skybox
        var shader = THREE.ShaderLib[ "cube" ];
        shader.uniforms[ "tCube" ].value = this.textureCubeLoader;

        var box = new THREE.BoxGeometry( 100, 100, 100 );
        var materialCube = new THREE.ShaderMaterial( {
            fragmentShader: shader.fragmentShader,
            vertexShader: shader.vertexShader,
            uniforms: shader.uniforms,
            depthWrite: false,
            side: THREE.BackSide
        });
        var meshCube = new THREE.Mesh(box, materialCube );
        sceneCube.add( meshCube );
    };

    SkyboxCubeMapApp.prototype.render = function () {
        this.controls.update();
        this.stats.update();
    };

    SkyboxCubeMapApp.prototype.resizeDisplayGL = function() {
        this.controls.handleResize();
    };

    return SkyboxCubeMapApp;

})();

KSX.apps.demos.SkyboxCubeMap = {
    glob : {
        appLifecycle : new KSX.apps.core.AppLifecycle("App Lifecycle")
    },
    func : {
        init : function () {
            var impl = new KSX.apps.demos.impl.SkyboxCubeMapApp(document.getElementById("DivGLFullCanvas"));
            KSX.apps.demos.SkyboxCubeMap.glob.appLifecycle.addApp(impl.app);

            // kicks init and starts rendering
            KSX.apps.demos.SkyboxCubeMap.glob.appLifecycle.initAsync();
        },
        render : function () {
            requestAnimationFrame(KSX.apps.demos.SkyboxCubeMap.func.render);
            KSX.apps.demos.SkyboxCubeMap.glob.appLifecycle.renderAllApps();
        },
        onWindowResize : function () {
            KSX.apps.demos.SkyboxCubeMap.glob.appLifecycle.resizeAll();
        }
    }
};


console.log('Starting application "SkyboxCubeMapApp"');

window.addEventListener( 'resize', KSX.apps.demos.SkyboxCubeMap.func.onWindowResize, false );

KSX.apps.demos.SkyboxCubeMap.func.init();
KSX.apps.demos.SkyboxCubeMap.func.render();

