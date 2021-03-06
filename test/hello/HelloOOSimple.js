/**
 * @author Kai Salmen / www.kaisalmen.de
 */

'use strict';

if ( KSX.test.hello === undefined ) KSX.test.hello = {};

KSX.test.hello.HelloOOSimple = (function () {

    HelloOOSimple.prototype = Object.create(KSX.core.ThreeJsApp.prototype, {
        constructor: {
            configurable: true,
            enumerable: true,
            value: HelloOOSimple,
            writable: true
        }
    });

    function HelloOOSimple(elementToBindTo, loader) {
        KSX.core.ThreeJsApp.call(this);

        var userDefinition = {
            name: 'HelloOOSimple',
            htmlCanvas: elementToBindTo,
            useScenePerspective: true,
            loader: loader
        };
        this.configure(userDefinition);
    }

    HelloOOSimple.prototype.initGL = function () {
        var cameraDefaults = {
            posCamera: new THREE.Vector3( 0.0, 0.0, 5.0 ),
        };
        this.scenePerspective.setCameraDefaults( cameraDefaults );

        var geometry = new THREE.SphereGeometry(1, 32, 32);
        var material = new THREE.MeshNormalMaterial();
        this.mesh =  new THREE.Mesh(geometry, material);

        this.scenePerspective.scene.add(this.mesh);
    };

    HelloOOSimple.prototype.renderPre = function () {
        this.mesh.rotation.x += 0.1;
        this.mesh.rotation.y += 0.1;
    };

    return HelloOOSimple;
})();
