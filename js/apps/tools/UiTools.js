/**
 * Created by Kai Salmen.
 */

'use strict';

KSX.apps.tools.UiTools = (function () {

    var allDimensionParams = {
        desktop : {
            slidesWidth: 255,
            slidesHeight: 32,
            buttomWidth: 104,
            buttomHeight: 32,
            minValue: 0.0,
            maxValue: 255.0
        },
        mobile : {
            slidesWidth: 255,
            slidesHeight: 128,
            buttomWidth: 104,
            buttomHeight: 128,
            minValue: 0.0,
            maxValue: 255.0
        }
    };

    function UiTools(params, paramsDimension, mobile) {
        UIL.BUTTON = '#FF4040';
        this.ui = new UIL.Gui(params);

        if (mobile) {
            checkParams(allDimensionParams.mobile, paramsDimension.mobile);
            this.paramsDimension = allDimensionParams.mobile;
        }
        else {
            checkParams(allDimensionParams.desktop, paramsDimension.desktop);
            this.paramsDimension = allDimensionParams.desktop;
        }
    }

    var checkParams = function (paramsPredefined, paramsUser) {
        if (paramsUser !== undefined) {
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
        }
    };

    return UiTools;
})();
