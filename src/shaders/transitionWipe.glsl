precision highp float;
uniform sampler2D texture;
uniform sampler2D subTexture;
varying vec2 vUv;

uniform float keyframe;

void main() {
    float pos = vUv.x + .5 * keyframe;
    gl_FragColor = mix(
        texture2D(texture, vUv),
        texture2D(subTexture, vUv),
        step(.25, pos) - step(.75, pos)
    );
}
