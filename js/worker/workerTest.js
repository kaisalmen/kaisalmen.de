/**
 * Created by Kai Salmen on 2014.09.04
 *
 * Separate OBJ loader
 */

var APPWWT = {}

APPWWT = {
    mtlFile : "Airstream.mtl",
    mtlContent : null,
    objFile : "Airstream.obj",
    objContent : null
}

function init() {
    APPWWT.worker = new Worker("../../js/webWorkerImpl.js");
    APPWWT.worker.addEventListener('message', function (e) {
        var data = e.data;
        if (data.blob) {
            console.log("Worker has blob" + data.blob.type + " " + data.blob.size);
        }
        else if (data.msg) {
            console.log(data.msg);
        }
        ;
    }, false);
}

function run () {
    APPWWT.worker.postMessage({"cmd": "init", "obj" : APPWWT.objContent, "objName" : APPWWT.objFile, "mtl" : APPWWT.mtlContent, "mtlName" : APPWWT.mtlFile});
    APPWWT.worker.postMessage({"cmd": "loadObj"});
}