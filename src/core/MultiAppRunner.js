/**
 * @author Kai Salmen / www.kaisalmen.de
 */

'use strict';

KSX.core.MultiAppRunner = (function () {

    function MultiAppRunner() {
    }

    MultiAppRunner.prototype.addImplementations = function (implementations) {
        this.implementations = [];
        this.loader = undefined;

        var implementation;
        for ( var i = 0; i < implementations.length; i++ ) {
            implementation = implementations[i];

            if ( implementation.definition.loader ) {
                console.log("MultiAppRunner: Registering app as loader: " + implementation.definition.name);
                this.loader = implementation;
            }
            else {
                console.log("MultiAppRunner: Registering app: " + implementation.definition.name);
                this.implementations.push(implementation);
            }
        }
    };

    MultiAppRunner.prototype.run = function (startRenderLoop) {
        var scope = this;
        var resizeWindow = function () {
            for ( var i = 0; i < scope.implementations.length; i++ ) {
                scope.implementations[i].resizeDisplayGLBase();
            }
            if ( scope.loader !== undefined ) {
                scope.loader.resizeDisplayGLBase();
            }
        };
        window.addEventListener('resize', resizeWindow, false);

        // kicks init and prepares resources
        console.log("MultiAppRunner: Starting global initialisation phase...");

        var implementation;
        var promises = [];

        for ( var i = 0; i < scope.implementations.length; i++ ) {
            implementation = scope.implementations[i];

            var promise = function (resolve, reject) {
                implementation.init();
                resolve( implementation.definition.name );
            };
            promises.push(new Promise(promise));
        }
        if ( scope.loader !== undefined ) {
            var promise = function (resolve, reject) {
                scope.loader.init();
                resolve( scope.loader.definition.name );
            };
            promises.push(new Promise(promise));
        }

        Promise.all( promises ).then(
            function ( results ) {
                for ( var key in results ) {
                    console.log( 'MultiAppRunner: Successfully initialised app: ' + results[key] );
                }
            }
        ).catch(
            function (error) {
                console.error( 'MultiAppRunner: The following error occurred during initialisation of application: ', error );
            }
        );

        if ( startRenderLoop ) {
            scope.startRenderLoop();
        }
    };

    MultiAppRunner.prototype.startRenderLoop = function () {
        var scope = this;
        var render = function () {
            requestAnimationFrame(render);
            scope.render();
        };
        render();
    };

    MultiAppRunner.prototype.render = function () {
        if ( this.loader !== undefined ) {
            var allReady = true;
            var implementation;

            for ( var i = 0; i < this.implementations.length; i++ ) {
                implementation = this.implementations[i];
                implementation.renderingEnabled ? implementation.render() : allReady = false;
            }

            if ( !allReady ) {
                this.loader.render();
            }
            else {
                this.loader.dispose();
                this.loader = undefined;
            }
        }
        else {
            for ( var i = 0; i < this.implementations.length; i++ ) {
                this.implementations[i].render();
            }
        }
    };

    return MultiAppRunner;

})();

KSX.globals.multiAppRunner = new KSX.core.MultiAppRunner();
