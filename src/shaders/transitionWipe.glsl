precision highp float;
uniform sampler2D texture;
uniform sampler2D subTexture;
varying vec2 vUv;

uniform float keyframe;

void main() {
    gl_FragColor =
        texture2D(subTexture, vUv + (keyframe + 1.) * vec2(.5, 0.)) +
        texture2D(texture, vUv + keyframe * vec2(.5, 0.)) +
        texture2D(subTexture, vUv + (keyframe - 1.) * vec2(.5, 0.));
}
