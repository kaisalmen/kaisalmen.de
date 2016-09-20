/**
 * @author Kai Salmen / www.kaisalmen.de
 */

'use strict';

KSX.apps.tools.UiTools = (function () {

    function UiTools( uiToolsConfig ) {
        if ( uiToolsConfig.useUil ) {
            UIL.BUTTON = '#FF4040';

            if ( uiToolsConfig.uilParams.size === undefined && uiToolsConfig.uilParams.width !== undefined ) {
                uiToolsConfig.uilParams.size = uiToolsConfig.uilParams.width;
            }
            this.ui = new UIL.Gui( uiToolsConfig.uilParams );

            if ( uiToolsConfig.mobileDevice ) {
                this.paramsDimension = uiToolsConfig.paramsDimension.mobile;
                if (this.paramsDimension === undefined) {
                    this.paramsDimension = {};
                }
                checkDimensionParams( KSX.apps.tools.UiTools.DefaultParams.mobile, this.paramsDimension );
            }
            else {
                this.paramsDimension = uiToolsConfig.paramsDimension.desktop;
                if (this.paramsDimension === undefined) {
                    this.paramsDimension = {};
                }
                checkDimensionParams( KSX.apps.tools.UiTools.DefaultParams.desktop, this.paramsDimension );
            }
        }

        this.divDynamic = null;

        this.stats = null;
        if ( uiToolsConfig.useStats ) {
            this.stats = new Stats();
            var styleDefaults = {
                position: 'absolute',
                left: '',
                right: '0px',
                top: '',
                bottom: '0px'
            };

            addStatStyles( this.stats.domElement.style, styleDefaults );
            addStatStyles( this.stats.domElement.style, uiToolsConfig.statsParams );
        }
    }

    var addStatStyles = function ( statStyles, userStyleProps ) {
        if ( userStyleProps === null || userStyleProps === undefined ) {
            return;
        }

        for ( var styleParam in userStyleProps ) {
            if ( userStyleProps.hasOwnProperty(styleParam)) {
                statStyles[styleParam] = userStyleProps[styleParam];
            }
        }
    };

    var checkDimensionParams = function ( paramsPredefined, paramsUser ) {
        for ( var predefined in paramsPredefined ) {
            if ( paramsPredefined.hasOwnProperty(predefined) ) {
                if ( paramsUser.hasOwnProperty(predefined) ) {
                    paramsPredefined[predefined] = paramsUser[predefined];
                }
                else {
                    paramsUser[predefined] = paramsPredefined[predefined];
                }
            }
        }
    };

    UiTools.prototype.createFeedbackAreaDynamic = function ( ) {
        var divFeedbackArea = document.getElementById( 'FeedbackArea' );
        if ( divFeedbackArea === undefined || divFeedbackArea === null ) {

            divFeedbackArea = document.createElement( 'div' );
            divFeedbackArea.id = 'FeedbackArea';
            divFeedbackArea.className = 'feedback';

            var body = document.body;
            body.insertBefore( divFeedbackArea, body.childNodes[0] );
            console.log( 'Div "FeedbackArea" was added to body' );
        }

        var children = divFeedbackArea.childNodes;
        var child;
        for ( var key in children ) {
            child = children[key];
            if ( child['className'] === 'dynamicFeedback' ) {
                this.divDynamic = child;
            }
        }

        if ( this.divDynamic === undefined || this.divDynamic === null ) {
            this.divDynamic = document.createElement( 'div' );
            this.divDynamic.id = 'DynamicFeedback';
            this.divDynamic.className = 'dynamicFeedback';

            divFeedbackArea.insertBefore( this.divDynamic,  divFeedbackArea.childNodes[0] );
            console.log( 'Div "dynamicFeedback" was added to div FeedbackArea' );
        }
    };

    UiTools.prototype.announceFeedback = function ( text ) {
        if ( this.divDynamic !== null ) {
            this.divDynamic.innerHTML = text;
        }
    };

    UiTools.prototype.enableStats = function () {
        if ( this.stats !== null ) {
            this.stats.showPanel(0);
            document.body.appendChild(this.stats.domElement);
        }
    };

    UiTools.prototype.updateStats = function () {
        if ( this.stats !== null ) {
            this.stats.update();
        }
    };

    return UiTools;
})();

KSX.apps.tools.UiTools.DefaultParams = {
    desktop : {
        slidesWidth : 255,
        slidesHeight : 32,
        sliderType : 2,
        buttonWidth : 104,
        buttonHeight : 32,
        minValue : 0.0,
        maxValue : 128.0,
        groupHeight : 36,
        boolHeight : 24
    },
    mobile : {
        slidesWidth : 255,
        slidesHeight : 48,
        sliderType : 2,
        buttonWidth : 104,
        buttonHeight : 48,
        minValue : 0.0,
        maxValue : 128.0,
        groupHeight : 36,
        boolHeight : 48
    }
};
