import { WebGLEffect } from "../types";
import {
  webglEffectShader,
  webglLoadEffectShader,
  webglSetFloat,
  webglSetVec2,
} from "../utils/webgl";
import shaderSlide from "../shaders/transitionSlide.glsl";

const shader = webglEffectShader(shaderSlide.sourceCode);

const webglTransitionSlideVerticalIn: WebGLEffect = (keyframe) => {
  const program = webglLoadEffectShader(shader);
  webglSetFloat(program, "keyframe", keyframe - 1);
  webglSetVec2(program, "direction", [0, -1]);
  return program;
};

export default webglTransitionSlideVerticalIn;
