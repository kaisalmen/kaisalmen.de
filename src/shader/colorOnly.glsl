/**
 * @author Kai Salmen / www.kaisalmen.de
 */

varying vec3 colorInstanceFS;

void main()	{
	
	gl_FragColor = vec4(colorInstanceFS.r, colorInstanceFS.g, colorInstanceFS.b, 1.0);
}
