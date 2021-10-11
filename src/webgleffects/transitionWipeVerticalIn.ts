import { WebGLEffect } from "../types";
import {
  webglEffectShader,
  webglLoadEffectShader,
  webglSetFloat,
  webglSetVec2,
} from "../utils/webgl";
import shaderWipe from "../shaders/transitionWipe.glsl";

const shader = webglEffectShader(shaderWipe.sourceCode);

const webglTransitionWipeVerticalIn: WebGLEffect = (keyframe) => {
  const program = webglLoadEffectShader(shader);
  webglSetFloat(program, "keyframe", -keyframe);
  webglSetVec2(program, "direction", [0, 1]);
  return program;
};

export default webglTransitionWipeVerticalIn;
