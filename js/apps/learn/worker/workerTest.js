/**
 * Created by Kai Salmen
 */

"use strict";

KSX.apps.learn.worker.WWTest = (function () {

    function WWTest() {
        this.worker = null;
    }

    WWTest.prototype.init = function () {
        this.worker = new Worker("../../js/apps/learn/worker/workerTestImpl.js");
        var action = function (e) {
            var data = e.data;
            if (data.blob) {
                console.log("Worker has blob of type '" + data.blob.type + "' with size: " + data.blob.size);
            }
            else if (data.msg) {
                console.log("WWTest received message: " + data.msg);
            }
        };
        this.worker.addEventListener('message', action, false);
    };

    WWTest.prototype.run = function () {
        this.worker.postMessage({"cmd": "test"});
        this.worker.postMessage({"cmd": "load"});
        this.worker.postMessage({"cmd": "status"});
    };

    return WWTest;
})();


$(document).ready(function () {
    console.log("Document is ready starting web worker test...");
    var wwTest = new KSX.apps.learn.worker.WWTest();
    wwTest.init();
    wwTest.run();
});