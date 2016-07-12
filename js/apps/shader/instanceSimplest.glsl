/**
 * @author Kai Salmen / www.kaisalmen.de
 */

attribute vec3 offset;

void main()	{
	gl_Position = projectionMatrix * modelViewMatrix * vec4(offset.x + position.x, offset.y + position.y, offset.z + position.z, 1.0);
}
