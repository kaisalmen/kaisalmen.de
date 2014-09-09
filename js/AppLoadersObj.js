/**
 * Created by Kai Salmen on 2014.09.04
 *
 * Separated OBJ loader from other loaders
 */
APPL.loaders.obj = {
    objLoader : null,
    mtlLoader : null,
    objMtlLoader : null,
    loadingCompleted : false
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
            //objRoot.scale.x = 0.05;
            //objRoot.scale.y = 0.05;
            //objRoot.scale.z = 0.05;
            //objRoot.rotation.x = - Math.PI / 2;
            //objRoot.position.y = 5;
            APPG.scenes.perspective.scene.add(objRoot);
            APPL.loaders.obj.functions.postLoad();
        });
    },
    parseInit : function (objFile, objContent, mtlFile, mtlContent) {
        APPL.loaders.obj.functions.parseMtl(mtlFile, mtlContent);
        APPL.loaders.obj.objMtlLoader.init(objContent);
        APPL.loaders.functions.logStart("Started OBJ parsing: " + objFile);
        return true;
    },
    getObjectCount : function() {
        return APPL.loaders.obj.objMtlLoader.getObjectCount();
    },

    isLoadingComplete : function() {
        return APPL.loaders.obj.objMtlLoader.isLoadingComplete();
    },
    parseExec : function() {
        var obj = APPL.loaders.obj.objMtlLoader.parse();
        return obj;
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
                    console.log("Object Count: " + APPL.loaders.objectCount + " (Name: " + child.name + " uuid: " + child.uuid + extraString);
                }
            });
        }
    }
}
