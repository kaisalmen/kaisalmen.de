/**
 * @author Kai Salmen / www.kaisalmen.de
 */

uniform float heightFactor;
uniform float uvRandom;
uniform float scaleBox;
uniform float spacing;
uniform bool useUvRange;
uniform bool invert;
uniform sampler2D texture1;

attribute vec3 offset;
attribute vec2 uvRange;

varying vec2 vUv;

void main()	{
	if (useUvRange) {
	    vUv = uvRandom * uvRange;
	}
	else {
	    vUv = uv;
	}

	vec4 texValue = texture2D(texture1, vUv);
	float modifiedZ = position.z;
	if (modifiedZ > 0.0) {
        if (invert) {
            modifiedZ += offset.z + heightFactor * (3.0 - length(texValue));
        }
        else {
            modifiedZ += offset.z + heightFactor * length(texValue);
        }
	}

	vec4 posNew = vec4(offset.x * spacing + position.x * scaleBox, offset.y * spacing + position.y * scaleBox, modifiedZ, 1.0);
	gl_Position = projectionMatrix * modelViewMatrix * posNew;
}
