/**
 * @author Kai Salmen / www.kaisalmen.de
 */

attribute vec3 offset;
attribute vec3 colorInstanceVS;

varying vec3 colorInstanceFS;

void main()	{
	colorInstanceFS  = colorInstanceVS;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(offset.x + position.x, offset.y + position.y, offset.z + position.z, 1.0);
}
