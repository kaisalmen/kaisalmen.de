varying vec2 vUv;
uniform sampler2D texture1;
		
void main()	{
	vUv = uv;
	vec4 texValue = texture2D(texture1, vUv);
	//vec4 modifiedPosition = vec4(position.x, position.y, position.z + texValue.b, 1.0);
	vec4 modifiedPosition = vec4(position.x, position.y, position.z, 1.0);
	gl_Position = projectionMatrix * modelViewMatrix * modifiedPosition;
}
