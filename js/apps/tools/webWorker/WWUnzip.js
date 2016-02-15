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
                var file = zip.file(filename);

                self.postMessage({"cmd": "feedback", "filename": file.name});

                if (payload.encoding === "text") {
                    console.time("Worker Unzip: Deflating file as text: " + filename);

                    var fileAsString = zip.file(file.name).asBinary();
                    self.postMessage({"text": fileAsString});

                    console.timeEnd("Worker Unzip: Deflating file as text: " + filename);
                }
                else if (payload.encoding === "arraybuffer") {
                    console.time("Worker Unzip: Deflating file as unit8array: " + filename);

                    var outputUint8Array;
                    if (JSZip.support.uint8array) {
                        console.log("Worker Unzip: Using direct uint8array encoding");
                        outputUint8Array = zip.file(file.name).asUint8Array();
                    }
                    else {
                        console.log("Worker Unzip: Using direct text encoding");
                        var fileAsString = zip.file(file.name).asBinary();
                        outputUint8Array = new TextEncoder("utf-8").encode(fileAsString);
                    }
                    var outputArrayBuffer = outputUint8Array.buffer;

                    console.timeEnd("Worker Unzip: Deflating file as unit8array: " + filename);

                    self.postMessage(outputArrayBuffer, [outputArrayBuffer]);
                }
                else {
                    console.error("Worker Unzip: Received unknown encoding: " + payload.encoding);
                }
                break;
            case "clean":
                zip = null;
                break;
            default:
                console.error("Worker Unzip: Received unknown command: " + payload.cmd);
                break;
        }
    }
    else {
        zip = new JSZip(payload);
    }
};

self.addEventListener('message', wwParseObj, false);