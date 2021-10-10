import APNGEncoder from "./encoder";
import { Effect, WebGLEffect } from "../types";
import { webglApplyEffects, webglInitialize } from "./webgl";
import { cropCanvas, cutoutCanvasIntoCells } from "./canvas";

const webglEnabled = webglInitialize();

function renderFrameUncut(
  keyframe: number,
  image: HTMLImageElement,
  offsetH: number,
  offsetV: number,
  width: number,
  height: number,
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

  const left = offsetH - width / 2;
  const top = offsetV - height / 2;
  const targetLeft = left >= 0 ? 0 : -left * targetWidth / width;
  const targetTop = top >= 0 ? 0 : -top * targetHeight / height;
  ctx.drawImage(
    image,
    Math.max(0, left), Math.max(0, top), width * 2, height * 2,
    targetLeft, targetTop, targetWidth * 2, targetHeight * 2,
  );

  if (webglEffects.length && webglEnabled) {
    canvas = webglApplyEffects(canvas, keyframe, webglEffects);
  }

  if (noCrop) {
    // copy webglCanvas content
    return cropCanvas(canvas, 0, 0, targetWidth * 2, targetHeight * 2);
  } else {
    return cropCanvas(canvas, targetWidth / 2, targetHeight / 2, targetWidth, targetHeight);
  }
}

let encoders: APNGEncoder[][] | null = null;

/**
 * ASYNC:
 * returns a 2d-array of (possibly animated) images of specified size (tragetSize).
 * each images may exceed binarySizeLimit.
 */
function renderAllCellsFixedSize(
  image: HTMLImageElement,
  offsetH: number,
  offsetV: number,
  hCells: number,
  vCells: number,
  srcWidth: number,
  srcHeight: number,
  targetSize: number,
  noCrop: boolean,
  animated: boolean,
  animationInvert: boolean,
  effects: Effect[],
  webglEffects: WebGLEffect[],
  framerate: number,
  framecount: number,
  cnum = Infinity,
  loop = true,
) {
  if (!animated) {
    const img = renderFrameUncut(
      0, image,
      offsetH, offsetV, srcWidth, srcHeight,
      targetSize * hCells, targetSize * vCells, noCrop,
      animationInvert, effects, webglEffects,
      framerate, framecount,
    );
    const cells = noCrop ? (
      cutoutCanvasIntoCells(img, 0, 0, hCells, vCells, targetSize * 2, targetSize * 2)
    ) : (
      cutoutCanvasIntoCells(img, 0, 0, hCells, vCells, targetSize, targetSize)
    );
    return Promise.all<Blob[]>(cells.map((row) => (
      Promise.all<Blob>(row.map((cell) => (
        new Promise((resolve) => cell.toBlob((blob) => resolve(blob!)))
      )))
    )));
  } else {
    if (encoders) {
      encoders.forEach((row) => { row.forEach((encoder) => encoder.abort()); });
    }
    encoders = [];
    /* instantiate APNG encoders for each cells */
    for (let y = 0; y < vCells; y += 1) {
      const row = [];
      for (let x = 0; x < hCells; x += 1) {
        const encoder = new APNGEncoder({
          w: targetSize * (noCrop ? 2 : 1),
          h: targetSize * (noCrop ? 2 : 1),
          cnum: cnum,
          loops: loop ? Infinity : 1,
        });
        row.push(encoder);
      }
      encoders.push(row);
    }
    const delayPerFrame = 1000 / framerate;
    const denominator = framecount - (loop ? 0 : 1);
    for (let i = 0; i < framecount; i += 1) {
      const keyframe = animationInvert ? 1 - (i / denominator) : i / denominator;
      const frame = renderFrameUncut(
        keyframe, image,
        offsetH, offsetV, srcWidth, srcHeight,
        targetSize * hCells, targetSize * vCells, noCrop,
        animationInvert, effects, webglEffects,
        framerate, framecount,
      );
      const imgCells = noCrop ? (
        cutoutCanvasIntoCells(frame, 0, 0, hCells, vCells, targetSize * 2, targetSize * 2)
      ) : (
        cutoutCanvasIntoCells(frame, 0, 0, hCells, vCells, targetSize, targetSize)
      );
      for (let y = 0; y < vCells; y += 1) {
        for (let x = 0; x < hCells; x += 1) {
          encoders[y][x].addFrame(imgCells[y][x].getContext("2d")!, delayPerFrame);
        }
      }
    }
    return Promise.all<Blob[]>(encoders.map((row) => Promise.all<Blob>(row.map((cell) => (
      cell.render().then((ret) => {
        resolve(ret);
        encoders = null;
      })
    )))));
  }
}

/* ASYNC: returns a 2d-array of (possibly animated) images. */
export function renderAllCells(
  image: HTMLImageElement,
  offsetH: number,
  offsetV: number,
  hCells: number,
  vCells: number,
  srcWidth: number,
  srcHeight: number,
  maxSize: number,
  noCrop: boolean,
  animated: boolean,
  animationInvert: boolean,
  effects: Effect[],
  webglEffects: WebGLEffect[],
  framerate: number,
  framecount: number,
  binarySizeLimit: number,
): Promise<Blob[][]> {
  return new Promise((resolve) => {
    renderAllCellsFixedSize(
      image, offsetH, offsetV, hCells, vCells, srcWidth, srcHeight, maxSize, noCrop,
      animated, animationInvert, effects, webglEffects,
      framerate, framecount,
    ).then((ret) => {
      /**
       * If a cell exceeds the limitation, retry with smaller cell size.
       * This does not happen in most cases.
       */
      const shouldRetry = ret.some((row) => row.some((cell: Blob) => (
        cell.size >= binarySizeLimit
      )));
      if (shouldRetry) {
        renderAllCells(
          image, offsetH, offsetV, hCells, vCells, srcWidth, srcHeight, maxSize * 0.9, noCrop,
          animated, animationInvert, effects, webglEffects,
          framerate, framecount,
          binarySizeLimit,
        ).then(resolve);
      } else {
        resolve(ret);
      }
    });
  });
}
