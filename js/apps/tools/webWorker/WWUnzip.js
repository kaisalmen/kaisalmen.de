/**
 * Created by Kai Salmen.
 */

"use strict";

var zip = null;

var wwParseObj = function (e) {

    importScripts("../../../lib/ext/jszip.js");

    var payload = e.data;
    if (payload.cmd) {
        switch (payload.cmd) {
            case "file":
                var filename = payload.filename;

                console.time("Worker Unzip: Deflating file: " + filename);
                var file = zip.file(filename);
                var fileAsString = zip.file(file.name).asBinary();
                console.timeEnd("Worker Unzip: Deflating file: " + filename);

                if (payload.encoding === "text") {
                    self.postMessage({"text": fileAsString});
                }
                else if (payload.encoding === "arraybuffer") {
                    console.time("Worker Unzip: Encoding: " + filename);
                    var outputUint8Array = new TextEncoder("utf-8").encode(fileAsString);
                    var outputArrayBuffer = outputUint8Array.buffer;
                    console.timeEnd("Worker Unzip: Encoding: " + filename);

                    self.postMessage(outputArrayBuffer, [outputArrayBuffer]);
                }
                else {
                    console.error("Received unknown encoding: " + payload.encoding);
                }
                break;
            case "clean":
                zip = null;
                break;
            default:
                console.error("Received unknown command: " + payload.cmd);
                break;
        }
    }
    else {
        zip = new JSZip(payload);
    }
};

self.addEventListener('message', wwParseObj, false);