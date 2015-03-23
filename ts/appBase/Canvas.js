/**
 * Created by Kai on 23.03.2015.
 */
var Canvas = (function () {
    function Canvas(width, aspectRatio, minWidth, divGL) {
        this.width = width;
        this.aspectRatio = aspectRatio;
        this.height = this.width / this.aspectRatio;
        this.minWidth = minWidth;
        this.divGL = divGL;
    }
    Canvas.prototype.recalcAspectRatio = function () {
        if (this.width < this.minWidth) {
            this.width = this.minWidth;
        }
        this.height = this.width / this.aspectRatio;
        this.divGL.style.width = this.width + "px";
        this.divGL.style.height = this.height + "px";
    };
    return Canvas;
})();
//# sourceMappingURL=Canvas.js.map