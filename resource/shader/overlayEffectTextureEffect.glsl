uniform sampler2D texture1;
uniform float blendFactor;
uniform float ilFactor;
uniform float seed;
uniform float colorFactor[3];

varying vec2 vUv;

void main()	{
	vec4 texValue = texture2D(texture1, vUv);
	float extraCol = clamp(sin(seed), 0.47, 0.53) + 0.47;
	texValue.r = texValue.r * colorFactor[0] * extraCol;
	texValue.g = texValue.g * colorFactor[1] * extraCol;
	texValue.b = texValue.b * colorFactor[2] * extraCol;
	texValue.a = blendFactor * sin(vUv.y * ilFactor);
	gl_FragColor = texValue;
}
