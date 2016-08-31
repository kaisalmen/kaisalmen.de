/**
 * @author Kai Salmen / www.kaisalmen.de
 */

'use strict';

KSX.apps.demos.HelloOOSimple = (function () {

    HelloOOSimple.prototype = Object.create(KSX.apps.core.ThreeJsApp.prototype, {
        constructor: {
            configurable: true,
            enumerable: true,
            value: HelloOOSimple,
            writable: true
        }
    });

    function HelloOOSimple(elementToBindTo, loader) {
        KSX.apps.core.ThreeJsApp.call(this);

        var userDefinition = {
            user : this,
            name : 'HelloOOSimple',
            htmlCanvas : elementToBindTo,
            useScenePerspective : true,
            loader: loader
        };
        this.configure(userDefinition);
    }

    HelloOOSimple.prototype.initGL = function () {
        this.scenePerspective.camera.position.set( 0, 0, 250 );
        this.scenePerspective.camera.position.z = 5;

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
