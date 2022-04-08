uniform float time;
uniform float progress;
uniform sampler2D image;
uniform sampler2D displacement;
uniform vec4 resolution;

varying vec2 vUv;
varying vec4 vPosition;

void main() {

	vec4 displacement = texture2D(displacement, vUv.yx);

	vec2 displacementUV = vec2(
		vUv.x,
		vUv.y
	);

	displacementUV.y = mix(vUv.y, displacement.r - 0.2, progress);

	vec4 color = texture2D(image, displacementUV);

	color.r = texture2D(image, displacementUV + vec2(0., 0.005) * progress).r;
	color.g = texture2D(image, displacementUV + vec2(0., 0.01)  * progress).g;
	color.b = texture2D(image, displacementUV + vec2(0., 0.02)  * progress).b;


	gl_FragColor = color;
}