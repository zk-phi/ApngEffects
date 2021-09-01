import APNGEncoder from "./encoder";
import { Effect, WebGLEffect, Easing } from "../types";
import { webglApplyEffects, webglInitialize } from "./webgl";
import { cropCanvas } from "./canvas";

const webglEnabled = webglInitialize();

function renderFrameUncut(
  keyframe: number,
  image: HTMLCanvasElement,
  subImage: HTMLCanvasElement,
  targetWidth: number,
  targetHeight: number,
  noCrop: boolean,
  animationInvert: boolean,
  effects: Effect[],
  webglEffects: WebGLEffect[],
  framerate: number,
  framecount: number,
) {
  let canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  /* use larger canvas, because some effects may translate the canvas */
  canvas.width = targetWidth * 2;
  canvas.height = targetHeight * 2;

  effects.forEach((effect) => {
    effect(keyframe, ctx, targetWidth * 2, targetHeight * 2);
  });

  ctx.drawImage(
    image,
    0, 0, image.width, image.height,
    targetWidth / 2, targetHeight / 2, targetWidth, targetHeight,
  );

  if (webglEffects.length && webglEnabled) {
    let subCanvas = document.createElement("canvas");
    subCanvas.width = targetWidth * 2;
    subCanvas.height = targetHeight * 2;
    subCanvas.getContext("2d")!.drawImage(
      subImage,
      0, 0, image.width, image.height,
      targetWidth / 2, targetHeight / 2, targetWidth, targetHeight,
    );
    canvas = webglApplyEffects(canvas, subCanvas, keyframe, webglEffects);
  }

  if (noCrop) {
    // copy webglCanvas content
    return cropCanvas(canvas, 0, 0, targetWidth * 2, targetHeight * 2);
  } else {
    return cropCanvas(canvas, targetWidth / 2, targetHeight / 2, targetWidth, targetHeight);
  }
}

let encoder: APNGEncoder | null = null;

/**
 * ASYNC:
 * returns a 2d-array of (possibly animated) images of specified size (tragetSize).
 */
export function renderApng(
  image: HTMLCanvasElement,
  subImage: HTMLCanvasElement,
  targetWidth: number,
  targetHeight: number,
  noCrop: boolean,
  animated: boolean,
  easing: Easing,
  animationInvert: boolean,
  effects: Effect[],
  webglEffects: WebGLEffect[],
  framerate: number,
  framecount: number,
  cnum = Infinity,
  loop = true,
) {
  if (encoder) {
    encoder.abort();
  }
  if (!animated) {
    return new Promise((resolve) => image.toBlob((blob) => resolve(blob!)));
  } else {
    encoder = new APNGEncoder({
      w: targetWidth * (noCrop ? 2 : 1),
      h: targetHeight * (noCrop ? 2 : 1),
      cnum: cnum,
      loops: loop ? Infinity : 1,
    });
    const delayPerFrame = 1000 / framerate;
    const denominator = framecount - (loop ? 0 : 1);
    for (let i = 0; i < framecount; i += 1) {
      const keyframe = animationInvert ? 1 - (i / denominator) : i / denominator;
      let frame = renderFrameUncut(
        easing(keyframe), image, subImage,
        targetWidth, targetHeight, noCrop,
        animationInvert, effects, webglEffects,
        framerate, framecount,
      );
      if (!noCrop) {
        frame = cropCanvas(frame, 0, 0, targetWidth, targetHeight);
      }
      encoder.addFrame(frame.getContext("2d")!, delayPerFrame);
    }
    return new Promise((resolve) => {
      encoder!.render().then((ret) => {
        encoder = null;
        resolve(ret);
      });
    });
  }
}
