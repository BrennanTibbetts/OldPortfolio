uniform vec3 uInsideColor;
uniform vec3 uOutsideColor;
uniform float uColorSteepness;

varying float vDisplacement;

void main() {
    vec3 mixedColor = mix(uInsideColor, uOutsideColor, vDisplacement * uColorSteepness);
    gl_FragColor = vec4(mixedColor, 1.0);
}