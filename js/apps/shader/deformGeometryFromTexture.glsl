/**
 * @author Kai Salmen / www.kaisalmen.de
 */

varying vec2 vUv;
uniform sampler2D texture1;
uniform float heightFactor;
uniform bool invert;
		
void main()	{
	vUv = uv;
	vec4 texValue = texture2D(texture1, vUv);
	float modifiedZ = position.z;
	if (modifiedZ > 0.0) {
	    if (invert) {
	        modifiedZ += heightFactor * (3.0 - texValue.r - texValue.g - texValue.b);
	    }
	    else {
	        modifiedZ += heightFactor * (texValue.r + texValue.g + texValue.b);
	    }
	}
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x, position.y, modifiedZ, 1.0);
}
