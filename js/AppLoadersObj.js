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
        APPL.loaders.obj.objLoader = new THREE.OBJLoader();
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
    parse : function (data) {
        APPL.loaders.functions.logStart("Started OBJ parsing...");
        var group = APPL.loaders.obj.objLoader.parse(data);
        APPL.loaders.obj.functions.postLoad(group);
    },
    parseMtl : function (data) {
        APPL.loaders.functions.logStart("Started MTL parsing...");
        APPL.loaders.obj.materialCreator = APPL.loaders.obj.mtlLoader.parse(data);
        APPL.loaders.obj.functions.postLoadMtl();
    },
    postLoad : function (child) {
        if (child !== null) {
            APPG.scenes.perspective.scene.add(child);
        }
        APPL.loaders.functions.logEnd("OBJ loader completed: ");
    },
    postLoadMtl : function () {
        APPL.loaders.functions.logEnd("MTL loader completed: ");
    }
}
