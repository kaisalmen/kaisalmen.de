varying vec2 vUv;

uniform float offsetR;
uniform float offsetG;
uniform float offsetB;
uniform float width;
uniform float height;

void main()	{
    vec2 rOffset = vec2(floor((vUv.x + offsetR) * width) / width, floor((vUv.y + offsetR) * height) / height);
    vec2 gOffset = vec2(floor((vUv.x + offsetG) * width) / width, floor((vUv.y + offsetG) * height) / height);
    vec2 bOffset = vec2(floor((vUv.x + offsetB) * width) / width, floor((vUv.y + offsetB) * height) / height);

	gl_FragColor.r = rand(clamp(rOffset, 0.0, 255.0));
	gl_FragColor.g = rand(clamp(gOffset, 0.0, 255.0));
	gl_FragColor.b = rand(clamp(bOffset, 0.0, 255.0));
	gl_FragColor.a = 1.0;
}
