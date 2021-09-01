precision highp float;
uniform sampler2D texture;
uniform sampler2D subTexture;
varying vec2 vUv;

uniform float keyframe;
uniform vec2 direction;

void main() {
    gl_FragColor =
        texture2D(subTexture, vUv + (keyframe + 1.) * .5 * direction) +
        texture2D(texture, vUv + keyframe * .5 * direction) +
        texture2D(subTexture, vUv + (keyframe - 1.) * .5 * direction);
}
