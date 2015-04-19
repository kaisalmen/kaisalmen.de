/**
 * Created by Kai on 23.03.2015.
 */
var Canvas = (function () {
    function Canvas(divGL) {
        this.divGL = divGL;
    }
    Canvas.prototype.recalcAspectRatio = function () {
        console.log("width: " + this.divGL.offsetWidth + " height: " + this.divGL.offsetHeight);
        this.aspectRatio = this.getWidth() / this.getHeight();
    };
    Canvas.prototype.getWidth = function () {
        return this.divGL.offsetWidth - 4;
    };
    Canvas.prototype.getHeight = function () {
        return this.divGL.offsetHeight - 4;
    };
    return Canvas;
})();
//# sourceMappingURL=Canvas.js.map