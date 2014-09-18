/**
 * Created by Kai Salmen on 2014.09.04
 *
 * Separated OBJ loader from other loaders
 */
APPL.loaders.obj = {
    objLoader : null,
    mtlLoader : null,
    objMtlLoader : null,
    loadingCompleted : false,
    dataAvailable : false,
    readLinesPerFrame : 500,
    minReadLinesPerFrame : 75,
    maxReadLinesPerFrame : 5000,
    fpsCheckTime : 0,
    fpsRef : 0,
    minFps : 25
}
APPL.loaders.obj.functions = {
    init : function (objAttachedPoint) {
        APPL.loaders.functions.init();
        APPL.loaders.obj.mtlLoader = new THREE.MTLLoader();
        APPL.loaders.obj.objMtlLoader = new THREE.OBJMTLLoader();
        APPL.loaders.obj.materialCreator = null;
    },
    load : function (fileObj, fileObjMat) {
        APPL.loaders.functions.logStart("Started OBJ loading...");
        APPL.loaders.obj.objMtlLoader.load(fileObj, fileObjMat, function (objRoot) {
            objRoot.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    // child.material = materialMaster;
                }
            });
            APPG.scenes.perspective.scene.add(objRoot);
            APPL.loaders.obj.functions.postLoad();
        });
    },
    parseInit : function (objFile, objContent, mtlFile, mtlContent) {
        APPL.loaders.obj.functions.parseMtl(mtlFile, mtlContent);
        APPL.loaders.obj.objMtlLoader.init(objContent);
        APPL.loaders.functions.logStart("Started OBJ parsing: " + objFile);
    },
    calcObjectCount : function(ocLinesPerFrame) {
        return APPL.loaders.obj.objMtlLoader.calcObjectCount(ocLinesPerFrame);
    },
    parseExec : function(linesPerFrame) {
        return APPL.loaders.obj.objMtlLoader.parse(linesPerFrame);
    },
    parseMtl : function (filename, data) {
        APPL.loaders.functions.logStart("Started MTL parsing: " + filename);
        APPL.loaders.obj.materialCreator = APPL.loaders.obj.mtlLoader.parse(data);
        APPL.loaders.functions.logEnd("MTL loader completed: ");
    },
    postLoad : function () {
        if (!APPL.loaders.obj.loadingCompleted) {
            APPL.support.dom.divLoad.functions.hide();
            APPL.loaders.functions.logEnd("OBJ loader completed: ");
            APPL.loaders.obj.loadingCompleted = true;
        }
    },
    handleObjLoading : function (baseObjGroup) {
        if (APPL.support.dom.divLoad.updateTotalObjCount && APPL.loaders.obj.functions.calcObjectCount(10000)) {
            // final update
            APPL.support.dom.divLoad.functions.setTotalObjectCount(APPL.loaders.obj.objMtlLoader.getObjectCount());
            APPL.support.dom.divLoad.updateTotalObjCount = false;
        }

        if (APPL.support.dom.divLoad.updateTotalObjCount) {
            APPL.support.dom.divLoad.functions.setTotalObjectCount(APPL.loaders.obj.objMtlLoader.getObjectCount());
        }
        var now = new Date().getTime();
        if (now > APPL.loaders.obj.fpsCheckTime + 1000) {

            APPL.loaders.obj.fpsCheckTime = now;
            var reference = APPG.frameNumber - APPL.loaders.obj.fpsRef;
            var old = APPL.loaders.obj.readLinesPerFrame;

            if (reference < APPL.loaders.obj.minFps) {
                APPL.loaders.obj.readLinesPerFrame = parseInt(APPL.loaders.obj.readLinesPerFrame / 2);
                if (APPL.loaders.obj.readLinesPerFrame < APPL.loaders.obj.minReadLinesPerFrame) {
                    APPL.loaders.obj.readLinesPerFrame = APPL.loaders.obj.minReadLinesPerFrame;
                }
                if (APPL.loaders.obj.readLinesPerFrame !== APPL.loaders.obj.minReadLinesPerFrame || old !== APPL.loaders.obj.readLinesPerFrame) {
                    console.log("New lines per frame: " + APPL.loaders.obj.readLinesPerFrame);
                }
            }
            else {
                APPL.loaders.obj.readLinesPerFrame *= 2;
                if (APPL.loaders.obj.readLinesPerFrame > APPL.loaders.obj.maxReadLinesPerFrame) {
                    APPL.loaders.obj.readLinesPerFrame = APPL.loaders.obj.maxReadLinesPerFrame;
                }
                if (APPL.loaders.obj.readLinesPerFrame !== APPL.loaders.obj.maxReadLinesPerFrame || old !== APPL.loaders.obj.readLinesPerFrame) {
                    console.log("New lines per frame: " + APPL.loaders.obj.readLinesPerFrame);
                }
            }
            console.log("Frames per second in last interval: " + reference + " (Frames: " + APPG.frameNumber + ")");
            APPL.loaders.obj.fpsRef = APPG.frameNumber;
        }

        if (!APPL.loaders.obj.objMtlLoader.isLoadingComplete()) {
            var obj = APPL.loaders.obj.functions.parseExec(APPL.loaders.obj.readLinesPerFrame);
            if (obj !== null) {
                APPL.loaders.obj.functions.addToScene(baseObjGroup, obj);
                APPL.support.dom.divLoad.functions.updateCurrentObjectCount(APPL.loaders.objectCount);
            }
        }
        else {
            APPL.loaders.obj.functions.postLoad();
            // everything was loaded
            APPL.loaders.obj.dataAvailable = false;
        }
    },
    addToScene : function(attachTo, object) {
        if (object instanceof THREE.Object3D && object.children !== null && object.children.length > 0) {
            object.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    attachTo.add(child);
                    var extraString = "";
                    if (child.material !== null) {
                        var orgMaterial = APPL.loaders.obj.materialCreator.create(child.material.name);
                        child.material = orgMaterial;
                        if (child.material.name !== null && child.material.name !== "") {
                            extraString = " Applying material: " + child.material.name;
                        }
                    }
                    APPL.loaders.objectCount++;
//                    console.log("Object Count: " + APPL.loaders.objectCount + " (Name: " + child.name + " uuid: " + child.uuid + extraString);
                }
            });
        }
    }
}
