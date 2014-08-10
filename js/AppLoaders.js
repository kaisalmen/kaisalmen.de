/**
 * Created by Kai Salmen on 2014.08.10.
 *
 * Added three basic loading functions
 */
var APPL = {};

APPL.loaders = {
    manager : null,
    obj : null,
    sea3d : null,
    json : null,
    alloader : null,
    startTime : null,
    endTime : null
}
APPL.loaders.functions = {
    logStart : function () {
        APPL.loaders.startTime = new Date().getTime();
    },
    logEnd : function () {
        APPL.loaders.endTime = new Date().getTime();
        console.log("Load time: " + (APPL.loaders.endTime - APPL.loaders.startTime));
    }
}
APPL.loaders.obj = {
    mtlLoader : null,
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
        APPL.loaders.obj.mtlLoader = new THREE.OBJMTLLoader();
    },
    load : function (fileObj, fileObjMat) {
        APPL.loaders.functions.logStart();
        APPL.loaders.obj.mtlLoader.load(fileObj, fileObjMat, function (objRoot) {
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
            console.log("Loading OBJ objects is completed!");
            APPL.loaders.obj.functions.postLoad();
        });
    },
    postLoad : function () {
        console.log("Default post load completed.");
        APPL.loaders.functions.logEnd();
    }
}
APPL.loaders.sea3d = {
    loader : null
}
APPL.loaders.sea3d.functions = {
    init: function () {
        APPL.loaders.sea3d.loader = new THREE.SEA3D();
    },
    load : function (fileSea3d) {
        APPL.loaders.functions.logStart();
        APPL.loaders.sea3d.loader.onComplete = function( e ) {
            APPL.loaders.sea3d.functions.postLoad();
        }
        APPL.loaders.sea3d.loader.container = APPG.scenes.perspective.scene;

        // compatible mode
        APPL.loaders.sea3d.loader.parser = THREE.SEA3D.DEFAULT;
        APPL.loaders.sea3d.loader.load(fileSea3d);
    },
    postLoad: function () {
        // get camera from 3ds Max if exist
        // reset time for keyframe animation
        SEA3D.AnimationHandler.setTime( 0 );
        APPL.loaders.functions.logEnd();
    }
}

APPL.loaders.alloader = {
    loader : null
}
APPL.loaders.alloader.functions = {
    init: function () {
        APPL.loaders.alloader.loader = new THREE.ALLoader();
    },
    load : function (fileJson) {
        APPL.loaders.functions.logStart();
        APPL.loaders.alloader.loader.load(fileJson, APPL.loaders.alloader.functions.postLoad);
    },
    postLoad: function (myObject3d) {
        myObject3d.meshes.map(function(child){APPG.scenes.perspective.scene.add(child)})
        APPL.loaders.functions.logEnd();
    }
}