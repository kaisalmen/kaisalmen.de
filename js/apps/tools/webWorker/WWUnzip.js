/**
 * Created by Kai Salmen.
 */

"use strict";

var filename = "";

var wwParseObj = function (e) {

    importScripts("../../../lib/ext/jszip.js");
    importScripts("../../../lib/ext/three.js");

    var payload = e.data;
    if (payload.filename) {
        filename = payload.filename;
    }
    else {
        var inputArrayBuffer = payload;

        console.time("Worker Unzip: unzipFile");
        var zip = new JSZip(inputArrayBuffer);
        var file = zip.file(filename);
        var fileAsString = zip.file(file.name).asBinary();
        console.timeEnd("Worker Unzip: unzipFile");

        console.time("Worker Unzip: Text encode");
        var outputUint8Array = new TextEncoder("utf-8").encode(fileAsString);
        var outputArrayBuffer = outputUint8Array.buffer;
        console.timeEnd("Worker Unzip: Text encode");

        // outputArrayBuffer is a plain string here
        self.postMessage(outputArrayBuffer, [outputArrayBuffer]);
    }

};

self.addEventListener('message', wwParseObj, false);