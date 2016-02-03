/**
 * Created by Kai Salmen.
 */

"use strict";

KSX.apps.tools.ZipTools = (function () {

    function ZipTools() {
        this.hasData = false;
    }

    ZipTools.prototype.unzipFile = function (binaryData, filename) {
        console.time("unzipFile");
        var zip = new JSZip(binaryData);
        var file = zip.file(filename);
        var dataAsText = zip.file(file.name).asBinary();
        console.timeEnd("unzipFile");
        return dataAsText;
    };

    ZipTools.prototype.loadBinaryData = function (zipFile, loadCallback) {
        var scope = this;
        /*
        if (contentFiles === null || contentFiles.length === 0) {
            console.log("Unable to load files from zip file '" + zipFile + "' as file array is empty. Aborting...");
            return;
        }

        if (callbacks === null || callbacks.length === 0) {
            console.log("Unable to load files from zip file '" + zipFile + "' as callbacks array is empty. Aborting...");
            return;
        }

        if (contentFiles.length !== callbacks.length) {
            console.log("Content files and callback count do not match. Aborting...");
            return;
        }
*/
        console.time("getBinaryContent");
        JSZipUtils.getBinaryContent(zipFile,
            function (err, binaryData) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("Retrieved binary data of zip file: " + zipFile);

                    scope.hasData = true;
                    console.timeEnd("getBinaryContent");
                    loadCallback(binaryData);
                }
            }
        );
    };

    return ZipTools;
})();