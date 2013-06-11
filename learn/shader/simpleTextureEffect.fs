uniform sampler2D texture1;
uniform float blendFactor;

varying vec2 vUv;

void main()	{
	vec4 texValue = texture2D(texture1, vUv);
	texValue.a = blendFactor;
	//gl_FragColor = vec4(texValue.r, texValue.g, texValue.b, 1.0 * blendFactor);
	gl_FragColor = texValue;
}
