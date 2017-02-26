'use strict';

var fs = require( 'fs' );

var gulp = require( 'gulp' );
var del = require( 'del' );

var DIR = {
	BUILD: 'build/',
	WWOBJLOADER_EXAMPLES: 'wwobjloader2/'
};

gulp.task( 'clean', function () {
	del.sync( DIR.BUILD );
	del.sync( DIR.WWOBJLOADER_EXAMPLES );
});

gulp.task( 'bundle-wwobjloader2-examples', function () {
	gulp.src( [ 'node_modules/wwobjloader2/build/*' ] )
		.pipe( gulp.dest( DIR.BUILD ) );
	gulp.src( [ 'node_modules/wwobjloader2/test/common/*' ] )
		.pipe( gulp.dest( DIR.WWOBJLOADER_EXAMPLES + '/common/' ) );
	gulp.src( [ 'node_modules/wwobjloader2/test/objloader2/*' ] )
		.pipe( gulp.dest( DIR.WWOBJLOADER_EXAMPLES + '/objloader2/' ) );
	gulp.src( [ 'node_modules/wwobjloader2/test/wwobjloader2/*' ] )
		.pipe( gulp.dest( DIR.WWOBJLOADER_EXAMPLES + '/wwobjloader2/' ) );
	gulp.src( [ 'node_modules/wwobjloader2/test/wwobjloader2stage/*' ] )
		.pipe( gulp.dest( DIR.WWOBJLOADER_EXAMPLES + '/wwobjloader2stage/' ) );
	gulp.src( [ 'node_modules/wwobjloader2/test/wwparallels/*' ] )
		.pipe( gulp.dest( DIR.WWOBJLOADER_EXAMPLES + '/wwparallels/' ) );
} );


gulp.task(
	'default',
	[
		'clean',
		'bundle-wwobjloader2-examples'
	]
);
