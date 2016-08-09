/**
 * @author Kai Salmen / www.kaisalmen.de
 */

'use strict';

KSX.apps.demos.SphereSuperCube = (function () {

    var MAIN_CLEAR_COLOR = 0x101010;

    SphereSuperCube.prototype = Object.create(KSX.apps.core.ThreeJsApp.prototype, {
        constructor: {
            configurable: true,
            enumerable: true,
            value: SphereSuperCube,
            writable: true
        }
    });

    function SphereSuperCube( elementToBindTo, mobileDevice, loader ) {
        KSX.apps.core.ThreeJsApp.call(this);

        this.configure({
            user : this,
            name : 'Loader',
            htmlCanvas : elementToBindTo,
            useScenePerspective : true,
            loader: loader
        });

        this.controls = null;
        this.shader = new KSX.apps.shader.SphereSuperCubeShader();
        this.shaderMaterial = null;

        if ( !this.definition.loader ) {
            var uiToolsConfig = {
                useUil: false,
                useStats: true
            };
            this.uiTools = new KSX.apps.tools.UiTools( uiToolsConfig );
        }

        this.globals = {
            animate: true,
            physicalLighting: this.definition.loader ? false : true,
            rotationSpeed: 0.00425,
            objCount: mobileDevice ? 2500 : 7500,
            cubeEdgeLength: mobileDevice ? 20 : 40,
            sphere: {
                segments: mobileDevice ? 24 : 32,
                radius: mobileDevice ? 0.075 : 0.15
            }
        };

    }

    SphereSuperCube.prototype.initAsyncContent = function() {
        var scope = this;

        var callbackOnSuccess = function () {
            scope.asyncDone = true;
        };
        this.shader.loadResources(callbackOnSuccess);
    };

    SphereSuperCube.prototype.initPreGL = function () {
        if ( !this.definition.loader ) {
            this.uiTools.enableStats();
        }
    };

    SphereSuperCube.prototype.initGL = function () {
        if ( !this.platformVerification.verifyHwInstancingSupport( this.renderer, true ) ) {
            this.initOk = false;
            return;
        }

        this.renderer.setClearColor(MAIN_CLEAR_COLOR);

        var cameraDefaults = {
            posCamera: new THREE.Vector3( 0.0, 0.0, -10.0 ),
            far: 1000
        };
        this.scenePerspective.setCameraDefaults( cameraDefaults );
        this.controls = new THREE.TrackballControls( this.scenePerspective.camera );

        this.pivot = new THREE.Object3D();

        var lights = {
            ambientLight: new THREE.AmbientLight( 0x202020 ),
            directionalLight1: new THREE.DirectionalLight( 0xC05050 ),
            directionalLight2: new THREE.DirectionalLight( 0x50C050 ),
            directionalLight3: new THREE.DirectionalLight( 0x5050C0 )
        };

        lights.directionalLight1.position.set( 100, 0, -100 );
        lights.directionalLight2.position.set( -100, 0, -100 );
        lights.directionalLight3.position.set( 0, 0, 100 );

        this.lightArray = new THREE.Object3D();
        this.lightArray.add( lights.directionalLight1 );
        this.lightArray.add( lights.directionalLight2 );
        this.lightArray.add( lights.directionalLight3 );
        this.lightArray.rotateX( Math.PI / 8.0 );
        this.pivot.add( this.lightArray );


        var bufferGeometry = new THREE.SphereBufferGeometry( this.globals.sphere.radius, this.globals.sphere.segments, this.globals.sphere.segments );

        var geometry = new THREE.InstancedBufferGeometry();
        geometry.copy( bufferGeometry );

        var offsets = createOffsetsArray( this.globals.objCount, this.globals.cubeEdgeLength );
        var colors = createColorsArray( this.globals.objCount );
        geometry.addAttribute( 'offset', offsets );
        geometry.addAttribute( 'colorInstanceVS', colors );

        if ( this.globals.physicalLighting ) {
            var physicalShader = THREE.ShaderLib['physical'];
            physicalShader.uniforms['roughness'].value = 0.35;
            physicalShader.uniforms['metalness'].value = 0.1;
            physicalShader.uniforms['opacity'].value = 0.75;

            var vsManipulation = this.shader.shaderTools.createArrayFromShader( physicalShader.vertexShader );
            physicalShader.vertexShader = this.shader.shaderTools.changeLines( vsManipulation, {
                pos: {
                    regex: '#include <begin_vertex>',
                    line: '\tvec3 transformed = vec3( offset.x + position.x, offset.y + position.y, offset.z + position.z );',
                    option: 'change'
                },
                attrOffset: {
                    regex: 'void main',
                    line: 'attribute vec3 offset;',
                    option: 'insertBefore'
                },
                attrColor: {
                    regex: 'void main',
                    line: 'attribute vec3 colorInstanceVS;',
                    option: 'insertBefore'
                },
                varyingColor: {
                    regex: 'void main',
                    line: 'varying vec3 colorInstanceFS;',
                    option: 'insertBefore'
                },
                emptyLine: {
                    regex: 'void main',
                    line: '',
                    option: 'insertBefore'
                },
                colorInOut: {
                    regex: 'void main',
                    line: '\tcolorInstanceFS = colorInstanceVS;',
                    option: 'insertAfter'
                }
            }, true);

            var fsManipulation = this.shader.shaderTools.createArrayFromShader( physicalShader.fragmentShader );
            physicalShader.fragmentShader = this.shader.shaderTools.changeLines( fsManipulation, {
                varyingColor: {
                    regex: 'void main',
                        line: 'varying vec3 colorInstanceFS;',
                        option: 'insertBefore'
                },
                emptyLine: {
                    regex: 'void main',
                    line: '',
                    option: 'insertBefore'
                },
                colorFs: {
                    regex: 'vec4 diffuseColor',
                    line: '\tvec4 diffuseColor = vec4( colorInstanceFS, opacity );',
                    option: 'change'
                }
            }, true);

            this.shaderMaterial = new THREE.ShaderMaterial({
                fragmentShader: physicalShader.fragmentShader,
                vertexShader: physicalShader.vertexShader,
                uniforms: physicalShader.uniforms,
                transparent: true,
                lights: true
            });
        }
        else {
            this.shaderMaterial = this.shader.buildShaderMaterial();
            this.shaderMaterial.wireframe = true;
        }

        var mesh = new THREE.Mesh( geometry, this.shaderMaterial );
        this.pivot.add( mesh );

        this.scenePerspective.scene.add( this.pivot );
    };

    SphereSuperCube.prototype.initPostGL = function () {
        this.dispose();
        return true;
    };

    var createOffsetsArray = function ( objectCount, factor ) {
        var offsets = new THREE.InstancedBufferAttribute( new Float32Array( objectCount * 3 ), 3, 1 );

        var index = 0;
        var x, y, z;
        var base = - factor / 2;
        while ( index < objectCount ) {
            x = base + Math.random() * factor;
            y = base + Math.random() * factor;
            z = base + Math.random() * factor;
            offsets.setXYZ( index, x, y, z );
            index++;
        }

        return offsets;
    };

    var createColorsArray = function ( objectCount ) {
        var colors = new THREE.InstancedBufferAttribute( new Float32Array( objectCount * 3 ), 3, 1 );

        var index = 0;
        var r, g, b;
        while ( index < objectCount ) {
            r = Math.random();
            g = Math.random();
            b = Math.random();
            colors.setXYZ( index, r, g, b );
            index++;
        }

        return colors;
    };

    SphereSuperCube.prototype.resizeDisplayGL = function () {
        this.controls.handleResize();
    };

    SphereSuperCube.prototype.renderPre = function () {
        this.controls.update();
        if ( this.globals.animate ) {
            this.pivot.rotation.x += this.globals.rotationSpeed;
            this.pivot.rotation.y += this.globals.rotationSpeed;
            this.pivot.rotation.z += this.globals.rotationSpeed;
        }
    };

    SphereSuperCube.prototype.renderPost = function () {
        if ( !this.definition.loader ) {
            this.uiTools.updateStats();
        }
    };

    SphereSuperCube.prototype.dispose = function () {
        if ( this.definition.loader ) {
            this.definition.htmlCanvas.style.display  = 'none';
        }
        var divLoading = document.getElementById( 'Loading' );
        if ( divLoading !== null && divLoading !== undefined ) {
            divLoading.style.display  = 'none';
        }
    };

    return SphereSuperCube;
})();
