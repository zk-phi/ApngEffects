import { WebGLEffect } from "../types";
import { webglEffectShader, webglLoadEffectShader, webglSetFloat } from "../utils/webgl";
import shaderFade from "../shaders/transitionFade.glsl";

const shader = webglEffectShader(shaderFade.sourceCode);

const webglTransitionFadeOut: WebGLEffect = (keyframe) => {
  const program = webglLoadEffectShader(shader);
  webglSetFloat(program, "keyframe", keyframe);
  return program;
};

export default webglTransitionFadeOut;
