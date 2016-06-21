/**
 * @author Kai Salmen / www.kaisalmen.de
 */

'use strict';

if (KSX.apps.demos.home === undefined) {
    KSX.apps.demos.home = {};
}

KSX.apps.demos.home.PixelBoxesBuilder = (function () {

    function PixelBoxesBuilder( basedir, material, objGroup ) {
        this.basedir = basedir;
        this.material = material;
        this.objGroup = objGroup;

        this.worker = new Worker( basedir + "/js/apps/demos/Home/PixelBoxesGeneratorWW.js" );

        var scope = this;
        var scopeFunction = function (e) {
            scope.processObjData(e);
        };
        this.worker.addEventListener( 'message', scopeFunction, false );

        this.count = 0;
        this.processList = [];
    }

    PixelBoxesBuilder.prototype.processObjData = function ( event ) {
        var payload = event.data;

        switch ( payload.cmd ) {
            case "objData":
                var geometry = new THREE.BufferGeometry();
                geometry.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array( payload.vertices ), 3 ));
                geometry.addAttribute( 'uv', new THREE.BufferAttribute( new Float32Array( payload.uvs ), 2 ));
                if ( payload.useIndices ) {
                    geometry.setIndex( new THREE.BufferAttribute( new Uint32Array( payload.indices ), 1 ));
                }
                var mesh = new THREE.Mesh( geometry, this.material );
                mesh.translateX( payload.translationX );
                mesh.translateY( payload.translationY );
                mesh.translateZ( payload.translationZ );

                this.objGroup.add( mesh );
                this.count++;

                this.workOnProcessList();

                break;
            default:
                console.error('Received unknown command: ' + payload.cmd);
                break;
        }
    };


    PixelBoxesBuilder.prototype.buildSuperBoxSeries = function ( pixelU, pixelV, countU, countV, cubeEdgeLength ) {
        if ( countU % 2 !== 0 ) {
            console.error( 'countU cannot be divided by 2! Aborting...' );
            return;
        }
        if ( countV % 2 !== 0 ) {
            console.error( 'countV cannot be divided by 2! Aborting...' );
            return;
        }
        var uAdd = 1.0 / countU;
        var vAdd = 1.0 / countV;

         // initial parameters
         var gridParams = {
             sizeX : Math.round(pixelV / countV),
             sizeY : Math.round(pixelU / countU),
             uMin : 0.0,
             uMax : uAdd,
             vMin : 0.0,
             vMax : vAdd,
             cubeEdgeLength : cubeEdgeLength,
             posStartX : 0.0,
             posStartY : 0.0,
             useIndices : false
         };

        var translateXAdd = gridParams.sizeY * cubeEdgeLength;
        var translateYAdd = gridParams.sizeX * cubeEdgeLength;
        var translation = {
            x: 0.0,
            y: 0.0,
            z: 0.0
        };

        for ( var j = 0; j < countV; j++ ) {
            for ( var i = 0; i < countU; i++ ) {
                var localGridParams = copyObjectValues( gridParams );
                var localTranslation = copyObjectValues( translation );
                this.processList.push({
                    gridParams: localGridParams,
                    translation: localTranslation
                });

                gridParams.uMin += uAdd;
                gridParams.uMax += uAdd;
                translation.x += translateXAdd;
            }
            gridParams.uMin = 0.0;
            gridParams.uMax = uAdd;
            gridParams.vMin += vAdd;
            gridParams.vMax += vAdd;
            translation.x = 0.0;
            translation.y += translateYAdd;
        }

        console.log( 'Created process list with ' + this.processList.length + ' entries. Box size is: ' + gridParams.sizeX + 'x' + gridParams.sizeY);
        this.workOnProcessList();
    };

    var copyObjectValues = function ( params ) {
        var localParams = {};
        for ( var param in params ) {
            if ( params.hasOwnProperty( param )) {
                localParams[param] = params[param];
            }
        }

        return localParams;
    };

    PixelBoxesBuilder.prototype.workOnProcessList = function () {
        if ( this.count < this.processList.length ) {
            var processObj = this.processList[this.count];
            this.buildSuperBox( processObj.gridParams, processObj.translation );
        }
        else {
            var event = new Event( 'complete' );
            document.dispatchEvent( event );
        }
    };

    PixelBoxesBuilder.prototype.buildSuperBox = function ( gridParams, translation ) {
        if ( translation !== undefined ) {
            translation.x = translation.x === undefined ? 0.0 : translation.x;
            translation.y = translation.y === undefined ? 0.0 : translation.y;
            translation.z = translation.z === undefined ? 0.0 : translation.z;
        }

        this.worker.postMessage({
            "cmd": "build",
            "sizeX": gridParams.sizeX,
            "sizeY": gridParams.sizeY,
            "uMin": gridParams.uMin,
            "vMin": gridParams.vMin,
            "uMax": gridParams.uMax,
            "vMax": gridParams.vMax,
            "cubeEdgeLength": gridParams.cubeEdgeLength,
            "posStartX": gridParams.posStartX,
            "posStartY": gridParams.posStartY,
            "useIndices": gridParams.useIndices,
            "translationX": translation.x,
            "translationY": translation.y,
            "translationZ": translation.z
        });
    };

    return PixelBoxesBuilder;

})();