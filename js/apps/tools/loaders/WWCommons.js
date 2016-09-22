/**
 * @author Kai Salmen / www.kaisalmen.de
 */

'use strict';

if ( THREE === undefined ) {
	var THREE = {}
}

if ( THREE.WebWorker === undefined ) {

	THREE.WebWorker = {
		Commons: {
			paths: {
				threejsPath: '../../../lib/threejs/three.min.js',
				objLoaderPath: '../../../lib/threejs/OBJLoader.js',
				mtlLoaderPath: '../../../lib/threejs/MTLLoader.js'
			}
		}
	}

}
