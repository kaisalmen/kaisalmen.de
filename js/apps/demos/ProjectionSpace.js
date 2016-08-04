/**
 * @author Kai Salmen / www.kaisalmen.de
 */
/**
 * @author Kai Salmen / www.kaisalmen.de
 */

'use strict';

KSX.apps.demos.ProjectionSpace = (function () {


    function ProjectionSpace() {
        this.shader = new KSX.apps.shader.BlockShader();

        this.pixelBoxesGenerator = new KSX.apps.demos.home.PixelBoxesGenerator( KSX.globals.basedir );
        this.dimensions = [];
        this.dimensions[0] = { index: 0, name: 'Low', x: 240, y: 100, defaultHeightFactor: 9, mesh: null };
        this.dimensions[1] = { index: 1, name: 'Medium', x: 720, y: 302, defaultHeightFactor: 18, mesh: null };
        this.dimensions[2] = { index: 2, name: 'High', x: 1280, y: 536, defaultHeightFactor: 27, mesh: null };
        this.dimensions[3] = { index: 3, name: 'Extreme', x: 1920, y: 804, defaultHeightFactor: 36, mesh: null };
        this.dimensions[4] = { index: 4, name: 'Insane', x: 3840, y: 1608, defaultHeightFactor: 45, mesh: null };

        this.index = 0;
        this.currentDimension = this.dimensions[this.index];
    }

    ProjectionSpace.prototype.loadAsyncResources = function ( callbackOnSuccess ) {
        this.shader.loadResources( callbackOnSuccess );
    };

    ProjectionSpace.prototype.initGL = function ( rttTexture, videoTexture ) {
        var projectionSpaceMaterial = this.shader.buildShaderMaterial();
        this.shader.textures['rtt'] = rttTexture;
        this.shader.textures['video'] = videoTexture;

        this.dimensions[0].mesh = this.pixelBoxesGenerator.buildInstanceBoxes( this.dimensions[0], projectionSpaceMaterial );
        this.dimensions[1].mesh = this.pixelBoxesGenerator.buildInstanceBoxes( this.dimensions[1], projectionSpaceMaterial );
        this.dimensions[2].mesh = this.pixelBoxesGenerator.buildInstanceBoxes( this.dimensions[2], projectionSpaceMaterial );
        this.dimensions[3].mesh = this.pixelBoxesGenerator.buildInstanceBoxes( this.dimensions[3], projectionSpaceMaterial );
        this.dimensions[4].mesh = this.pixelBoxesGenerator.buildInstanceBoxes( this.dimensions[4], projectionSpaceMaterial );
    };

    ProjectionSpace.prototype.flipTexture = function ( name ) {
        var texture = this.shader.textures[name];
        if ( texture !== undefined ) {
            this.shader.uniforms.texture1.value = texture;
        }
    };

    ProjectionSpace.prototype.renderPre = function () {

    };

    ProjectionSpace.prototype.renderPost = function () {

    };

    ProjectionSpace.prototype.printStats = function () {
        var instanceCount = this.currentDimension.x * this.currentDimension.y;
        var resolution = this.currentDimension.x + 'x' + this.currentDimension.y;
        return 'Projection Space: Resolution: ' + this.currentDimension.name + ' (' + resolution + '=' + instanceCount + ' instances)';
    };

    ProjectionSpace.prototype.resetProjectionSpace = function ( mobileDevice ) {
        this.index = mobileDevice ? 0 : 1;
        this.currentDimension = this.dimensions[this.index];
        this.shader.resetUniforms( 'rtt', this.currentDimension.defaultHeightFactor );
    };

    ProjectionSpace.prototype.dispose = function () {

    };

    return ProjectionSpace;
})();
