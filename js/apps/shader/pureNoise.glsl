/**
 * @author Kai Salmen / www.kaisalmen.de
 */

varying vec2 vUv;

uniform float offsetR;
uniform float offsetG;
uniform float offsetB;
uniform float width;
uniform float height;
uniform bool useR;
uniform bool useG;
uniform bool useB;

float calcVUVShift (float colorOffset) {
    float x = floor((vUv.x + floor(colorOffset * width)) * width) / width;
    float y = floor((vUv.y + floor(colorOffset * height)) * height) / height;
    float randValShift = rand(vec2(x, y));
    if (randValShift > 1.0) {
        randValShift--;
    }
    return randValShift;
}

void main()	{
    if (useR) {
	    gl_FragColor.r = calcVUVShift(offsetR);
	}
	else {
	    gl_FragColor.r = 0.0;
	}

	if (useG) {
	    gl_FragColor.g = calcVUVShift(offsetG);
	}
    else {
        gl_FragColor.g = 0.0;
    }

    if (useB) {
        gl_FragColor.b = calcVUVShift(offsetB);
    }
    else {
        gl_FragColor.b = 0.0;
    }
	gl_FragColor.a = 1.0;
}
