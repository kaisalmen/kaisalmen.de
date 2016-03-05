/**
 * Created by Kai Salmen.
 */

"use strict";

/**
 * This class was started with typescript
 */
KSX.apps.core.Canvas = (function () {

    function Canvas(htmlCanvas) {
        this.init(htmlCanvas);
        this.verbose = false;
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

    Canvas.prototype.resetWidth = function (width, height) {
        this.htmlCanvas.style.width = width + 'px';
        this.htmlCanvas.style.height = height + 'px';
        this.recalcAspectRatio();
    };

    Canvas.prototype.getWidth = function () {
        return this.htmlCanvas.offsetWidth;
    };

    Canvas.prototype.getHeight = function () {
        return this.htmlCanvas.offsetHeight;
    };

    Canvas.prototype.getPixelLeft = function () {
        return -this.getWidth() / 2;
    };

    Canvas.prototype.getPixelRight = function () {
        return this.getWidth() / 2;
    };

    Canvas.prototype.getPixelTop = function () {
        return this.getHeight() / 2;
    };

    Canvas.prototype.getPixelBottom = function () {
        return -this.getHeight() / 2;
    };

    return Canvas;

0})();
