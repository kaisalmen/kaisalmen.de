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
    return rand(vec2(x, y));
}

void main()	{
    if (useR) {
        float randValShiftR = calcVUVShift(offsetR);
        if (randValShiftR > 1.0) randValShiftR -= 1.0;
	    gl_FragColor.r = randValShiftR;
	}
	else {
	    gl_FragColor.r = 0.0;
	}

	if (useG) {
	    float randValShiftG = calcVUVShift(offsetG);
	    if (randValShiftG > 1.0) randValShiftG -= 1.0;
	    gl_FragColor.g = randValShiftG;
	}
    else {
        gl_FragColor.g = 0.0;
    }

    if (useB) {
    	float randValShiftB = calcVUVShift(offsetB);
        if (randValShiftB > 1.0) randValShiftB -= 1.0;
        gl_FragColor.b = randValShiftB;
    }
    else {
        gl_FragColor.b = 0.0;
    }
	gl_FragColor.a = 1.0;
}
