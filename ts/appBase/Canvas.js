/**
 * Created by Kai on 23.03.2015.
 */
var Canvas = (function () {
    function Canvas(htmlCanvas) {
        this.htmlCanvas = htmlCanvas;
    }
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
//# sourceMappingURL=Canvas.js.map