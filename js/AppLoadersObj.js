/**
 * Created by Kai Salmen on 2014.09.04
 *
 * Separated OBJ loader from other loaders
 */
APPL.loaders.obj = {
    objLoader : null,
    mtlLoader : null,
    objMtlLoader : null,
    loadStart : null,
    loadEnd : null
}
APPL.loaders.obj.functions = {
    init : function () {
        if (APPL.loaders.manager == null) {
            APPL.loaders.manager = new THREE.LoadingManager();
            APPL.loaders.manager.onProgress = function (item, loaded, total) {
                console.log(item, loaded, total);
            };
        }
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
            APPL.loaders.obj.functions.postLoad(null);
        });
    },
    parse : function (filename, data) {
        APPL.loaders.functions.logStart("Started OBJ parsing: " + filename);
        var objRoot = APPL.loaders.obj.objMtlLoader.parse(data);

        objRoot.traverse(function (child) {
            if (child instanceof THREE.Mesh && child.material !== null) {
                var orgMaterial = APPL.loaders.obj.materialCreator.create(child.material.name);
                child.material = orgMaterial;
                console.log("Applying material: " + child.material.name + " to (name: " + child.name + " uuid: " + child.uuid);
            }
        });

        APPL.loaders.obj.functions.postLoad(objRoot);
    },
    parseMtl : function (filename, data) {
        APPL.loaders.functions.logStart("Started MTL parsing: " + filename);
        APPL.loaders.obj.materialCreator = APPL.loaders.obj.mtlLoader.parse(data);
        APPL.loaders.obj.functions.postLoadMtl();
    },
    postLoad : function (objRoot) {
        if (objRoot !== null) {
            APPG.scenes.perspective.scene.add(objRoot);
        }
        APPL.support.dom.functions.hide();
        APPL.loaders.functions.logEnd("OBJ loader completed: ");
    },
    postLoadMtl : function () {
        APPL.loaders.functions.logEnd("MTL loader completed: ");
    }
}
