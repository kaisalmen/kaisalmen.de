uniform sampler2D texture1;
uniform float blendFactor;
uniform float ilFactor;
uniform float seed;
uniform float colorFactor[3];

varying vec2 vUv;

void main()	{
	vec4 texValue = texture2D(texture1, vUv);
	float extraCol = clamp(sin(seed), 0.44, 0.56) + 0.44;
	texValue.r = texValue.r * colorFactor[0] * extraCol;
	texValue.g = texValue.g * colorFactor[1] * extraCol;
	texValue.b = texValue.b * colorFactor[2] * extraCol;
	texValue.a = blendFactor * mod(vUv.y * ilFactor, 2.0);
	gl_FragColor = texValue;
}
