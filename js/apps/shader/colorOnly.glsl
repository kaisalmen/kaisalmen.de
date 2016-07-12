/**
 * @author Kai Salmen / www.kaisalmen.de
 */

varying vec3 colorFS;

void main()	{
	
	gl_FragColor = vec4(colorFS.r, colorFS.g, colorFS.b, 1.0);
}
