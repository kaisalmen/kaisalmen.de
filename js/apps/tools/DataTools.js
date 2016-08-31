/**
 * @author Kai Salmen / www.kaisalmen.de
 */

'use strict';

KSX.apps.tools.DataTools = (function () {

    function DataTools() {
    }

    DataTools.prototype.dataURItoBlob = function(dataURI, dataTYPE) {
        var decodedURI = dataURI.split(',');
        if (decodedURI.length === 2) {
            var binary = atob(decodedURI[1]);
            var array = new Array(binary.length);
            for (var i = 0; i < binary.length; i++) {
                array[i] = binary.charCodeAt(i);
            }
            return new Blob([new Uint8Array(array)], {type: dataTYPE});
        }
        else {
            return undefined;
        }
    };

    return DataTools;
})();
