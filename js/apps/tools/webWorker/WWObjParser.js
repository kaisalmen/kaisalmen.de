/**
 * Created by Kai Salmen.
 */

"use strict";

var objects = [];
var object;
var foundObjects = false;
var vertices = [];
var normals = [];
var uvs = [];

// v float float float
var vertex_pattern = /^v\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)/;

// vn float float float
var normal_pattern = /^vn\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)/;

// vt float float
var uv_pattern = /^vt\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)/;

// f vertex vertex vertex ...
var face_pattern1 = /^f\s+(-?\d+)\s+(-?\d+)\s+(-?\d+)(?:\s+(-?\d+))?/;

// f vertex/uv vertex/uv vertex/uv ...
var face_pattern2 = /^f\s+((-?\d+)\/(-?\d+))\s+((-?\d+)\/(-?\d+))\s+((-?\d+)\/(-?\d+))(?:\s+((-?\d+)\/(-?\d+)))?/;

// f vertex/uv/normal vertex/uv/normal vertex/uv/normal ...
var face_pattern3 = /^f\s+((-?\d+)\/(-?\d+)\/(-?\d+))\s+((-?\d+)\/(-?\d+)\/(-?\d+))\s+((-?\d+)\/(-?\d+)\/(-?\d+))(?:\s+((-?\d+)\/(-?\d+)\/(-?\d+)))?/;

// f vertex//normal vertex//normal vertex//normal ...
var face_pattern4 = /^f\s+((-?\d+)\/\/(-?\d+))\s+((-?\d+)\/\/(-?\d+))\s+((-?\d+)\/\/(-?\d+))(?:\s+((-?\d+)\/\/(-?\d+)))?/;

var object_pattern = /^[og]\s+(.+)/;

var smoothing_pattern = /^s\s+(\d+|on|off)/;

var objectCount = 0;
var objectCountRun = 0;

function addObject(name) {

    var geometry = {
        vertices: [],
        normals: [],
        uvs: []
    };

    var material = {
        name: '',
        smooth: true
    };

    object = {
        name: name,
        geometry: geometry,
        material: material
    };

    objects.push(object);

}

function parseVertexIndex(value) {

    var index = parseInt(value);

    return ( index >= 0 ? index - 1 : index + vertices.length / 3 ) * 3;

}

function parseNormalIndex(value) {

    var index = parseInt(value);

    return ( index >= 0 ? index - 1 : index + normals.length / 3 ) * 3;

}

function parseUVIndex(value) {

    var index = parseInt(value);

    return ( index >= 0 ? index - 1 : index + uvs.length / 2 ) * 2;

}

function addVertex(a, b, c) {

    object.geometry.vertices.push(
        vertices[a], vertices[a + 1], vertices[a + 2],
        vertices[b], vertices[b + 1], vertices[b + 2],
        vertices[c], vertices[c + 1], vertices[c + 2]
    );

}

function addNormal(a, b, c) {

    object.geometry.normals.push(
        normals[a], normals[a + 1], normals[a + 2],
        normals[b], normals[b + 1], normals[b + 2],
        normals[c], normals[c + 1], normals[c + 2]
    );

}

function addUV(a, b, c) {

    object.geometry.uvs.push(
        uvs[a], uvs[a + 1],
        uvs[b], uvs[b + 1],
        uvs[c], uvs[c + 1]
    );

}

function addFace(a, b, c, d, ua, ub, uc, ud, na, nb, nc, nd) {

    var ia = parseVertexIndex(a);
    var ib = parseVertexIndex(b);
    var ic = parseVertexIndex(c);
    var id;

    if (d === undefined) {

        addVertex(ia, ib, ic);

    } else {

        id = parseVertexIndex(d);

        addVertex(ia, ib, id);
        addVertex(ib, ic, id);

    }

    if (ua !== undefined) {

        ia = parseUVIndex(ua);
        ib = parseUVIndex(ub);
        ic = parseUVIndex(uc);

        if (d === undefined) {

            addUV(ia, ib, ic);

        } else {

            id = parseUVIndex(ud);

            addUV(ia, ib, id);
            addUV(ib, ic, id);

        }

    }

    if (na !== undefined) {

        ia = parseNormalIndex(na);
        ib = parseNormalIndex(nb);
        ic = parseNormalIndex(nc);

        if (d === undefined) {

            addNormal(ia, ib, ic);

        } else {

            id = parseNormalIndex(nd);

            addNormal(ia, ib, id);
            addNormal(ib, ic, id);
        }
    }
}

var postObject = function (object, count) {
//        console.time("Worker Obj: BufferGeometry building");
    var geometry = object.geometry;

    // init
    var transferableObject = null;
    self.postMessage({"cmd": "reset"});

    self.postMessage({"cmd": "name", "meshName" : object.name, "count" : count});

    self.postMessage({"cmd": "position"});
    transferableObject = new Float32Array(geometry.vertices);
    delete geometry.vertices;
    self.postMessage(transferableObject, [transferableObject.buffer]);

    if ( geometry.normals.length > 0 ) {
        self.postMessage({"cmd": "normal"});
        transferableObject = new Float32Array(geometry.normals);
        delete geometry.normals;
        self.postMessage(transferableObject, [transferableObject.buffer]);
    }
    else {
        console.log("Warning no normals have been defined.");
    }

    if ( geometry.uvs.length > 0 ) {
        self.postMessage({"cmd": "uv"});
        transferableObject = new Float32Array(geometry.uvs);
        delete geometry.uvs;
        self.postMessage(transferableObject, [transferableObject.buffer]);
    }

    self.postMessage({"cmd": "material", "material": object.material.name, "smooth" : object.material.smooth});
    self.postMessage({"cmd": "ready"});
//        console.timeEnd("Worker Obj: BufferGeometry building");
};

var calcObjectCount = function (line) {
    if (object_pattern.exec(line) !== null) {
        objectCount++;
    }
};

var decodeLines = function (arrayBuffer, processLineCallback) {
    var view = new Uint8Array(arrayBuffer);
    var line = "";

    var code = 0;
    var char;
    for (var i = 0; i < view.length; i++) {
        code = view[i];
        char = String.fromCharCode(code);

        if (code === 10 || code === 13) {
            processLineCallback(line);
            line = "";
        }
        else {
            line += char;
        }
    }
};


var parseSingleLine = function (line) {
    line = line.trim();

    var result;

    if (line.length === 0 || line.charAt(0) === '#') {

    } else if (( result = vertex_pattern.exec(line) ) !== null) {

        // ["v 1.0 2.0 3.0", "1.0", "2.0", "3.0"]

        vertices.push(
            parseFloat(result[1]),
            parseFloat(result[2]),
            parseFloat(result[3])
        );

    } else if (( result = normal_pattern.exec(line) ) !== null) {

        // ["vn 1.0 2.0 3.0", "1.0", "2.0", "3.0"]

        normals.push(
            parseFloat(result[1]),
            parseFloat(result[2]),
            parseFloat(result[3])
        );

    } else if (( result = uv_pattern.exec(line) ) !== null) {

        // ["vt 0.1 0.2", "0.1", "0.2"]

        uvs.push(
            parseFloat(result[1]),
            parseFloat(result[2])
        );

    } else if (( result = face_pattern1.exec(line) ) !== null) {

        // ["f 1 2 3", "1", "2", "3", undefined]

        addFace(
            result[1], result[2], result[3], result[4]
        );

    } else if (( result = face_pattern2.exec(line) ) !== null) {

        // ["f 1/1 2/2 3/3", " 1/1", "1", "1", " 2/2", "2", "2", " 3/3", "3", "3", undefined, undefined, undefined]

        addFace(
            result[2], result[5], result[8], result[11],
            result[3], result[6], result[9], result[12]
        );

    } else if (( result = face_pattern3.exec(line) ) !== null) {

        // ["f 1/1/1 2/2/2 3/3/3", " 1/1/1", "1", "1", "1", " 2/2/2", "2", "2", "2", " 3/3/3", "3", "3", "3", undefined, undefined, undefined, undefined]

        addFace(
            result[2], result[6], result[10], result[14],
            result[3], result[7], result[11], result[15],
            result[4], result[8], result[12], result[16]
        );

    } else if (( result = face_pattern4.exec(line) ) !== null) {

        // ["f 1//1 2//2 3//3", " 1//1", "1", "1", " 2//2", "2", "2", " 3//3", "3", "3", undefined, undefined, undefined]

        addFace(
            result[2], result[5], result[8], result[11],
            undefined, undefined, undefined, undefined,
            result[3], result[6], result[9], result[12]
        );

    } else if (( result = object_pattern.exec(line) ) !== null) {

        // o object_name
        // or
        // g group_name

        var name = result[1].trim();

        if (!foundObjects) {
            foundObjects = true;
            object.name = name;
        }
        else {
            if (object !== null) {
                var lastObject = object;
                // Here a new object is found. It can be sent over
                objectCountRun++;
                postObject(object, objectCountRun);
            }
            addObject(name);
        }

    } else if (/^usemtl /.test(line)) {

        // material

        object.material.name = line.substring(7).trim();

    } else if (/^mtllib /.test(line)) {

        // mtl file

    } else if (( result = smoothing_pattern.exec(line) ) !== null) {

        // smooth shading

        object.material.smooth = result[1] !== "0" && result[1] !== "off";

    } else {
        throw new Error("Unexpected line: " + line);
    }
};

var useTextDecoder = false;

var wwParseObj = function (e) {

    // fast-check (cmd)
    if (e.data.useTextDecoder !== undefined) {
        useTextDecoder = e.data.useTextDecoder;
    }
    else {
        var inputArrayBuffer = e.data;

        if (useTextDecoder) {
            console.log("Worker Obj: Using TextDecoder");

            console.time("Worker Obj: Overall Parsing Time");
            var decoder = new TextDecoder("utf-8");
            var view = new DataView(inputArrayBuffer, 0, inputArrayBuffer.byteLength);
            var text = decoder.decode(view);

            var lines = text.split('\n');

            console.time("Worker Obj: Counting all objects");
            for (var i = 0; i < lines.length; i++) {
                var line = lines[i];
                calcObjectCount(line);
            }
            console.timeEnd("Worker Obj: Counting all objects");

            console.log("Worker Obj: Total object count: " + objectCount);
            self.postMessage({"cmd": "start", "objectCount": objectCount});

            console.time("Worker Obj: Overall Parsing Time");
            addObject('');

            for (var i = 0; i < lines.length; i++) {
                var line = lines[i];
                parseSingleLine(line);
            }
        }
        else {
            console.log("Worker Obj: Using manual String Generation (IE/Edge/Safari compatibility)");

            console.time("Worker Obj: Counting all objects");
            decodeLines(inputArrayBuffer, calcObjectCount);
            console.timeEnd("Worker Obj: Counting all objects");

            console.log("Worker Obj: Total object count: " + objectCount);
            self.postMessage({"cmd": "start", "objectCount": objectCount});


            console.time("Worker Obj: Overall Parsing Time");
            addObject('');

            decodeLines(inputArrayBuffer, parseSingleLine);
        }

        // Don't forget to post the last object
        objectCountRun++;
        postObject(object, objectCountRun);

        self.postMessage({"cmd": "complete"});
        console.timeEnd("Worker Obj: Overall Parsing Time");
    }
};

self.addEventListener('message', wwParseObj, false);
