/**
 * @author Kai Salmen / www.kaisalmen.de
 */

'use strict';

KSX.apps.tools.UiTools = (function () {

    function UiTools(params, paramsDimension, mobile) {
        UIL.BUTTON = '#FF4040';
        this.ui = new UIL.Gui(params);

        if (mobile) {
            this.paramsDimension = paramsDimension.mobile;
            if (this.paramsDimension === undefined) {
                this.paramsDimension = {};
            }
            checkParams(KSX.apps.tools.UiTools.DefaultParams.mobile, this.paramsDimension);
        }
        else {
            this.paramsDimension = paramsDimension.desktop;
            if (this.paramsDimension === undefined) {
                this.paramsDimension = {};
            }
            checkParams(KSX.apps.tools.UiTools.DefaultParams.desktop, this.paramsDimension);
        }
    }

    var checkParams = function (paramsPredefined, paramsUser) {
        var potentialValue;
        for (var predefined in paramsPredefined) {
            potentialValue = paramsUser[predefined];

            if (potentialValue !== undefined) {
                paramsPredefined[predefined] = potentialValue;
            }
            else {
                paramsUser[predefined] = paramsPredefined[predefined];
            }
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
        slidesHeight : 96,
        sliderType : 2,
        buttonWidth : 104,
        buttonHeight : 96,
        minValue : 0.0,
        maxValue : 128.0,
        groupHeight : 36,
        boolHeight : 24
    }
};
