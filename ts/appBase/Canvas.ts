/**
 * Created by Kai on 23.03.2015.
 */

class Canvas {
    htmlCanvas : HTMLCanvasElement;
    aspectRatio : number;

    constructor(htmlCanvas : HTMLCanvasElement) {
        this.htmlCanvas = htmlCanvas;
    }

    recalcAspectRatio() {
        console.log("width: " + this.htmlCanvas.offsetWidth + " height: " + this.htmlCanvas.offsetHeight);
        this.aspectRatio = this.getWidth() / this.getHeight();
    }

    getWidth() {
        return this.htmlCanvas.offsetWidth;
    }

    getHeight() {
        return this.htmlCanvas.offsetHeight;
    }
}