import { WebGLEffect } from "../types";
import {
  webglEffectShader,
  webglLoadEffectShader,
  webglSetFloat,
  webglSetVec2,
} from "../utils/webgl";
import shaderSlide from "../shaders/transitionSlide.glsl";

const shader = webglEffectShader(shaderSlide.sourceCode);

const webglTransitionSlideOut: WebGLEffect = (keyframe) => {
  const program = webglLoadEffectShader(shader);
  webglSetFloat(program, "keyframe", keyframe);
  webglSetVec2(program, "direction", [1, 0]);
  return program;
};

export default webglTransitionSlideOut;
