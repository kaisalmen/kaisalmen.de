/**
 * Created by Kai Salmen on 2014.09.04
 *
 * Web Worker for async obj loading
 */

self.addEventListener('message', function(e) {
    var data = e.data;
    switch (data.cmd) {
        case 'test':
            console.log("Worker exec: test");
            self.postMessage({"msg" : "Worker: Test Completed"});
            break;
        case 'load':
            console.log("Worker exec: load");
            var obj = null;
            var blob = new Blob([obj]);
            self.postMessage({"blob" : blob});
            break;
        case 'status':
            console.log("Worker exec: status");
            self.postMessage({"msg" : "Worker: My status is nominal!"});
            break;
        default:
            self.postMessage({"msg" : "Unknown command: " + data.msg});
            break;
    };
}, false);