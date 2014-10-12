/**
 * Created by Kai Salmen on 2014.08.10.
 *
 * Added three basic loading functions
 */
var APPL = {};

APPL.support = {
    zip : null,
    filesystem : null,
    dom : null,
    load : null
};
APPL.support.dom = {
    divLoad : null
};
APPL.support.load = {
    params : null,
    functions : null
};
APPL.support.load.params = {
    visible : true,
    updateTotalObjCount : true,
    countTotal: 0,
    countCurrent: 0,
    textContent: "Please wait while file is loading..."
};
APPL.support.load.functions = {
    init : function() {
        APPG.textBuffer.functions.addNode("loadCounter", APPL.support.load.params.textContent);
    },
    updateTextContent : function() {
        APPG.textBuffer.functions.updateContent("loadCounter", APPL.support.load.params.textContent);
    },
    setTotalObjectCount : function(countTotal) {
        APPL.support.load.params.countTotal = countTotal;
        APPL.support.load.params.textContent = "Please wait while file is loading... Object count: 0 of " + countTotal;
    },
    updateCurrentObjectCount : function(countCurrent) {
        APPL.support.load.params.countCurrent = countCurrent;
        APPL.support.load.params.textContent = "Please wait while file is loading... Object count: " + countCurrent + " of " + APPL.support.load.params.countTotal;
    },
    render : function () {
        if (APPL.support.load.params.visible) {
            APPG.textBuffer.functions.processTextGroups("loadCounter", -500, 400, 18, null, new THREE.Vector3(0.75, 0.75, 0.75));
        }
    },
    hide : function() {
        APPL.support.load.params.visible = false;
        APPG.textBuffer.functions.removeNode("loadCounter");
        APPG.textBuffer.functions.updateBaseNode();
    }
};
APPL.support.zip = {
    functions : null
};
APPL.support.zip.functions = {
    loadSingle : function (zip, filename, callback) {
        var file = zip.file(filename);
        console.log("Loading file: " + file.name);
        var fileContent = zip.file(file.name).asText();
        callback(file.name, fileContent);
    },
    loadZip : function (zipFile, contentFiles, callback) {
        var length = contentFiles.length;
        JSZipUtils.getBinaryContent(zipFile,
            function (err, data) {
                if (err) {
                    console.log(err);
                }
                else {
                    var zip = new JSZip(data);
                    for (var i = 0; i < length; i++) {
                        APPL.support.zip.functions.loadSingle(zip, contentFiles[i], callback);
                    }
                }
            }
        );
    },
    storeFilesFromZip : function(zipFile, contentFiles, storageDir, resultCallback) {
        if (APPL.support.filesystem.functions.ready()) {
            APPL.support.zip.functions.loadZip(zipFile, contentFiles, function(filename, content) {
                var queue = APPL.support.filesystem.functions.createQueue();
                APPL.support.filesystem.functions.writeFile(queue, storageDir, filename, content);
                APPL.support.filesystem.functions.execute(queue, resultCallback);
            });
        }
        else {
            console.log("Unable to start: No local storage available.");
        }
        console.log("Done with file loading.")
    },
    loadZipCallbacks : function (zipFile, contentFiles, callbacks) {
        var length = contentFiles.length;
        JSZipUtils.getBinaryContent(zipFile,
            function (err, data) {
                if (err) {
                    console.log(err);
                }
                else {
                    var zip = new JSZip(data);
                    for (var i = 0; i < length; i++) {
                        APPL.support.zip.functions.loadSingle(zip, contentFiles[i], callbacks[i]);
                    }
                }
            }
        );
    }
};
APPL.support.filesystem = {
    functions : null,
    storage : null
};
APPL.support.filesystem.functions = {
    ready: function() {
        if (APPL.support.filesystem.storage !== null) {
            return true;
        }
        else {
           return false;
        }
    },
    createTempStorage : function(sizeMb) {
        try {
            APPL.support.filesystem.storage = new FSO(1024 * 1024 * sizeMb, false);
        }
        catch (e) {
            alert("This browser does not support File System API! Please use Google Chrome");
            return false;
        }
        return true;
    },
    createQueue : function() {
        return APPL.support.filesystem.storage.createQueue();
    },
    createDir : function(queue, name) {
        queue.mkdir(name);
    },
    writeFile : function(queue, path, filename, content, callback) {
        queue.write(path + '/' + filename, content, callback);
    },
    readFile : function(queue, path, filename, callback) {
        return queue.read(path + '/' + filename, callback);
    },
    execute : function(queue, successCallback, failureCallback) {
        if (successCallback === null || successCallback === undefined) {
            successCallback = function () {
                console.log("FSO execute succeeded!");
            }
        }
        if (failureCallback === null || failureCallback === undefined) {
            failureCallback = function (args) {
                console.log("FSO execute failed! Args: " + args);
            }
        }
        queue.execute(successCallback, failureCallback);
    },
    toURL : function(path, filename) {
        return APPL.support.filesystem.storage.toURL(path + '/' + filename);
    }
};
APPL.loaders = {
    manager : null,
    obj : null,
    sea3d : null,
    json : null,
    alloader : null,
    startTime : null,
    endTime : null,
    objectCount : 0
};
APPL.loaders.functions = {
    logStart : function (msg) {
        APPL.loaders.startTime = new Date().getTime();
        console.log(msg);
    },
    logEnd : function (prefix) {
        APPL.loaders.endTime = new Date().getTime();
        console.log(prefix + "Load time: " + (APPL.loaders.endTime - APPL.loaders.startTime));
    },
    init : function () {
        if (APPL.loaders.manager === null) {
            APPL.loaders.manager = new THREE.LoadingManager();
            APPL.loaders.manager.onProgress = function (item, loaded, total) {
                console.log(item, loaded, total);
            };
        }
    }
};
