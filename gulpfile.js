'use strict';

var fs = require( 'fs' );

var gulp = require( 'gulp' );
var del = require( 'del' );

var DIR = {
	BUILD: 'build/',
	WWOBJLOADER_EXAMPLES: 'wwobjloader2/',
	SITE: '2017_1_0/'
};

gulp.task( 'clean', function () {
	del.sync( DIR.BUILD );
	del.sync( DIR.WWOBJLOADER_EXAMPLES );
});

gulp.task( 'bundle-wwobjloader2-examples', function () {
	gulp.src( [ 'node_modules/wwobjloader2/build/OBJLoader2.min.js' ] )
		.pipe( gulp.dest( DIR.BUILD ) );
	gulp.src( [ 'node_modules/wwobjloader2/build/WWOBJLoader2.min.js' ] )
		.pipe( gulp.dest( DIR.BUILD ) );
	gulp.src( [ 'node_modules/wwobjloader2/test/**/*' ] )
		.pipe( gulp.dest( DIR.WWOBJLOADER_EXAMPLES ) );
} );


gulp.task( 'bundle-site', function () {
	del.sync( DIR.SITE );
	gulp.src( [ 'node_modules/three/build/three.min.js' ] )
		.pipe( gulp.dest( DIR.SITE + 'node_modules/three/build/' ) );
	gulp.src( [ 'node_modules/three/examples/js/loaders/MTLLoader.js' ] )
		.pipe( gulp.dest( DIR.SITE + 'node_modules/three/examples/js/loaders/' ) );
	gulp.src( [ 'node_modules/three/examples/js/controls/TrackballControls.js' ] )
		.pipe( gulp.dest( DIR.SITE + 'node_modules/three/examples/js/controls/' ) );
	gulp.src( [ 'node_modules/three/examples/js/Detector.js' ] )
		.pipe( gulp.dest( DIR.SITE + 'node_modules/three/examples/js' ) );
	gulp.src( [
			'node_modules/three/examples/js/libs/stats.min.js',
			'node_modules/three/examples/js/libs/dat.gui.min.js'
		] )
		.pipe( gulp.dest( DIR.SITE + 'node_modules/three/examples/js/libs' ) );
	gulp.src( [ 'node_modules/uil/build/uil.min.js' ] )
		.pipe( gulp.dest( DIR.SITE + 'node_modules/uil/build/' ) );
	gulp.src( [ 'node_modules/bowser/bowser.min.js' ] )
		.pipe( gulp.dest( DIR.SITE + 'node_modules/bowser' ) );
	gulp.src( [ 'node_modules/jszip/dist/jszip.min.js' ] )
		.pipe( gulp.dest( DIR.SITE + 'node_modules/jszip/dist' ) );
	gulp.src( [ 'node_modules/file-saver/FileSaver.min.js' ] )
		.pipe( gulp.dest( DIR.SITE + 'node_modules/file-saver' ) );

	gulp.src( [ 'build/**/*' ] )
		.pipe( gulp.dest( DIR.SITE + 'build/') );
	gulp.src( [ 'wwobjloader2/**/*' ] )
		.pipe( gulp.dest( DIR.SITE + 'wwobjloader2/' ) );

	gulp.src( [ 'demos/**/*' ] )
		.pipe( gulp.dest( DIR.SITE + 'demos/') );
	gulp.src( [ 'src/**/*' ] )
		.pipe( gulp.dest( DIR.SITE + 'src/' ) );

	gulp.src( [ 'resource/obj/**/*' ] )
		.pipe( gulp.dest( DIR.SITE + 'resource/obj' ) );
	gulp.src( [ 'resource/fonts/**/*' ] )
		.pipe( gulp.dest( DIR.SITE + 'resource/fonts' ) );
	gulp.src( [ 'resource/video/**/*' ] )
		.pipe( gulp.dest( DIR.SITE + 'resource/video' ) );
	gulp.src( [ 'resource/textures/meadow/**/*' ] )
		.pipe( gulp.dest( DIR.SITE + 'resource/textures/meadow' ) );
	gulp.src( [ 'resource/textures/skybox/**/*' ] )
		.pipe( gulp.dest( DIR.SITE + 'resource/textures/skybox' ) );
	gulp.src( [
			'resource/textures/PixelProtestLink.png',
			'resource/textures/PixelProtest.png',
			'resource/textures/ProjectionSpace.jpg',
			'resource/textures/PTV1Link.jpg',
			'resource/textures/teaserLink.jpg',
			'resource/textures/ZeroSouthLogo.png'
		] )
		.pipe( gulp.dest( DIR.SITE + 'resource/textures' ) );

	gulp.src( [ 'index.html' ] )
		.pipe( gulp.dest( DIR.SITE ) );
} );

gulp.task(
	'default',
	[
		'clean',
		'bundle-wwobjloader2-examples'
	]
);
