uniform sampler2D textureMarble;
uniform sampler2D textureSat;
uniform float blendFactor;
uniform float alphaColor[3];
uniform float lowerBoundary;
uniform float upperBoundary;

#define MIN_PIXEL_VALUE 0.0
#define EARLY_EXIT	0.005
#define MAX_ALPHA 	1.0
#define MIN_ALPHA	0.0

varying vec2 vUv;

float calcPixelChannel(float overlay, float source, float pixelValue, float lowerBoundary, float upperBoundary) {

	// early exit if sat image contains near zero value
	if (step(EARLY_EXIT, pixelValue) == MIN_PIXEL_VALUE) {
		return MIN_PIXEL_VALUE;
	}

	// boundary check and interpolation
	float satAlpha = MAX_ALPHA - smoothstep(lowerBoundary, upperBoundary, pixelValue);

	// eval pixel
	float dist = abs(source - overlay);
	float sign = -1.0 + 2.0 * step(source, overlay);

	return source + sign * dist * satAlpha;
}

void main()	{
	vec4 texValueMarble = texture2D(textureMarble, vUv);
	vec4 textureValueSat = texture2D(textureSat, vUv);

    gl_FragColor.r = calcPixelChannel(alphaColor[0], texValueMarble.r, textureValueSat.r, lowerBoundary, upperBoundary);
    gl_FragColor.g = calcPixelChannel(alphaColor[1], texValueMarble.g, textureValueSat.g, lowerBoundary, upperBoundary);
    gl_FragColor.b = calcPixelChannel(alphaColor[2], texValueMarble.b, textureValueSat.b, lowerBoundary, upperBoundary);
    gl_FragColor.a = blendFactor;
}
