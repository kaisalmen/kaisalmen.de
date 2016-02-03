/**
 * Created by Kai Salmen.
 */

"use strict";

KSX.apps.zerosouth.impl.PTV1Loader = (function () {

    function PTV1Loader(elementToBindTo) {
        this.sceneApp = new KSX.apps.core.SceneAppPerspective(this, "PTV1Loader", elementToBindTo, true);
        this.controls = new THREE.TrackballControls(this.sceneApp.getCamera());

        this.pathToObj = "../../resource/models/";
        this.fileObj = "PTV1.obj";
        this.fileZip = "PTV1.zip";
        this.fileMtl = "PTV1.mtl";

        this.loadDirectly = false;
        this.zipTools = new KSX.apps.tools.ZipTools();
        this.objectLoadingTools = new KSX.apps.tools.ObjLoadingTools();

        this.helper = null;
        this.worker = null;
    }

    PTV1Loader.prototype.initAsyncContent = function () {
        console.log("PTV1Loader.initAsyncContent is not required!");

        this.sceneApp.initSynchronuous();
    };

    PTV1Loader.prototype.initGL = function () {
        var renderer = this.sceneApp.getRenderer();
        var scene = this.sceneApp.getScene();
        var camera = this.sceneApp.getCamera();

        renderer.setClearColor(0x606060);
        camera.position.x = 600;
        camera.position.y = 450;
        camera.position.z = 350;

        this.controls.rotateSpeed = 0.5;
        this.controls.zoomSpeed = 1.0;
        this.controls.panSpeed = 0.8;

        this.controls.noZoom = false;
        this.controls.noPan = false;

        this.controls.staticMoving = true;
        this.controls.dynamicDampingFactor = 0.3;

        this.controls.keys = [ 65, 83, 68 ];
//        this.controls.addEventListener( 'change', render );

        var ambient = new THREE.AmbientLight(0x1011030);
        scene.add(ambient);

        var directionalLight1 = new THREE.DirectionalLight(0xd0d0d0);
        directionalLight1.position.set(-1000, 1000, 1000);
        scene.add(directionalLight1);

        var directionalLight2 = new THREE.DirectionalLight(0x909090);
        directionalLight2.position.set(1000, -1000, 1000);
        scene.add(directionalLight2);

        this.helper = new THREE.GridHelper(1000, 20);
        this.helper.setColors(0xFF4444, 0xB0B0B0);
        scene.add(this.helper);

        this.loadObj();
    };

    PTV1Loader.prototype.loadObj = function() {
        var scope = this;
        var adjustScene = function(rootGroup) {
            rootGroup.position.y = 20;
            rootGroup.position.z = 250;
            scope.sceneApp.getScene().add(rootGroup);
        };

        if (this.loadDirectly) {
            var callbackMtl = function (materials) {
                scope.objectLoadingTools.loadObject(scope.pathToObj, scope.fileObj, materials, adjustScene);
            };
            this.objectLoadingTools.loadMtl(this.pathToObj, this.fileMtl, callbackMtl);
        }
        else {
            var loadCallbackZip = function (binaryData) {
                scope.worker = new Worker("../../js/apps/tools/webWorker/WWUnzip.js");

                var unzipper = function (e) {
                    var arrayBuffer = e.data;
                    console.log(arrayBuffer.length);
                }
                scope.worker.addEventListener("message", unzipper, false);

                scope.worker.postMessage(binaryData, [binaryData]);

                //var dataAsTextObj = scope.zipTools.unzipFile(binaryData, scope.fileObj);
                //var dataAsTextMtl = scope.zipTools.unzipFile(binaryData, scope.fileMtl);

//                var sendUuint8Array = new TextEncoder(document.characterSet.toLowerCase()).encode(dataAsTextObj);
//                var sendArrayBuffer = sendUuint8Array.buffer;

                scope.worker = new Worker("../../js/apps/tools/webWorker/WWObjParser.js");
                var objReceptor = function (e) {
                    var arrayBuffer = e.data;
                    var decoder = new TextDecoder("utf-8");
                    var view = new DataView(arrayBuffer, 0, arrayBuffer.byteLength);
                    var objectAsString = decoder.decode(view);
                    var objects = JSON.parse(objectAsString);

                    console.log("Received object back from worker.");

                    var materials = scope.objectLoadingTools.parseMtl(dataAsTextMtl);

                    console.time("Brute Force");
                    var container = new THREE.Group();
                    var object = null;
                    for ( var i = 0, l = objects.length; i < l; i ++ ) {
                        object = objects[ i ];
                        var geometry = object.geometry;
                        var buffergeometry = new THREE.BufferGeometry();

                        buffergeometry.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array( geometry.vertices ), 3 ) );

                        if ( geometry.normals.length > 0 ) {
                            buffergeometry.addAttribute( 'normal', new THREE.BufferAttribute( new Float32Array( geometry.normals ), 3 ) );
                        }
                        else {
                            buffergeometry.computeVertexNormals();
                        }

                        if ( geometry.uvs.length > 0 ) {
                            buffergeometry.addAttribute( 'uv', new THREE.BufferAttribute( new Float32Array( geometry.uvs ), 2 ) );
                        }

                        var material;
                        if (materials !== null ) {
                            material = materials.create( object.material.name );
                        }

                        if ( !material ) {
                            material = new THREE.MeshPhongMaterial();
                            material.name = object.material.name;
                        }

                        material.shading = object.material.smooth ? THREE.SmoothShading : THREE.FlatShading;

                        var mesh = new THREE.Mesh( buffergeometry, material );
                        mesh.name = object.name;

                        container.add( mesh );
                    }
                    console.timeEnd("Brute Force");

                    adjustScene(container);
                };
                scope.worker.addEventListener("message", objReceptor, false);

                //scope.worker.postMessage(sendArrayBuffer, [sendArrayBuffer]);
                scope.worker.postMessage(binaryData, [binaryData]);


                //var rootGroup = scope.objectLoadingTools.parseObj(dataAsTextObj, dataAsTextMtl);
                //adjustScene(rootGroup);
            };
            this.zipTools.loadBinaryData(this.pathToObj + this.fileZip, loadCallbackZip);
        }
    };

    PTV1Loader.prototype.render = function() {
        this.controls.update();
    };

    PTV1Loader.prototype.resizeDisplayGL = function() {
        this.controls.handleResize();
    };

    return PTV1Loader;
})();