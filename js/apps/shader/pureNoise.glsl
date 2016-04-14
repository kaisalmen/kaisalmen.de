#include <common>

#define NOISE_DAMPER    1.0

varying vec2 vUv;

void main()	{
	gl_FragColor.r = tan(rand(vUv));
	gl_FragColor.g = cos(rand(vUv));
	gl_FragColor.b = sin(rand(vUv));
	gl_FragColor.a = 1.0;
}
