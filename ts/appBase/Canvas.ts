/**
 * Created by Kai on 23.03.2015.
 */

class Canvas {
    aspectRatio: number;
    width : number;
    height  : number;
    minWidth  : number;

    divGL : HTMLElement;

    constructor(width : number, aspectRatio : number, minWidth : number, divGL : HTMLElement) {
        this.width = width;
        this.aspectRatio = aspectRatio;
        this.height = this.width / this.aspectRatio;
        this.minWidth = minWidth;

       this.divGL = divGL;
    }

    recalcAspectRatio() {
        if (this.width < this.minWidth) {
            this.width = this.minWidth;
        }
        this.height = this.width / this.aspectRatio;

        this.divGL.style.width = this.width + "px";
        this.divGL.style.height = this.height + "px";
    }
}