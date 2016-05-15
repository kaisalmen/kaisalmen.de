#define NOISE_DAMPER    2.5

uniform sampler2D texture1;
uniform float blendFactor;
uniform float colorFactor[3];

varying vec2 vUv;

void main()	{
	vec4 texValue = texture2D(texture1, vUv);
	texValue.r = texValue.r * colorFactor[0] - rand(vUv) / NOISE_DAMPER;
	texValue.g = texValue.g * colorFactor[1] - rand(vUv) / NOISE_DAMPER;
	texValue.b = texValue.b * colorFactor[2] - rand(vUv) / NOISE_DAMPER;
	texValue.a = blendFactor;

	gl_FragColor = texValue;
}
