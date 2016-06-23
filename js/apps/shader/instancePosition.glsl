/**
 * @author Kai Salmen / www.kaisalmen.de
 */

uniform float heightFactor;
uniform float uvScaleU;
uniform float uvScaleV;
uniform float scaleBox;
uniform bool invert;
uniform sampler2D texture1;

attribute vec3 offset;
attribute vec4 uvRange;

varying vec2 vUv;

void main()	{
	//vUv.x = uvRange.x + uv.x * uvScaleU;
	//vUv.y = uvRange.y + uv.y * uvScaleV;
	vUv.x = uvRange.x;
    vUv.y = uvRange.y;

	vec4 texValue = texture2D(texture1, vUv);
	float modifiedZ = position.z;
	if (modifiedZ > 0.0) {
        if (invert) {
            modifiedZ += heightFactor * (1.0 - texValue.r + 1.0 - texValue.g + 1.0 - texValue.b) / 3.0;
        }
        else {
            modifiedZ += heightFactor * (texValue.r + texValue.g + texValue.b) / 3.0;
        }
	}

	vec4 posNew = vec4(offset.x + position.x * scaleBox, offset.y + position.y * scaleBox, offset.z + modifiedZ, 1.0);
	gl_Position = projectionMatrix * modelViewMatrix * posNew;
}
