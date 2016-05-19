varying vec2 vUv;
uniform sampler2D texture1;
uniform float heightFactor;
		
void main()	{
	vUv = uv;
	vec4 texValue = texture2D(texture1, vUv);
	float modifiedZ = position.z;
	if (modifiedZ > 0.0) {
        modifiedZ += heightFactor * (texValue.r + texValue.g + texValue.b) / 3.0;
	}
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x, position.y, modifiedZ, 1.0);
}
