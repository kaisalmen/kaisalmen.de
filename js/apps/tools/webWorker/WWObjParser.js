/**
 * @author Kai Salmen / www.kaisalmen.de
 *
 * This web worker is based on three.js OBJLoader
 */

'use strict';

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

var arrayBuffer = null;
var currentPos = 0;

var lineCount = 0;
var vertexCount = 0;
var vertexOffset = 0;

var normalsCount = 0;
var normalsOffset = 0;

var uvsCount = 0;
var uvsOffset = 0;
var faceCount = 0;

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
}

function parseVertexIndex(value) {

    var index = parseInt(value) - vertexOffset;

    return ( index >= 0 ? index - 1 : index + vertices.length / 3 ) * 3;
}

function parseNormalIndex(value) {

    var index = parseInt(value) - normalsOffset;

    return ( index >= 0 ? index - 1 : index + normals.length / 3 ) * 3;

}

function parseUVIndex(value) {

    var index = parseInt(value) - uvsOffset;

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

    faceCount++;
}

var postObject = function (object, complete) {
//    console.time("Worker Obj: BufferGeometry building");

    var geometry = object.geometry;
    var verticesOut = new Float32Array(geometry.vertices);
    var normalsOut = null;
    var uvsOut = null;
    var interrupt = verticesOut.length > 30000;

//    console.log(objectCount + ': ' + object.name + ': ' + vertices.length);
    if ( geometry.normals.length > 0 ) {
        normalsOut = new Float32Array(geometry.normals);
    }
    else {
        console.log("Warning no normals have been defined.");
    }

    if ( geometry.uvs.length > 0 ) {
        uvsOut = new Float32Array(geometry.uvs);
    }


    if (normalsOut !== null) {
        if (uvsOut !== null) {
            self.postMessage({
                'cmd': 'objData',
                'meshName': object.name,
                'count': objectCount,
                'material': object.material.name,
                'smooth': object.material.smooth,
                'faceCount': faceCount,
                'complete': complete,
                'interrupt': interrupt,
                vertices: verticesOut,
                normals: normalsOut,
                uvs: uvsOut
            }, [verticesOut.buffer], [normalsOut.buffer], [uvsOut.buffer]);
        }
        else {
            self.postMessage({
                'cmd': 'objData',
                'meshName' : object.name,
                'count' : objectCount,
                'material': object.material.name,
                'smooth' : object.material.smooth,
                'faceCount': faceCount,
                'complete': complete,
                'interrupt': interrupt,
                vertices: verticesOut,
                normals: normalsOut
            }, [verticesOut.buffer], [normalsOut.buffer]);
        }

    }
    else if (uvsOut !== null) {
        self.postMessage({
            'cmd': 'objData',
            'meshName' : object.name,
            'count' : objectCount,
            'material': object.material.name,
            'smooth' : object.material.smooth,
            'faceCount': faceCount,
            'complete': complete,
            'interrupt': interrupt,
            vertices: verticesOut,
            uvs: uvsOut
        }, [verticesOut.buffer], [uvsOut.uvs]);
    }
    else {
        self.postMessage({
            'cmd': 'objData',
            'meshName' : object.name,
            'count' : objectCount,
            'material': object.material.name,
            'smooth' : object.material.smooth,
            'faceCount': faceCount,
            'complete': complete,
            'interrupt': interrupt,
            vertices: verticesOut,
        }, [verticesOut.buffer]);
    }

    delete geometry.vertices;
    delete geometry.normals;
    delete geometry.uvs;

    vertexOffset = vertexCount;
    vertices = [];

    normalsOffset = normalsCount;
    normals = [];

    uvsOffset = uvsCount;
    uvs = [];

    foundObjects = false;

    if (interrupt) {
        console.log('Interrupting processing (10000+ vertices) at object no.: ' + objectCount);
    }
    return interrupt;

//    console.timeEnd("Worker Obj: BufferGeometry building");
};

var decodeLines = function (processLineCallback) {
    var view = new Uint8Array(arrayBuffer);
    var line = "";

    var code = 0;
    var char;
    var interruptProcessing = false;

    for (; currentPos < view.length; currentPos++) {
        code = view[currentPos];
        char = String.fromCharCode(code);

        if (code === 13) {
            lineCount++;
            interruptProcessing = processLineCallback(line, lineCount);
            line = "";
            if (interruptProcessing) {
                break;
            }
        }
        else if (code !== 10) {
            line += char;
        }
    }

    return interruptProcessing;
};


var parseSingleLine = function (line, lineCount) {
    line = line.trim();

//    console.log(lineCount + ': ' + line);

    var result;
    var interruptProcessing = false;

    if (line.length === 0 || line.charAt(0) === '#') {

    } else if (( result = vertex_pattern.exec(line) ) !== null) {

        if (foundObjects) {
//            console.log(lineCount + ': ' + line);

            // Here a new object is found. It can be sent over
            objectCount++;

            interruptProcessing = postObject(object, false);

            addObject('');
        }

        // ["v 1.0 2.0 3.0", "1.0", "2.0", "3.0"]

        vertices.push(
            parseFloat(result[1]),
            parseFloat(result[2]),
            parseFloat(result[3])
        );

        vertexCount++;

    } else if (( result = normal_pattern.exec(line) ) !== null) {

        // ["vn 1.0 2.0 3.0", "1.0", "2.0", "3.0"]

        normals.push(
            parseFloat(result[1]),
            parseFloat(result[2]),
            parseFloat(result[3])
        );

        normalsCount++;

    } else if (( result = uv_pattern.exec(line) ) !== null) {

        // ["vt 0.1 0.2", "0.1", "0.2"]

        uvs.push(
            parseFloat(result[1]),
            parseFloat(result[2])
        );

        uvsCount++;

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

    return interruptProcessing;
};

var processFile = function () {

    var interruptProcessing = decodeLines(parseSingleLine);

    if (!interruptProcessing) {
        // Don't forget to post the last object
        objectCount++;
        postObject(object, objectCount, true);

        console.log("Worker Obj: Total object count: " + objectCount);
        console.log('Overall vertex count: ' + vertexCount);
        console.log('Overall normal count: ' + normalsCount);
        console.log('Overall uvs count: ' + uvsCount);
        console.log('Overall face count: ' + faceCount);

        object = null;
        arrayBuffer = null;

        console.timeEnd("Worker Obj: Overall Parsing Time");
    }
};

var wwParseObj = function (e) {
    var payload = e.data;

    switch (payload.cmd) {
        case 'init':
            console.time("Worker Obj: Overall Parsing Time");

            arrayBuffer = payload.arrayBuffer;

            addObject('');

            processFile();

            break;

        case 'processOngoing':
            console.log("Restarted after interrupt at object no.: " + objectCount);

            // we exited the loop, therefore we need to increase the counter before entering it again
            currentPos++;

            processFile();

            break;

        default:
            console.error("Worker Obj: Received unknown command: " + payload.cmd);
            break;
    }
};

self.addEventListener('message', wwParseObj, false);
