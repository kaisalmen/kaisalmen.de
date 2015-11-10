/**
 * Created by Kai Salmen.
 */

"use strict";

/**
 * This class was started with typescript
 */
var Canvas = (function () {

    function Canvas(htmlCanvas) {
        this.init(htmlCanvas);
    }

    Canvas.prototype.init = function (htmlCanvas) {
        this.htmlCanvas = htmlCanvas;
        this.recalcAspectRatio();
    };

    Canvas.prototype.recalcAspectRatio = function () {
        console.log("width: " + this.htmlCanvas.offsetWidth + " height: " + this.htmlCanvas.offsetHeight);
        this.aspectRatio = this.getWidth() / this.getHeight();
    };

    Canvas.prototype.getWidth = function () {
        return this.htmlCanvas.offsetWidth;
    };

    Canvas.prototype.getHeight = function () {
        return this.htmlCanvas.offsetHeight;
    };

    return Canvas;
})();
