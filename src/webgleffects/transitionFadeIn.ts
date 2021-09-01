import { WebGLEffect } from "../types";
import { webglEffectShader, webglLoadEffectShader, webglSetFloat } from "../utils/webgl";
import shaderFade from "../shaders/transitionFade.glsl";

const shader = webglEffectShader(shaderFade.sourceCode);

const webglTransitionFadeIn: WebGLEffect = (keyframe) => {
  const program = webglLoadEffectShader(shader);
  webglSetFloat(program, "keyframe", keyframe - 1);
  return program;
};

export default webglTransitionFadeIn;
