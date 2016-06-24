/**
 * @author Kai Salmen / www.kaisalmen.de
 */

'use strict';

if (KSX.apps.demos.home === undefined) {
    KSX.apps.demos.home = {};
}

KSX.apps.demos.home.PixelBoxesGenerator = (function () {

    function PixelBoxesGenerator( basedir ) {
        this.basedir = basedir;
        this.material = null;
        this.objGroup = null;

        this.worker = new Worker( basedir + "/js/apps/demos/Home/PixelBoxesGeneratorWW.js" );

        var scope = this;
        var scopeFunction = function (e) {
            scope.processObjData(e);
        };
        this.worker.addEventListener( 'message', scopeFunction, false );

        this.count = 0;
        this.processList = [];
    }

    PixelBoxesGenerator.prototype.setObjGroup = function ( objGroup ) {
        this.objGroup = objGroup;
    };
    PixelBoxesGenerator.prototype.setMaterial = function ( material ) {
        this.material = material;
    };

    PixelBoxesGenerator.prototype.processObjData = function ( event ) {
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


    PixelBoxesGenerator.prototype.buildSuperBoxSeries = function ( pixelU, pixelV, countU, countV ) {
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
             posStartX : 0.0,
             posStartY : 0.0,
             useIndices : false
         };

        var translateXAdd = gridParams.sizeY;
        var translateYAdd = gridParams.sizeX;
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

    PixelBoxesGenerator.prototype.workOnProcessList = function () {
        if ( this.count < this.processList.length ) {
            var processObj = this.processList[this.count];
            this.buildSuperBox( processObj.gridParams, processObj.translation );
        }
        else {
            var event = new Event( 'complete' );
            document.dispatchEvent( event );
        }
    };

    PixelBoxesGenerator.prototype.buildSuperBox = function ( gridParams, translation ) {
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
            "posStartX": gridParams.posStartX,
            "posStartY": gridParams.posStartY,
            "useIndices": gridParams.useIndices,
            "translationX": translation.x,
            "translationY": translation.y,
            "translationZ": translation.z
        });
    };

    PixelBoxesGenerator.prototype.buildInstanceBoxes = function ( dimensions, spacing, shader ) {

        var instanceBoxBuildParams = {
            count : 0,
            xOffset : 0.0,
            yOffset : 0.0,
            zOffset : 0.0,
            uvLocalMinU : 0.0,
            uvLocalMaxU : 1.0,
            uvLocalMinV : 0.0,
            uvLocalMaxV : 1.0,
            vertices : [],
            normals : [],
            uvs : [],
            useIndices : true,
            indices : []
        };

        KSX.apps.demos.home.buildBox( instanceBoxBuildParams );

        var bufferGeometry = new THREE.BufferGeometry();
        bufferGeometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(instanceBoxBuildParams.vertices), 3));
        bufferGeometry.addAttribute('uv', new THREE.BufferAttribute(new Float32Array(instanceBoxBuildParams.uvs), 2));
        if (instanceBoxBuildParams.useIndices) {
            bufferGeometry.setIndex(new THREE.BufferAttribute(new Uint32Array(instanceBoxBuildParams.indices), 1));
        }

        var geometry = new THREE.InstancedBufferGeometry();
        geometry.copy( bufferGeometry );

        var objectCount = dimensions.x * dimensions.y;
        var offsets = new THREE.InstancedBufferAttribute( new Float32Array( objectCount * 3 ), 3, 1 );
        var x = -dimensions.x * spacing / 2.0;
        var y = -dimensions.y * spacing / 2.0;

        var uvRanges = new THREE.InstancedBufferAttribute( new Float32Array( objectCount * 2 ), 2, 1 );
        var incU = 1.0 / dimensions.x;
        var incV = 1.0 / dimensions.y;
        shader.uniforms.uvScaleU.value = incU;
        shader.uniforms.uvScaleV.value = incV;
        var uRange = 0.0;
        var vRange = 0.0;
        var index = 0;

        var runX = 0;
        var runY = 0;
        while ( runY < dimensions.y ) {
            while ( runX < dimensions.x ) {
                offsets.setXYZ( index, x, y, 0 );
                uvRanges.setXY( index, uRange, vRange );
                index++;

                runX++;
                x += spacing;

                uRange += incU;
            }
            runY++;
            runX = 0;

            x = -dimensions.x * spacing / 2.0;
            y += spacing;

            uRange = 0.0;
            vRange += incV;
        }
        geometry.addAttribute( 'offset', offsets );
        geometry.addAttribute( 'uvRange', uvRanges );

        var shaderMaterial = shader.buildShaderMaterial();
        var meshInstances = new THREE.Mesh( geometry, shaderMaterial );

        return meshInstances;
    };

    return PixelBoxesGenerator;

})();
