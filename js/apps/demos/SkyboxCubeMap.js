/**
 * @author Kai Salmen / www.kaisalmen.de
 */

'use strict';

KSX.apps.demos.SkyboxCubeMap = (function () {

    SkyboxCubeMap.prototype = Object.create(KSX.apps.core.ThreeJsApp.prototype, {
        constructor: {
            configurable: true,
            enumerable: true,
            value: SkyboxCubeMap,
            writable: true
        }
    });

    function SkyboxCubeMap(elementToBindTo) {
        KSX.apps.core.ThreeJsApp.call(this);

        this.configure({
            user : this,
            name : 'SkyboxCubeMap',
            htmlCanvas : elementToBindTo,
            useScenePerspective : true,
            useCube : true
        });

        this.textureTools = new KSX.apps.tools.TextureTools();
        this.textureCube = null;

        var uiToolsConfig = {
            useUil: false,
            useStats: true
        };
        this.uiTools = new KSX.apps.tools.UiTools( uiToolsConfig );
    }

    SkyboxCubeMap.prototype.initAsyncContent = function () {
        var scope = this;

        var promises = [];
        var cubeBasePath = '../../resource/textures/skybox';
        var imageFileNames = [ 'px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg' ];
        promises.push(this.textureTools.loadTextureCube(cubeBasePath, imageFileNames));

        Promise.all(promises).then(
            function (results) {
                scope.textureCube = results[0];
                scope.asyncDone = true;
            }
        ).catch(
            function (error) {
                console.log('The following error occurred: ', error);
            }
        );
    };

    SkyboxCubeMap.prototype.initPreGL = function () {
        this.uiTools.enableStats();
    };

    SkyboxCubeMap.prototype.initGL = function () {
        this.renderer.setClearColor( 0x3B3B3B );
        this.renderer.autoClear = false;

        this.scenePerspective.camera.position.set( 20, 20, 20 );
        this.scenePerspective.updateCamera();

        this.controls = new THREE.TrackballControls( this.scenePerspective.camera );

        var ambient = new THREE.AmbientLight(0x404040);
        this.scenePerspective.scene.add(ambient);

        var geometry = new THREE.SphereBufferGeometry(5, 64, 64);
        var material = new THREE.MeshStandardMaterial();
        material.envMap = this.textureCube;
        material.envMapIntensity = 1.0;
        material.roughness = 0.1;
        var meshSphere =  new THREE.Mesh(geometry, material);

        this.scenePerspective.scene.add( meshSphere );

        // Skybox
        var shader = THREE.ShaderLib[ "cube" ];
        shader.uniforms[ "tCube" ].value = this.textureCube;

        var box = new THREE.BoxGeometry( 100, 100, 100 );
        var materialCube = new THREE.ShaderMaterial( {
            fragmentShader: shader.fragmentShader,
            vertexShader: shader.vertexShader,
            uniforms: shader.uniforms,
            depthWrite: false,
            side: THREE.BackSide
        });
        var meshCube = new THREE.Mesh(box, materialCube );
        this.scenePerspective.sceneCube.add( meshCube );
    };

    SkyboxCubeMap.prototype.renderPre = function () {
        this.controls.update();
    };

    SkyboxCubeMap.prototype.renderPost = function () {
        this.uiTools.updateStats();
    };

    SkyboxCubeMap.prototype.resizeDisplayGL = function() {
        this.controls.handleResize();
    };

    return SkyboxCubeMap;

})();
