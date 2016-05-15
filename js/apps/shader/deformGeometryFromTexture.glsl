varying vec2 vUv;
uniform sampler2D Texture1;
		
void main()	{
	vUv = uv;
	vec4 texValue = texture2D(texture1, vUv);
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
