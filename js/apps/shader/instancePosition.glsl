/**
 * @author Kai Salmen / www.kaisalmen.de
 */

attribute vec3 offset;

varying vec2 vUv;

void main()	{
	vUv = uv;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(offset + position, 1.0);
}
