import { WebGLEffect } from "../types";
import { webglEffectShader, webglLoadEffectShader, webglSetFloat } from "../utils/webgl";
import shaderSlide from "../shaders/transitionSlide.glsl";

const shader = webglEffectShader(shaderSlide.sourceCode);

const webglTransitionSlideIn: WebGLEffect = (keyframe) => {
  const program = webglLoadEffectShader(shader);
  webglSetFloat(program, "keyframe", keyframe - 1);
  return program;
};

export default webglTransitionSlideIn;
