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
        var height = this.getHeight();
        if (height === 0) {
            this.aspectRatio = 1;
        }
        else {
            this.aspectRatio = this.getWidth() / height;
        }
    };

    Canvas.prototype.resetWidth = function (width, height) {
        if (this.htmlCanvas !== null) {
            this.htmlCanvas.style.width = width + 'px';
            this.htmlCanvas.style.height = height + 'px';
        }
        this.recalcAspectRatio();
    };

    Canvas.prototype.getWidth = function () {
        return this.htmlCanvas === null ? 0 : this.htmlCanvas.offsetWidth;
    };

    Canvas.prototype.getHeight = function () {
        return this.htmlCanvas === null ? 0 : this.htmlCanvas.offsetHeight;
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
