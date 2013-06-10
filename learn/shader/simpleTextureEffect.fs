uniform sampler2D texture1;
uniform float blendFactor;

varying vec2 vUv;

void main()	{
	//vec4 texValue = texture2D(texture1, vUv);
	//gl_FragColor = vec4(blendFactor * texValue.r / 255.0, blendFactor * texValue.g / 255.0, blendFactor * texValue.b / 255.0, 1.0);
	//gl_FragColor = vec4(1.0 * blendFactor, 1.0 * blendFactor, 1.0 * blendFactor, 1.0);
	gl_FragColor = texture2D(texture1, vUv);
}
