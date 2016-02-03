/**
 * Created by Kai Salmen.
 */

"use strict";

var wwParseObj = function (e) {

    importScripts("../../../lib/ext/jszip.js");

    console.time("unzipFile");

    var inputArrayBuffer = e.data;
    var zip = new JSZip(inputArrayBuffer);
    var file = zip.file("PTV1.obj");
    var outputArrayBuffer = zip.file(file.name).asBinary();

    console.timeEnd("unzipFile");

    self.postMessage(outputArrayBuffer, [outputArrayBuffer]);
};

self.addEventListener('message', wwParseObj, false);