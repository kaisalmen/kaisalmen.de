/**
 * Created by Kai Salmen on 2014.09.04
 *
 * Web Worker for async obj loading
 */

var WWOBJ = {
    obj: null,
    objName: null,
    mtl: null,
    mtlName: null,
    mtlLoader: null,
    objMtlLoader: null,
    materialCreator: null
}
self.addEventListener('message', function(e) {
    var data = e.data;
    switch (data.cmd) {
        case 'init':
            console.log("Worker: init");
            importScripts("../../libs/ext/three.min.js");
            importScripts("../../libs/ext/MTLLoader.js");
            importScripts("../../libs/mod/OBJMTLLoader.js");
            importScripts("../../js/AppLoaderBase.js");
            importScripts("../../js/AppLoadersObj.js");

            WWOBJ.objName = data.objName;
            WWOBJ.obj = data.obj;
            WWOBJ.mtlName = data.mtlName;
            WWOBJ.mtl = data.mtl;

            APPL.loaders.obj.functions.init();
            APPL.loaders.functions.logStart("Started MTL parsing: " + WWOBJ.mtlName);
            APPL.loaders.obj.materialCreator = APPL.loaders.obj.mtlLoader.parse(WWOBJ.mtl);
            APPL.loaders.functions.logEnd("MTL loader completed: ");

            APPL.loaders.obj.objMtlLoader.init(WWOBJ.obj);

            //ObjectEx
            //WWOBJ.mtlLoader.parse(WWOBJ.mtl);
            //WWOBJ.OBJMTLLoader.init(WWOBJ.obj);
            //WWOBJ.loaderRef.functions.logEnd("MTL loader completed: ");

            self.postMessage({"msg" : "Worker: Init Completed"});
        case 'loadObj':
            APPL.loaders.functions.logStart("Started OBJ parsing: " + WWOBJ.objName);
            var obj = APPL.loaders.obj.objMtlLoader.parse();
            var blob = new Blob([obj]);
            self.postMessage({"blob" : blob});
            break;
        case 'status':
            self.postMessage({"msg" : "Worker: Status:"});
            break;
        default:
            self.postMessage({"msg" : "Unknown command: " + data.msg});
    };
}, false);