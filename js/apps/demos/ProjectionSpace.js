/**
 * @author Kai Salmen / www.kaisalmen.de
 */
/**
 * @author Kai Salmen / www.kaisalmen.de
 */

'use strict';

KSX.apps.demos.ProjectionSpace = (function () {


    function ProjectionSpace( dimensionParams, defaultIndex ) {
        this.shader = new KSX.apps.shader.BlockShader();

        this.pixelBoxesGenerator = new KSX.apps.demos.home.PixelBoxesGenerator( KSX.globals.basedir );
        this.pivot = new THREE.Object3D();
        this.dimensions = [];

        for ( var dimensionParam in dimensionParams ) {
            this.dimensions.push( dimensionParams[dimensionParam] );
        }

        this.resetProjectionSpace( defaultIndex );
    }

    ProjectionSpace.prototype.loadAsyncResources = function ( callbackOnSuccess ) {
        this.shader.loadResources( callbackOnSuccess );
    };

    ProjectionSpace.prototype.initGL = function () {
        var projectionSpaceMaterial = this.shader.buildShaderMaterial();

        for ( var dimension of this.dimensions ) {
            this.pixelBoxesGenerator.buildInstanceBoxes( dimension, projectionSpaceMaterial );
        }

        this.pivot.add( this.dimensions[this.index].mesh );
    };

    ProjectionSpace.prototype.switchDimensionMesh = function ( index ) {
        var oldMesh = this.dimensions[this.index];
        this.index = index;

        this.pivot.remove( oldMesh.mesh );
        var newMesh = this.dimensions[this.index].mesh;
        this.pivot.add( newMesh );

        this.shader.uniforms.heightFactor.value = newMesh.defaultHeightFactor;
    };

    ProjectionSpace.prototype.getWidth = function () {
        return this.dimensions[this.index].x;
    };

    ProjectionSpace.prototype.getHeight = function () {
        return this.dimensions[this.index].y;
    };

    ProjectionSpace.prototype.flipTexture = function ( name ) {
        var texture = this.shader.textures[name];
        if ( texture !== undefined ) {
            this.shader.uniforms.texture1.value = texture;
        }
    };

    ProjectionSpace.prototype.printStats = function () {
        var line = 'Projection Space: ';
        if ( this.dimensions.length > 0 ) {
            var instanceCount = this.dimensions[this.index].x * this.dimensions[this.index].y;
            var resolution = this.dimensions[this.index].x + 'x' + this.dimensions[this.index].y;
            line += 'Resolution: ' + this.dimensions[this.index].name + ' (' + resolution + '=' + instanceCount + ' instances)';
        }
        else {
            line += 'undefined!';
        }
        return line;
    };

    ProjectionSpace.prototype.resetProjectionSpace = function ( defaultIndex ) {
        this.index = defaultIndex;
        if ( this.index >= this.dimensions.length ) {
            this.index = this.dimensions.length - 1;
        }

        if ( this.dimensions.length > 0) {
            this.shader.resetUniforms( 'rtt', this.dimensions[this.index].defaultHeightFactor );
        }
        else {
            this.shader.resetUniforms( 'rtt' );
        }
    };

    ProjectionSpace.prototype.dispose = function () {
        this.dimensions = [];
        this.resetProjectionSpace(0);
    };

    return ProjectionSpace;
})();
