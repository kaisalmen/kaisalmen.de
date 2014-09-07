/**
 * Loads a Wavefront .obj file with materials
 *
 * @author mrdoob / http://mrdoob.com/
 * @author angelxuanchang
 */

THREE.OBJMTLLoader = function () {};

THREE.OBJMTLLoader.prototype = {

	constructor : THREE.OBJMTLLoader,

    load: function ( url, mtlurl, onLoad, onProgress, onError ) {

        var scope = this;

        var mtlLoader = new THREE.MTLLoader( url.substr( 0, url.lastIndexOf( "/" ) + 1 ) );
        mtlLoader.load( mtlurl, function ( materials ) {

            var materialsCreator = materials;
            materialsCreator.preload();

            var loader = new THREE.XHRLoader( scope.manager );
            loader.setCrossOrigin( this.crossOrigin );
            loader.load( url, function ( text ) {

                var object = scope.parse( text );

                object.traverse( function ( object ) {
                    if ( object instanceof THREE.Mesh ) {
                        if ( object.material.name ) {
                            var material = materialsCreator.create( object.material.name );
                            if ( material ) object.material = material;
                        }
                    }
                } );
                onLoad( object );
            } );
        } );
    },

    group : null,
    object : null,

    geometry : null,
    material : null,
    mesh : null,

    vertices : null,
    normals : null,
    uvs : null,

    face_offset : null,

    vertex_pattern  : null,
    normal_pattern  : null,
    uv_pattern : null,
    face_pattern1 : null,
    face_pattern2 : null,
    face_pattern3 : null,
    face_pattern4 : null,

    data : null,
    callbackObjReady : null,
    callbackComplete : null,
    mtllibCallback : null,

    lines : null,
    linesPos : 0,

    /**
     * @param data - content of .obj file
     * @param mtllibCallback - callback to handle mtllib declaration (optional)
     */
    init : function (data, mtllibCallback) {
        var scope = this;
        scope.group = new THREE.Object3D();
        scope.object = scope.group;

        scope.geometry = new THREE.Geometry();
        scope.material = new THREE.MeshLambertMaterial();
        scope.mesh = new THREE.Mesh(scope.geometry, scope.material);

        scope.vertices = [];
        scope.normals = [];
        scope.uvs = [];

        scope.face_offset = 0;

        // v float float float
        scope.vertex_pattern = /v( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)/;

        // vn float float float
        scope.normal_pattern = /vn( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)/;

        // vt float float
        scope.uv_pattern = /vt( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)/;

        // f vertex vertex vertex ...
        scope.face_pattern1 = /f( +\d+)( +\d+)( +\d+)( +\d+)?/;

        // f vertex/uv vertex/uv vertex/uv ...
        scope.face_pattern2 = /f( +(\d+)\/(\d+))( +(\d+)\/(\d+))( +(\d+)\/(\d+))( +(\d+)\/(\d+))?/;

        // f vertex/uv/normal vertex/uv/normal vertex/uv/normal ...
        scope.face_pattern3 = /f( +(\d+)\/(\d+)\/(\d+))( +(\d+)\/(\d+)\/(\d+))( +(\d+)\/(\d+)\/(\d+))( +(\d+)\/(\d+)\/(\d+))?/;

        // f vertex//normal vertex//normal vertex//normal ...
        scope.face_pattern4 = /f( +(\d+)\/\/(\d+))( +(\d+)\/\/(\d+))( +(\d+)\/\/(\d+))( +(\d+)\/\/(\d+))?/

        scope.data = data;
        scope.lines = data.split( "\n" );
        scope.linesPos = 0;

        scope.mtllibCallback = mtllibCallback;
    },

	/**
	 * Parses loaded .obj file
	 */
	parse: function () {
        var scope = this;
		function vector( x, y, z ) {
			return new THREE.Vector3( x, y, z );
		}

		function uv( u, v ) {
			return new THREE.Vector2( u, v );
		}

		function face3( a, b, c, normals ) {
			return new THREE.Face3( a, b, c, normals );
		}

		function meshN(meshName, materialName) {
			if (scope.vertices.length > 0) {
				scope.geometry.vertices = scope.vertices;

				scope.geometry.mergeVertices();
				scope.geometry.computeFaceNormals();
				scope.geometry.computeBoundingSphere();

				scope.object.add( scope.mesh );

				scope.geometry = new THREE.Geometry();
				scope.mesh = new THREE.Mesh( scope.geometry, scope.material );
			}

			if ( meshName !== undefined ) scope.mesh.name = meshName;

			if ( materialName !== undefined ) {
				scope.material = new THREE.MeshLambertMaterial();
				scope.material.name = materialName;
				scope.mesh.material = scope.material;
			}
    	}

		function add_face( a, b, c, normals_inds ) {
			if ( normals_inds === undefined ) {
				scope.geometry.faces.push( face3(
					parseInt( a ) - (scope.face_offset + 1),
					parseInt( b ) - (scope.face_offset + 1),
					parseInt( c ) - (scope.face_offset + 1)
				) );
			}
            else {
				scope.geometry.faces.push( face3(
					parseInt( a ) - (scope.face_offset + 1),
					parseInt( b ) - (scope.face_offset + 1),
					parseInt( c ) - (scope.face_offset + 1),
					[
						scope.normals[ parseInt( normals_inds[ 0 ] ) - 1 ].clone(),
						scope.normals[ parseInt( normals_inds[ 1 ] ) - 1 ].clone(),
						scope.normals[ parseInt( normals_inds[ 2 ] ) - 1 ].clone()
					]
				) );
			}
		}
		
		function add_uvs( a, b, c ) {
			scope.geometry.faceVertexUvs[ 0 ].push( [
				scope.uvs[ parseInt( a ) - 1 ].clone(),
				scope.uvs[ parseInt( b ) - 1 ].clone(),
				scope.uvs[ parseInt( c ) - 1 ].clone()
			] );
		}
		
		function handle_face_line(faces, uvsL, normals_inds) {
			if ( faces[ 3 ] === undefined ) {
				add_face( faces[ 0 ], faces[ 1 ], faces[ 2 ], normals_inds );
				
				if (!(uvsL === undefined) && uvsL.length > 0) {
					add_uvs( uvsL[ 0 ], uvsL[ 1 ], uvsL[ 2 ] );
				}
			}
            else {
				if (!(normals_inds === undefined) && normals_inds.length > 0) {
    				add_face( faces[ 0 ], faces[ 1 ], faces[ 3 ], [ normals_inds[ 0 ], normals_inds[ 1 ], normals_inds[ 3 ] ]);
					add_face( faces[ 1 ], faces[ 2 ], faces[ 3 ], [ normals_inds[ 1 ], normals_inds[ 2 ], normals_inds[ 3 ] ]);

	    		}
                else {
					add_face( faces[ 0 ], faces[ 1 ], faces[ 3 ]);
					add_face( faces[ 1 ], faces[ 2 ], faces[ 3 ]);
				}
				
				if (!(uvsL === undefined) && uvsL.length > 0) {
					add_uvs( uvsL[ 0 ], uvsL[ 1 ], uvsL[ 3 ] );
					add_uvs( uvsL[ 1 ], uvsL[ 2 ], uvsL[ 3 ] );
				}
			}
		}

        var createdMesh = false;
		while (scope.linesPos < scope.lines.length) {
			var line = scope.lines[scope.linesPos];
			line = line.trim();
			var result;
            scope.linesPos++;

			if ( line.length === 0 || line.charAt( 0 ) === '#' ) {
				continue;
			}
            else if ( ( result = scope.vertex_pattern.exec( line ) ) !== null ) {
				// ["v 1.0 2.0 3.0", "1.0", "2.0", "3.0"]
				scope.vertices.push( vector(
					parseFloat( result[ 1 ] ),
					parseFloat( result[ 2 ] ),
					parseFloat( result[ 3 ] )
				) );
			}
            else if ( ( result = scope.normal_pattern.exec( line ) ) !== null ) {
				// ["vn 1.0 2.0 3.0", "1.0", "2.0", "3.0"]
				scope.normals.push( vector(
					parseFloat( result[ 1 ] ),
					parseFloat( result[ 2 ] ),
					parseFloat( result[ 3 ] )
				) );
			}
            else if ( ( result = scope.uv_pattern.exec( line ) ) !== null ) {
				// ["vt 0.1 0.2", "0.1", "0.2"]
				scope.uvs.push( uv(
					parseFloat( result[ 1 ] ),
					parseFloat( result[ 2 ] )
				) );
			}
            else if ( ( result = scope.face_pattern1.exec( line ) ) !== null ) {
				// ["f 1 2 3", "1", "2", "3", undefined]
				handle_face_line([ result[ 1 ], result[ 2 ], result[ 3 ], result[ 4 ] ]);
			}
            else if ( ( result = scope.face_pattern2.exec( line ) ) !== null ) {
				// ["f 1/1 2/2 3/3", " 1/1", "1", "1", " 2/2", "2", "2", " 3/3", "3", "3", undefined, undefined, undefined]
				handle_face_line(
					[ result[ 2 ], result[ 5 ], result[ 8 ], result[ 11 ] ], //faces
					[ result[ 3 ], result[ 6 ], result[ 9 ], result[ 12 ] ] //uv
				);
			}
            else if ( ( result = scope.face_pattern3.exec( line ) ) !== null ) {
				// ["f 1/1/1 2/2/2 3/3/3", " 1/1/1", "1", "1", "1", " 2/2/2", "2", "2", "2", " 3/3/3", "3", "3", "3", undefined, undefined, undefined, undefined]
				handle_face_line(
					[ result[ 2 ], result[ 6 ], result[ 10 ], result[ 14 ] ], //faces
					[ result[ 3 ], result[ 7 ], result[ 11 ], result[ 15 ] ], //uv
					[ result[ 4 ], result[ 8 ], result[ 12 ], result[ 16 ] ] //normal
				);
			}
            else if ( ( result = scope.face_pattern4.exec( line ) ) !== null ) {
				// ["f 1//1 2//2 3//3", " 1//1", "1", "1", " 2//2", "2", "2", " 3//3", "3", "3", undefined, undefined, undefined]
    	    	handle_face_line(
					[ result[ 2 ], result[ 5 ], result[ 8 ], result[ 11 ] ], //faces
					[ ], //uv
					[ result[ 3 ], result[ 6 ], result[ 9 ], result[ 12 ] ] //normal
				);
			}
            else if ( /^o /.test( line ) ) {
				// object
				meshN();
				scope.face_offset = scope.face_offset + scope.vertices.length;
				scope.vertices = [];
				scope.object = new THREE.Object3D();
				scope.object.name = line.substring( 2 ).trim();
				scope.group.add( scope.object );

                createdMesh = true;
			}
            else if ( /^g /.test( line ) ) {
				// group
				meshN( line.substring( 2 ).trim(), undefined );
                createdMesh = true;
			}
            else if ( /^usemtl /.test( line ) ) {
				// material
				meshN( undefined, line.substring( 7 ).trim() );
                createdMesh = true;
			}
            else if ( /^mtllib /.test( line ) ) {
				// mtl file
				if (scope.mtllibCallback) {
					var mtlfile = line.substring( 7 );
					mtlfile = mtlfile.trim();
                    scope.mtllibCallback( mtlfile );
				}
			}
            else if ( /^s /.test( line ) ) {
				// Smooth shading
			}
            else {
				console.log( "THREE.OBJMTLLoader: Unhandled line " + line );
			}

            if (createdMesh) {
                console.log("Reached created mesh!");
                break;
            }
		}

        //Add last object
        if (scope.linesPos >= scope.lines.length) {
            meshN(undefined, undefined);
            scope.object = null;
        }

        return scope.object;
	}
};

THREE.EventDispatcher.prototype.apply( THREE.OBJMTLLoader.prototype );
