import { WebGLEffect } from "../types";
import { webglEffectShader, webglLoadEffectShader, webglSetFloat } from "../utils/webgl";
import shaderWipe from "../shaders/transitionWipe.glsl";

const shader = webglEffectShader(shaderWipe.sourceCode);

const webglTransitionWipe: WebGLEffect = (keyframe) => {
  const program = webglLoadEffectShader(shader);
  webglSetFloat(program, "keyframe", keyframe);
  return program;
};

export default webglTransitionWipe;
