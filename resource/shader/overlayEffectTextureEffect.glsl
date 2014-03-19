uniform sampler2D texture1;
uniform float blendFactor;
uniform float interlaceFactor;
uniform float colorFactor[3];

varying vec2 vUv;

void main()	{
	vec4 texValue = texture2D(texture1, vUv);
	texValue.r = texValue.r * colorFactor[0];
	texValue.g = texValue.g * colorFactor[1];
	texValue.b = texValue.b * colorFactor[2];
	texValue.a = blendFactor * sin(vUv.y * 1024.0);
	gl_FragColor = texValue;
}
