/**
 * @author Kai Salmen / www.kaisalmen.de
 */

'use strict';

if (KSX.apps.demos.home === undefined) {
    KSX.apps.demos.home = {};
}

KSX.apps.demos.home.Ui = (function () {

    function HomeUi( mobileDevice, projectionSpace ) {
        this.projectionSpace = projectionSpace;

        this.uiToolsConfig = {
            useUil: true,
            useStats: true,
            mobileDevice: mobileDevice,
            uilParams: {
                css: 'top: 0px; left: 0px;',
                width: 384,
                center: false,
                color: 'rgba(224, 224, 224, 1.0)',
                bg: 'rgba(40, 40, 40, 0.66)'
            },
            paramsDimension: {
                desktop: {
                    maxValue: 64.0
                },
                mobile: {
                    maxValue: 64.0,
                }
            }
        };
        this.uiTools = new KSX.apps.tools.UiTools( this.uiToolsConfig );
    }

    HomeUi.prototype.initPreGL = function () {
        this.uiTools.createFeedbackAreaDynamic();
        this.uiTools.announceFeedback( 'Initializing' );
        this.uiTools.enableStats();
    };

    HomeUi.prototype.render = function () {
        this.uiTools.render();
    };

    HomeUi.prototype.announceFeedback = function ( feedback ) {
        this.uiTools.announceFeedback( feedback );
    };

    HomeUi.prototype.buildUi = function ( animate, videoTextureEnabled ) {
        var ui = this.uiTools.ui;

        var groupMain = ui.add('group', {
            name: 'Projection Space Controls',
            height: this.uiTools.paramsDimension.groupHeight
        });
        groupMain.add('slide', {
            name: 'Extrusion',
            callback: this.adjustHeightFactor,
            min: this.uiTools.paramsDimension.minValue,
            max: this.uiTools.paramsDimension.maxValue,
            value: this.projectionSpace.shader.uniforms.heightFactor.value,
            precision: 1,
            step: 1,
            width: this.uiTools.paramsDimension.slidesWidth,
            height: this.uiTools.paramsDimension.slidesHeight,
            stype: this.uiTools.paramsDimension.sliderType
        });
        groupMain.add('bool', {
            name: 'Invert Ext.',
            value: this.projectionSpace.shader.uniforms.invert.value,
            callback: this.invertShader,
            height: this.uiTools.paramsDimension.boolHeight
        });
        groupMain.add('slide', {
            name: 'Box Scale',
            callback: this.adjustBoxScale,
            min: 0.01,
            max: 1.0,
            value: this.projectionSpace.shader.uniforms.scaleBox.value,
            precision: 2,
            step: 0.01,
            width: this.uiTools.paramsDimension.slidesWidth,
            height: this.uiTools.paramsDimension.slidesHeight,
            stype: this.uiTools.paramsDimension.sliderType
        });
        groupMain.add('slide', {
            name: 'Box Spacing',
            callback: this.adjustBoxSpacing,
            min: 0.01,
            max: 10.0,
            value: this.projectionSpace.shader.uniforms.spacing.value,
            precision: 3,
            step: 0.01,
            width: this.uiTools.paramsDimension.slidesWidth,
            height: this.uiTools.paramsDimension.slidesHeight,
            stype: this.uiTools.paramsDimension.sliderType
        });
        groupMain.add('slide', {
            name: 'Instance Count',
            callback: this.adjustBoxCount,
            min: 0,
            max: this.projectionSpace.dimensions.length - 1,
            value: this.projectionSpace.index,
            precision: 1,
            step: 1,
            width: this.uiTools.paramsDimension.slidesWidth,
            height: this.uiTools.paramsDimension.slidesHeight,
            stype: this.uiTools.paramsDimension.sliderType
        });
        groupMain.add('bool', {
            name: 'Animate/Play',
            value: animate,
            callback: this.animate,
            height: this.uiTools.paramsDimension.boolHeight
        });
        groupMain.add('bool', {
            name: 'Enable Video',
            value: videoTextureEnabled,
            callback: this.enableVideo,
            height: this.uiTools.paramsDimension.boolHeight
        });
        ui.add('button', {
            name: 'Reset View and Parameters',
            callback: this.resetViewAndParams,
            width: this.uiTools.paramsDimension.buttonWidth,
            height: this.uiTools.paramsDimension.buttonHeight
        });

        groupMain.open();
    };

    HomeUi.prototype.resetExtrusionSlide = function ( value ) {
        var group = ui.uis[0];
        var slide = group.uis[0];
        slide.value = value;
        slide.update();
    };

    HomeUi.prototype.resetInvertExtrusionBool = function ( value ) {
        var group = ui.uis[0];
        var bool = group.uis[1];
        bool.value = value;
        bool.update();
    };

    HomeUi.prototype.resetBoxScaleSlide = function ( value ) {
        var group = ui.uis[0];
        var slide = group.uis[2];
        slide.value = value;
        slide.update();
    };

    HomeUi.prototype.resetBoxSpacingSlide = function ( value ) {
        var group = ui.uis[0];
        var slide = group.uis[3];
        slide.value = value;
        slide.update();
    };

    HomeUi.prototype.resetInstantCountSlide = function ( value ) {
        var group = ui.uis[0];
        var slide = group.uis[4];
        slide.value = value;
        slide.update();
    };

    HomeUi.prototype.resetAnimateBool = function ( value ) {
        var group = ui.uis[0];
        var bool = group.uis[5];
        bool.value = value;
        bool.update();
    };

    HomeUi.prototype.resetVideoBool = function ( value ) {
        var group = ui.uis[0];
        var bool = group.uis[6];
        bool.value = value;
        bool.update();
    };

    HomeUi.prototype.resetViewAndParams = function () {
        scope.resetViewAndParameters();

        this.resetBoxScaleSlide( this.projectionSpace.shader.uniforms.scaleBox.value );
        this.resetBoxSpacingSlide( this.projectionSpace.shader.uniforms.spacing.value );
        this.resetExtrusionSlide( this.projectionSpace.dimensions[this.projectionSpace.index].defaultHeightFactor );
        this.resetInvertExtrusionBool(this.projectionSpace.shader.uniforms.invert.value );
        this.resetInstantCountSlide( this.projectionSpace.index );
        this.resetAnimateBool( scope.animate );
        this.resetVideoBool( scope.videoTextureEnabled );
    };


    HomeUi.prototype.adjustHeightFactor = function (value) {
        this.projectionSpace.shader.uniforms.heightFactor.value = value;
    };

    HomeUi.prototype.invertShader = function (value) {
        this.projectionSpace.shader.uniforms.invert.value = value;
    };

    HomeUi.prototype.adjustBoxScale = function (value) {
        this.projectionSpace.shader.uniforms.scaleBox.value = value;
    };

    HomeUi.prototype.adjustBoxSpacing = function (value) {
        this.projectionSpace.shader.uniforms.spacing.value = value;
    };

    HomeUi.prototype.adjustBoxCount = function ( value ) {
        if ( scope.resizeProjectionSpace( value, false ) ) {
            this.resetExtrusionSlide( this.projectionSpace.dimensions[this.projectionSpace.index].defaultHeightFactor );
        }
    };

    HomeUi.prototype.animate = function ( enabled ) {
        scope.animate = enabled;
        scope.checkVideo();
    };

    HomeUi.prototype.enableVideo = function ( enabled ) {
        scope.videoTextureEnabled = enabled;
        scope.checkVideo();
    };

    return HomeUi;
})();
