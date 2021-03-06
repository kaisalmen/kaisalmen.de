'use strict';

var fs = require( 'fs' );

var gulp = require( 'gulp' );
var del = require( 'del' );

var DIR = {
	WWOBJLOADER_EXAMPLES: 'wwobjloader2/',
	SITE: 'build/'
};

gulp.task( 'bundle-wwobjloader2', function () {
	del.sync( DIR.WWOBJLOADER_EXAMPLES );

	gulp.src( [ 'node_modules/wwobjloader2/test/**/*' ] )
		.pipe( gulp.dest( DIR.WWOBJLOADER_EXAMPLES ) )
		.on( 'end', function() {
			del.sync( DIR.WWOBJLOADER_EXAMPLES + 'objloader2/main.html' );
			del.sync( DIR.WWOBJLOADER_EXAMPLES + 'objloader2/main.src.html' );
			del.sync( DIR.WWOBJLOADER_EXAMPLES + 'wwobjloader2/main.html' );
			del.sync( DIR.WWOBJLOADER_EXAMPLES + 'wwobjloader2/main.src.html' );
			del.sync( DIR.WWOBJLOADER_EXAMPLES + 'wwobjloader2stage/main.html' );
			del.sync( DIR.WWOBJLOADER_EXAMPLES + 'wwobjloader2stage/main.src.html' );
			del.sync( DIR.WWOBJLOADER_EXAMPLES + 'wwparallels/main.html' );
			del.sync( DIR.WWOBJLOADER_EXAMPLES + 'wwparallels/main.src.html' );
			del.sync( DIR.WWOBJLOADER_EXAMPLES + 'meshspray/main.html' );
			del.sync( DIR.WWOBJLOADER_EXAMPLES + 'meshspray/main.src.html' );
			del.sync( DIR.WWOBJLOADER_EXAMPLES + 'objverify/*' );
		} );
} );

gulp.task( 'bundle-site', function () {
	del.sync( DIR.SITE );
	// three and helpers
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

	// uil, bowser, jszip and file-saver
	gulp.src( [ 'node_modules/uil/build/uil.min.js' ] )
		.pipe( gulp.dest( DIR.SITE + 'node_modules/uil/build/' ) );
	gulp.src( [ 'node_modules/bowser/bowser.min.js' ] )
		.pipe( gulp.dest( DIR.SITE + 'node_modules/bowser' ) );
	gulp.src( [ 'node_modules/jszip/dist/jszip.min.js' ] )
		.pipe( gulp.dest( DIR.SITE + 'node_modules/jszip/dist' ) );
	gulp.src( [ 'node_modules/file-saver/FileSaver.min.js' ] )
		.pipe( gulp.dest( DIR.SITE + 'node_modules/file-saver' ) );

	// polyfills
	gulp.src( [ 'node_modules/webcomponents.js/webcomponents-lite.min.js' ] )
		.pipe( gulp.dest( DIR.SITE + 'node_modules/webcomponents.js' ) );
	gulp.src( [ 'node_modules/es6-promise/dist/es6-promise.auto.min.js' ] )
	.pipe( gulp.dest( DIR.SITE + 'node_modules/es6-promise/dist' ) );

	// wwobjloader2
	gulp.src( [ 'node_modules/wwobjloader2/build/OBJLoader2.min.js' ] )
		.pipe( gulp.dest( DIR.SITE + 'node_modules/wwobjloader2/build' ) );
	gulp.src( [ 'node_modules/wwobjloader2/build/LoaderSupport.min.js' ] )
		.pipe( gulp.dest( DIR.SITE + 'node_modules/wwobjloader2/build' ) );

	gulp.src( [ 'demos/**/*' ] )
		.pipe( gulp.dest( DIR.SITE + 'demos/') );
	gulp.src( [ 'src/**/*' ] )
		.pipe( gulp.dest( DIR.SITE + 'src/' ) );
	gulp.src( [ 'wwobjloader2/**/*' ] )
		.pipe( gulp.dest( DIR.SITE + 'wwobjloader2/' ) );

	// resources
	gulp.src( [ 'resource/obj/cerberus/*.obj' ] )
		.pipe( gulp.dest( DIR.SITE + 'resource/obj/cerberus' ) );
	gulp.src( [ 'resource/obj/female02/*' ] )
		.pipe( gulp.dest( DIR.SITE + 'resource/obj/female02' ) );
	gulp.src( [ 'resource/obj/male02/*' ] )
		.pipe( gulp.dest( DIR.SITE + 'resource/obj/male02' ) );
	gulp.src( [ 'resource/obj/PTV1/*.zip' ] )
		.pipe( gulp.dest( DIR.SITE + 'resource/obj/PTV1' ) );
	gulp.src( [	'resource/obj/vive-controller/*.obj' ] )
		.pipe( gulp.dest( DIR.SITE + 'resource/obj/vive-controller' ) );
	gulp.src( [ 'resource/obj/walt/*' ] )
		.pipe( gulp.dest( DIR.SITE + 'resource/obj/walt' ) );
	gulp.src( [ 'resource/obj/zomax/*.zip' ] )
		.pipe( gulp.dest( DIR.SITE + 'resource/obj/zomax' ) );
	gulp.src( [ 'resource/fonts/*.json' ] )
		.pipe( gulp.dest( DIR.SITE + 'resource/fonts/' ) );
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
	'default', function () {
		console.log( 'Use "bundle-wwobjloader2" to bundle the examples from wwobjloader2.' );
		console.log( 'Use "bundle-site" to bundle the complete site to the configured directory.' );
	}
);


