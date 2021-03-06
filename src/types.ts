// Effects are called with CanvasRenderingContext2D before rendering, and
// expected to configure the canvas. Note that users may enable multiple
// effects at the same time.
export type Effect = (
  // a 0.0 - 1.0 progress of the animation
  keyrame: number,
  // the rendering context to be modified
  ctx: CanvasRenderingContext2D,
  // size of the image to be rendered
  width: number, height: number,
) => void;

// WebGLEffect loads and configures a WebGLProgram, which is then used to effect
// rendered images.
export type WebGLEffect = (
  keyframe: number,
  width: number,
  height: number,
) => WebGLProgram;

export type Easing = (x: number) => number;
