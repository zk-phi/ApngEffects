import { WebGLEffect } from "../types";
import { webglEffectShader, webglLoadEffectShader, webglSetFloat } from "../utils/webgl";
import shaderSlide from "../shaders/transitionSlide.glsl";

const shader = webglEffectShader(shaderSlide.sourceCode);

const webglTransitionSlideOut: WebGLEffect = (keyframe) => {
  const program = webglLoadEffectShader(shader);
  webglSetFloat(program, "keyframe", keyframe);
  return program;
};

export default webglTransitionSlideOut;
