/**
 * @author Kai Salmen / www.kaisalmen.de
 */

'use strict';

var WWParallels = (function () {

	function WWParallels( elementToBindTo ) {
		this.renderer = null;
		this.canvas = elementToBindTo;
		this.aspectRatio = 1;
		this.recalcAspectRatio();

		this.scene = null;
		this.cameraDefaults = {
			posCamera: new THREE.Vector3( 0.0, 175.0, 500.0 ),
			posCameraTarget: new THREE.Vector3( 0, 0, 0 ),
			near: 0.1,
			far: 10000,
			fov: 45
		};
		this.camera = null;
		this.cameraTarget = this.cameraDefaults.posCameraTarget;

		this.wwDirector = new THREE.OBJLoader2.WWOBJLoader2Director();
		this.wwDirector.setCrossOrigin( 'anonymous' );

		this.controls = null;
		this.cube = null;

		this.allAssets = [];
		this.feedbackArray = null;
	}

	WWParallels.prototype.initGL = function () {
		this.renderer = new THREE.WebGLRenderer( {
			canvas: this.canvas,
			antialias: true,
			autoClear: true
		} );
		this.renderer.setClearColor( 0x050505 );

		this.scene = new THREE.Scene();

		this.camera = new THREE.PerspectiveCamera( this.cameraDefaults.fov, this.aspectRatio, this.cameraDefaults.near, this.cameraDefaults.far );
		this.resetCamera();
		this.controls = new THREE.TrackballControls( this.camera, this.renderer.domElement );

		var ambientLight = new THREE.AmbientLight( 0x404040 );
		var directionalLight1 = new THREE.DirectionalLight( 0xC0C090 );
		var directionalLight2 = new THREE.DirectionalLight( 0xC0C090 );

		directionalLight1.position.set( -100, -50, 100 );
		directionalLight2.position.set( 100, 50, -100 );

		this.scene.add( directionalLight1 );
		this.scene.add( directionalLight2 );
		this.scene.add( ambientLight );

		var geometry = new THREE.BoxGeometry( 10, 10, 10 );
		var material = new THREE.MeshNormalMaterial();
		this.cube = new THREE.Mesh( geometry, material );
		this.cube.position.set( 0, -20, 0 );
		this.scene.add( this.cube );
	};

	WWParallels.prototype.resizeDisplayGL = function () {
		this.controls.handleResize();

		this.recalcAspectRatio();
		this.renderer.setSize( this.canvas.offsetWidth, this.canvas.offsetHeight, false );

		this.updateCamera();
	};

	WWParallels.prototype.recalcAspectRatio = function () {
		this.aspectRatio = ( this.canvas.offsetHeight === 0 ) ? 1 : this.canvas.offsetWidth / this.canvas.offsetHeight;
	};

	WWParallels.prototype.resetCamera = function () {
		this.camera.position.copy( this.cameraDefaults.posCamera );
		this.cameraTarget.copy( this.cameraDefaults.posCameraTarget );

		this.updateCamera();
	};

	WWParallels.prototype.updateCamera = function () {
		this.camera.aspect = this.aspectRatio;
		this.camera.lookAt( this.cameraTarget );
		this.camera.updateProjectionMatrix();
	};

	WWParallels.prototype.render = function () {
		if ( ! this.renderer.autoClear ) this.renderer.clear();

		this.controls.update();

		this.cube.rotation.x += 0.05;
		this.cube.rotation.y += 0.05;

		this.renderer.render( this.scene, this.camera );
	};
	WWParallels.prototype.reportProgress = function( text ) {
		document.getElementById( 'feedback' ).innerHTML = text;
	};

	WWParallels.prototype.enqueueAllAssests = function ( maxQueueSize, maxWebWorkers, streamMeshes ) {
		var scope = this;
		scope.wwDirector.objectsCompleted = 0;
		scope.feedbackArray = new Array( maxWebWorkers );
		for ( var i = 0; i < maxWebWorkers; i++ ) {
			scope.feedbackArray[ i ] = 'Worker #' + i + ': Awaiting feedback';
		}
		scope.reportProgress( scope.feedbackArray.join( '\<br\>' ) );

		var callbackCompletedLoading = function ( modelName, instanceNo ) {
			var msg = 'Worker #' + instanceNo + ': Completed loading: ' + modelName + ' (#' + scope.wwDirector.objectsCompleted + ')';
			console.log( msg );
			scope.feedbackArray[ instanceNo ] = msg;
			scope.reportProgress( scope.feedbackArray.join( '\<br\>' ) );
		};
		var callbackMeshLoaded = function ( meshName, material ) {
			var replacedMaterial = null;

			if ( material != null && material.name === 'defaultMaterial' || meshName === 'Mesh_Mesh_head_geo.001' ) {
				replacedMaterial = material;
				replacedMaterial.color = new THREE.Color( Math.random(), Math.random(), Math.random() );
			}

			return replacedMaterial;
		};

		this.wwDirector.prepareWorkers(
			{
				completedLoading: callbackCompletedLoading,
				meshLoaded: callbackMeshLoaded
			},
			maxQueueSize,
			maxWebWorkers
		);
		console.log( 'Configuring WWManager with queue size ' + this.wwDirector.getMaxQueueSize() + ' and ' + this.wwDirector.getMaxWebWorkers() + ' workers.' );

		var models = [];
		models.push( {
			modelName: 'male02',
			dataAvailable: false,
			pathObj: '../../resource/obj/male02/',
			fileObj: 'male02.obj',
			pathTexture: '../../resource/obj/male02/',
			fileMtl: 'male02.mtl'
		} );

		models.push( {
			modelName: 'female02',
			dataAvailable: false,
			pathObj: '../../resource/obj/female02/',
			fileObj: 'female02.obj',
			pathTexture: '../../resource/obj/female02/',
			fileMtl: 'female02.mtl'
		} );

		models.push( {
			modelName: 'viveController',
			dataAvailable: false,
			pathObj: '../../resource/obj/vive-controller/',
			fileObj: 'vr_controller_vive_1_5.obj',
			scale: 400.0
		} );

		models.push( {
			modelName: 'cerberus',
			dataAvailable: false,
			pathObj: '../../resource/obj/cerberus/',
			fileObj: 'Cerberus.obj',
			scale: 50.0
		} );
		models.push( {
			modelName:'WaltHead',
			dataAvailable: false,
			pathObj: '../../resource/obj/walt/',
			fileObj: 'WaltHead.obj',
			pathTexture: '../../resource/obj/walt/',
			fileMtl: 'WaltHead.mtl'
		} );

		var pivot;
		var distributionBase = -500;
		var distributionMax = 1000;
		var modelIndex = 0;
		var model;
		var runParams;
		for ( var i = 0; i < maxQueueSize; i++ ) {

			modelIndex = Math.floor( Math.random() * 5 );
			model = models[ modelIndex ];

			pivot = new THREE.Object3D();
			pivot.position.set(
				distributionBase + distributionMax * Math.random(),
				distributionBase + distributionMax * Math.random(),
				distributionBase + distributionMax * Math.random()
			);
			if ( model.scale != null ) pivot.scale.set( model.scale, model.scale, model.scale );

			this.scene.add( pivot );

			model.sceneGraphBaseNode = pivot;

			runParams = new THREE.OBJLoader2.WWOBJLoader2.PrepDataFile(
				model.modelName, model.pathObj, model.fileObj, model.pathTexture, model.fileMtl, model.sceneGraphBaseNode, streamMeshes
			);
			this.wwDirector.enqueueForRun( runParams );
			this.allAssets.push( runParams );
		}

		this.wwDirector.processQueue();
	};

	WWParallels.prototype.clearAllAssests = function () {
		var ref;
		var scope = this;

		for ( var asset in this.allAssets ) {
			ref = this.allAssets[asset];

			var remover = function ( object3d ) {

				if ( object3d === ref.sceneGraphBaseNode ) {
					return;
				}
				console.log( 'Removing ' + object3d.name );
				scope.scene.remove( object3d );

				if ( object3d.hasOwnProperty( 'geometry' ) ) {
					object3d.geometry.dispose();
				}
				if ( object3d.hasOwnProperty( 'material' ) ) {

					var mat = object3d.material;
					if ( mat.hasOwnProperty( 'materials' ) ) {

						for ( var mmat in mat.materials ) {
							mat.materials[mmat].dispose();
						}
					}
				}
				if ( object3d.hasOwnProperty( 'texture' ) ) {
					object3d.texture.dispose();
				}
			};
			scope.scene.remove( ref.sceneGraphBaseNode );
			ref.sceneGraphBaseNode.traverse( remover );
			ref.sceneGraphBaseNode = null;
		}
		this.allAssets = [];
	};

	WWParallels.prototype.terminateManager = function () {
		this.wwDirector.deregister();
	};

	return WWParallels;

})();
