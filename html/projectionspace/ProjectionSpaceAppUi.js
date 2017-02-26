/**
 * @author Kai Salmen / www.kaisalmen.de
 */

'use strict';

if (KSX.apps.demos.home === undefined) {
    KSX.apps.demos.home = {};
}

KSX.apps.demos.home.Ui = (function () {

    function HomeUi( mobileDevice, model ) {
        this.model = model;

        this.uiToolsConfig = {
            mobileDevice: mobileDevice,
            useUil: true,
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
            },
            useStats: true
        };
        this.uiTools = new KSX.apps.tools.UiTools( this.uiToolsConfig );
    }

    HomeUi.prototype.initPreGL = function () {
        this.uiTools.createFeedbackAreaDynamic();
        this.uiTools.announceFeedback( 'Initializing' );
        this.uiTools.enableStats();
    };

    HomeUi.prototype.render = function () {
        this.uiTools.updateStats();
    };

    HomeUi.prototype.announceFeedback = function ( feedback ) {
        this.uiTools.announceFeedback( feedback );
    };

    var resetExtrusionSlide = function ( ui, value ) {
        var group = ui.uis[0];
        var slide = group.uis[0];
        slide.value = value;
        slide.update();
    };
    var resetInvertExtrusionBool = function ( ui, value ) {
        var group = ui.uis[0];
        var bool = group.uis[1];
        bool.value = value;
        bool.update();
    };
    var resetBoxScaleSlide = function ( ui, value ) {
        var group = ui.uis[0];
        var slide = group.uis[2];
        slide.value = value;
        slide.update();
    };
    var resetBoxSpacingSlide = function ( ui, value ) {
        var group = ui.uis[0];
        var slide = group.uis[3];
        slide.value = value;
        slide.update();
    };
    var resetInstantCountSlide = function ( ui, value ) {
        var group = ui.uis[0];
        var slide = group.uis[4];
        slide.value = value;
        slide.update();
    };
    var resetAnimateBool = function ( ui, value ) {
        var group = ui.uis[0];
        var bool = group.uis[5];
        bool.value = value;
        bool.update();
    };
    var resetVideoBool = function ( ui, value ) {
        var group = ui.uis[0];
        var bool = group.uis[6];
        bool.value = value;
        bool.update();
    };

    var resetViewAndParams = function ( scope ) {
        var ui = scope.uiTools.ui;

        scope.model.callbacks.resetViewAndParameters();
        resetExtrusionSlide( ui, scope.model.projectionSpace.dimensions[scope.model.projectionSpace.index].defaultHeightFactor );
        resetBoxScaleSlide( ui, scope.model.projectionSpace.shader.uniforms.scaleBox.value );
        resetBoxSpacingSlide( ui, scope.model.projectionSpace.shader.uniforms.spacing.value );
        resetInvertExtrusionBool(ui, scope.model.projectionSpace.shader.uniforms.invert.value );
        resetInstantCountSlide( ui, scope.model.projectionSpace.index );
        resetAnimateBool( ui, scope.model.animate );
        resetVideoBool( ui, scope.model.videoTextureEnabled );
    };

    HomeUi.prototype.buildUi = function () {
        var scope = this;
        var ui = scope.uiTools.ui;

        var adjustHeightFactor = function (value) {
            scope.model.projectionSpace.shader.uniforms.heightFactor.value = value;
        };
        var invertShader = function (value) {
            scope.model.projectionSpace.shader.uniforms.invert.value = value;
        };
        var adjustBoxScale = function (value) {
            scope.model.projectionSpace.shader.uniforms.scaleBox.value = value;
        };
        var adjustBoxSpacing = function (value) {
            scope.model.projectionSpace.shader.uniforms.spacing.value = value;
        };
        var adjustBoxCount = function ( value ) {
            if ( scope.model.callbacks.resizeProjectionSpace( value, false ) ) {
                resetExtrusionSlide( ui, scope.model.projectionSpace.dimensions[scope.model.projectionSpace.index].defaultHeightFactor );
            }
        };
        var animate = function ( enabled ) {
            scope.model.animate = enabled;
            scope.model.callbacks.checkVideo();
        };
        var enableVideo = function ( enabled ) {
            scope.model.videoTextureEnabled = enabled;
            scope.model.callbacks.checkVideo();
        };
        var resetViewAndParamsUi = function () {
            resetViewAndParams( scope );
        };

        var groupMain = ui.add('group', {
            name: 'Projection Space Controls',
            height: scope.uiTools.paramsDimension.groupHeight
        });
        groupMain.add('slide', {
            name: 'Extrusion',
            callback: adjustHeightFactor,
            min: scope.uiTools.paramsDimension.minValue,
            max: scope.uiTools.paramsDimension.maxValue,
            value: scope.model.projectionSpace.shader.uniforms.heightFactor.value,
            precision: 1,
            step: 1,
            width: scope.uiTools.paramsDimension.slidesWidth,
            height: scope.uiTools.paramsDimension.slidesHeight,
            stype: scope.uiTools.paramsDimension.sliderType
        });
        groupMain.add('bool', {
            name: 'Invert Ext.',
            callback: invertShader,
            value: scope.model.projectionSpace.shader.uniforms.invert.value,
            height: scope.uiTools.paramsDimension.boolHeight
        });
        groupMain.add('slide', {
            name: 'Box Scale',
            callback: adjustBoxScale,
            min: 0.01,
            max: 1.0,
            value: scope.model.projectionSpace.shader.uniforms.scaleBox.value,
            precision: 2,
            step: 0.01,
            width: scope.uiTools.paramsDimension.slidesWidth,
            height: scope.uiTools.paramsDimension.slidesHeight,
            stype: scope.uiTools.paramsDimension.sliderType
        });
        groupMain.add('slide', {
            name: 'Box Spacing',
            callback: adjustBoxSpacing,
            min: 0.01,
            max: 10.0,
            value: scope.model.projectionSpace.shader.uniforms.spacing.value,
            precision: 3,
            step: 0.01,
            width: scope.uiTools.paramsDimension.slidesWidth,
            height: scope.uiTools.paramsDimension.slidesHeight,
            stype: scope.uiTools.paramsDimension.sliderType
        });
        groupMain.add('slide', {
            name: 'Instance Count',
            callback: adjustBoxCount,
            min: 0,
            max: scope.model.projectionSpace.dimensions.length - 1,
            value: scope.model.projectionSpace.index,
            precision: 1,
            step: 1,
            width: scope.uiTools.paramsDimension.slidesWidth,
            height: scope.uiTools.paramsDimension.slidesHeight,
            stype: scope.uiTools.paramsDimension.sliderType
        });
        groupMain.add('bool', {
            name: 'Animate/Play',
            callback: animate,
            value: scope.model.animate,
            height: scope.uiTools.paramsDimension.boolHeight
        });
        groupMain.add('bool', {
            name: 'Enable Video',
            callback: enableVideo,
            value: scope.model.videoTextureEnabled,
            height: scope.uiTools.paramsDimension.boolHeight
        });
        groupMain.add('button', {
            name: 'Reset View and Parameters',
            callback: resetViewAndParamsUi,
            width: scope.uiTools.paramsDimension.buttonWidth,
            height: scope.uiTools.paramsDimension.buttonHeight
        });

        groupMain.open();
    };

    return HomeUi;
})();
