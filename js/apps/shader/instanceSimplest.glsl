/**
 * @author Kai Salmen / www.kaisalmen.de
 */

attribute vec3 offset;
attribute vec3 color;

varying vec3 colorFS;

void main()	{
	colorFS = color;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(offset.x + position.x, offset.y + position.y, offset.z + position.z, 1.0);
}
