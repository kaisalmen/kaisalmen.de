/**
 * Created by Kai Salmen.
 */

"use strict";

/**
 * This class was started with typescript
 */
KSX.apps.core.Canvas = (function () {

    function Canvas(htmlCanvas, verbose) {
        this.init(htmlCanvas);
        this.verbose = verbose;
    }

    Canvas.prototype.init = function (htmlCanvas) {
        this.htmlCanvas = htmlCanvas;
        this.recalcAspectRatio();
    };

    Canvas.prototype.recalcAspectRatio = function () {
        if (this.verbose) {
            console.log("width: " + this.getWidth() + " height: " + this.getHeight());
        }
        this.aspectRatio = this.getWidth() / this.getHeight();
    };

    Canvas.prototype.getWidth = function () {
        return this.htmlCanvas.offsetWidth;
    };

    Canvas.prototype.getHeight = function () {
        return this.htmlCanvas.offsetHeight;
    };

    return Canvas;
})()
