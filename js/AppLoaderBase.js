/**
 * Created by Kai Salmen on 2014.08.10.
 *
 * Added three basic loading functions
 */
var APPL = {};

APPL.support = {
    zip : null
}
APPL.support.zip = {
    functions : null
}
APPL.support.zip.functions = {
    loadSingle : function (zip, filename, callback) {
        var file = zip.file(filename);
        console.log("Loading file: " + file.name);
        var fileContent = zip.file(file.name).asText();
        callback(fileContent);
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
}
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
    logEnd : function (prefix) {
        APPL.loaders.endTime = new Date().getTime();
        console.log(prefix + "Load time: " + (APPL.loaders.endTime - APPL.loaders.startTime));
    }
}
