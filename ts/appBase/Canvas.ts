/**
 * Created by Kai on 23.03.2015.
 */

class Canvas {
    divGL : HTMLElement;
    aspectRatio : number;

    constructor( divGL : HTMLElement) {
        this.divGL = divGL;
    }

    recalcAspectRatio() {
        console.log("width: " + this.divGL.offsetWidth + " height: " + this.divGL.offsetHeight);
        this.aspectRatio = this.getWidth() / this.getHeight();
    }

    getWidth() {
        return this.divGL.offsetWidth - 4;
    }

    getHeight() {
        return this.divGL.offsetHeight - 4;
    }
}