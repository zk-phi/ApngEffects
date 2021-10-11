precision highp float;
uniform sampler2D texture;
uniform sampler2D subTexture;
varying vec2 vUv;

uniform float keyframe;

@include "./utils/premultiplied.glsl"
@include "./utils/unmultiplied.glsl"

void main() {
    gl_FragColor = unmultiplied(
        mix(
            premultiplied(texture2D(texture, vUv)),
            premultiplied(texture2D(subTexture, vUv)),
            abs(keyframe)
        )
    );
}
