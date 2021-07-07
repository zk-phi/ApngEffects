import { HSV2RGB } from './utils/color';
import { scaleCentered } from './utils/canvas';

/*
 * An effect takes a 2d rendering context and makes modifications to it.
 * These functions are called just before rendering an animation frame.
 * Note that users can enable multiple effects at the same time.
 *
 * [arguments]
 * - keyframe   ... a 0.0 - 1.0 progress of the animation
 * - ctx        ... the rendering context to be modified
 * - cellWidth  ... width of the image to be rendered
 * - cellHeight ... height of the image to be rendered
 */

type Effect = (
  keyrame: number, ctx: CanvasRenderingContext2D, width: number, height: number,
) => void;

/* ---- effects */

const effectFlipHoriz: Effect = (keyframe, ctx, cellWidth) => {
  ctx.translate(cellWidth, 0);
  ctx.scale(-1, 1);
};

const effectFlipVert: Effect = (keyframe, ctx, cellWidth, cellHeight) => {
  ctx.translate(0, cellHeight);
  ctx.scale(1, -1);
};

const effectBlink: Effect = (keyframe, ctx, cellWidth) => {
  if (keyframe >= 0.5) {
    ctx.translate(-cellWidth * 2, 0); /* hide */
  }
};

const effectNaturalBlur: Effect = (keyframe, ctx) => {
  const HSVColor = HSV2RGB({ h: 0, s: 0, v: keyframe });
  ctx.shadowColor = `rgb(${HSVColor.r}, ${HSVColor.g}, ${HSVColor.b})`;
  ctx.shadowBlur = 50 * keyframe;
};

const effectNeon: Effect = (keyframe, ctx) => {
  const HSVColor = HSV2RGB({ h: Math.floor(keyframe * 360 * 4) % 360, s: 1, v: 1 });
  ctx.shadowColor = `rgb(${HSVColor.r}, ${HSVColor.g}, ${HSVColor.b})`;
  ctx.shadowBlur = 10;
};

const effectShadowRotate: Effect = (keyframe, ctx) => {
  ctx.shadowColor = "black";
  ctx.shadowOffsetY = Math.cos(2 * Math.PI * keyframe) * 5;
  ctx.shadowOffsetX = Math.sin(2 * Math.PI * keyframe) * 5;
};

const effectPatapata: Effect = (keyframe, ctx, cellWidth) => {
  ctx.transform(
    Math.cos(2 * Math.PI * keyframe),
    0, 0,
    1,
    cellWidth * (0.5 - 0.5 * Math.cos(2 * Math.PI * keyframe)), 0,
  );
};

const effectRotate: Effect = (keyframe, ctx, cellWidth, cellHeight) => {
  ctx.translate(cellWidth / 2, cellHeight / 2);
  ctx.rotate(Math.PI * 2 * keyframe);
  ctx.translate(-cellWidth / 2, -cellHeight / 2);
};

const effectKurukuru: Effect = (keyframe, ctx, cellWidth, cellHeight) => {
  ctx.translate(
    Math.cos(Math.PI * 2 * keyframe) * 0.05 * cellWidth,
    Math.sin(Math.PI * 2 * keyframe) * 0.05 * cellHeight,
  );
};

let lastGata = false;
const effectGatagata: Effect = (keyframe, ctx, cellWidth, cellHeight) => {
  lastGata = !lastGata;
  ctx.translate(
    cellWidth / 2 + (Math.random() - 0.5) * 4,
    cellHeight / 2 + (Math.random() - 0.5) * 4,
  );
  ctx.rotate(lastGata ? -0.05 : 0.05);
  ctx.translate(-cellWidth / 2, -cellHeight / 2);
};

const effectYatta: Effect = (keyframe, ctx, cellWidth, cellHeight) => {
  if (keyframe >= 0.5) {
    /* flip */
    ctx.translate(cellWidth, 0);
    ctx.scale(-1, 1);
  }
  ctx.translate(cellWidth / 2, cellHeight / 2);
  ctx.rotate(0.1);
  ctx.translate(-cellWidth / 2, -cellHeight / 2);
  ctx.translate(0, cellHeight / 16 * Math.sin(8 * Math.PI * keyframe));
};

const effectPoyon: Effect = (keyframe, ctx, cellWidth, cellHeight) => {
  if (keyframe < 0.6) {
    ctx.translate(0, -cellHeight / 6 * Math.sin(Math.PI * keyframe / 0.6));
  } else {
    const ratio = Math.sin(Math.PI * (keyframe - 0.6) / 0.4) / 2;
    ctx.transform(
      1 + ratio,
      0, 0,
      1 - ratio,
      -ratio * cellWidth / 2, ratio * cellHeight * 3 / 4,
    );
  }
};

const effectMotimoti: Effect = (keyframe, ctx, cellWidth, cellHeight) => {
  const ratio = Math.sin(Math.PI * Math.abs(keyframe - 0.5) / 0.5) / 4;
  ctx.transform(1 + ratio, 0, 0, 1 - ratio, -ratio * cellWidth / 2, ratio * cellHeight * 3 / 4);
};

const effectYurayura: Effect = (keyframe, ctx, cellWidth, cellHeight) => {
  ctx.translate(cellWidth / 2, cellHeight * 3 / 4);
  ctx.rotate(Math.PI * Math.abs(keyframe - 0.5) / 2 - Math.PI / 8);
  ctx.translate(-cellWidth / 2, -cellHeight * 3 / 4);
};

const effectZoom: Effect = (keyframe, ctx, cellWidth, cellHeight) => {
  const zoom = Math.abs(keyframe - 0.5) * 2 - 0.5;
  ctx.transform(1 + zoom, 0, 0, 1 + zoom, -cellWidth / 2 * zoom, -cellHeight / 2 * zoom);
};

const effectStraight: Effect = (keyframe, ctx, cellWidth, cellHeight) => {
  if (keyframe < 0.5) {
    scaleCentered(ctx, cellWidth, cellHeight, keyframe * 2, keyframe * 2);
  }
};

const effectTiritiri: Effect = (keyframe, ctx, cellWidth, cellHeight) => {
  const imageData = ctx.getImageData(0, 0, cellWidth, cellHeight);
  const { data } = imageData;
  for (let row = 0; row < cellHeight; row += 1) {
    for (let col = 0; col < cellWidth; col += 1) {
      data[(row * cellWidth + col) * 4 + 3] = Math.floor(255 * Math.random());
    }
  }
  ctx.putImageData(imageData, 0, 0);
};

const effectPsych: Effect = (keyframe, ctx, cellWidth, cellHeight) => {
  const imageData = ctx.getImageData(0, 0, cellWidth, cellHeight);
  const { data } = imageData;
  for (let row = 0; row < cellHeight; row += 1) {
    for (let col = 0; col < cellWidth; col += 1) {
      if (row % 10 <= 5 && col % 10 >= 5) {
        const color = HSV2RGB({ h: Math.floor(keyframe * 360 * 4 + 180) % 360, s: 1, v: 1 });
        data[(row * cellWidth + col) * 4] = color.r;
        data[(row * cellWidth + col) * 4 + 1] = color.g;
        data[(row * cellWidth + col) * 4 + 2] = color.b;
        data[(row * cellWidth + col) * 4 + 3] = 255;
      } else if (row % 10 < 5 !== col % 10 < 5) {
        const color = HSV2RGB({ h: Math.floor(keyframe * 360 * 4 + 90) % 360, s: 1, v: 1 });
        data[(row * cellWidth + col) * 4] = color.r;
        data[(row * cellWidth + col) * 4 + 1] = color.g;
        data[(row * cellWidth + col) * 4 + 2] = color.b;
        data[(row * cellWidth + col) * 4 + 3] = 255;
      } else {
        const color = HSV2RGB({ h: Math.floor(keyframe * 360 * 4) % 360, s: 1, v: 1 });
        data[(row * cellWidth + col) * 4] = color.r;
        data[(row * cellWidth + col) * 4 + 1] = color.g;
        data[(row * cellWidth + col) * 4 + 2] = color.b;
        data[(row * cellWidth + col) * 4 + 3] = 255;
      }
    }
  }
  ctx.putImageData(imageData, 0, 0);
};

const effectDizzy: Effect = (keyframe, ctx, cellWidth, cellHeight) => {
  const imageData = ctx.getImageData(0, 0, cellWidth, cellHeight);
  const { data } = imageData;
  for (let row = 0; row < (cellHeight * cellWidth * 4); row += 4) {
    if (Math.floor(row / 4 + (keyframe * 40)) % 40 < 40
        && Math.floor(row / 4 + (keyframe * 40)) % 40 > 20) {
      const color = HSV2RGB({ h: Math.floor(keyframe * 360 * 4) % 360 + 180, s: 1, v: 1 });
      data[row] = color.r;
      data[row + 1] = color.g;
      data[row + 2] = color.b;
      data[row + 3] = 255;
    }
  }
  ctx.putImageData(imageData, 0, 0);
};

export const EFFECTS = [
  {
    label: "変形",
    effects: [
      { label: "ガタガタ", fn: effectGatagata },
      { label: "びょいんびょいん", fn: effectZoom },
      { label: "ルーレット", fn: effectRotate },
      { label: "ねるねる", fn: effectKurukuru },
      { label: "ゆらゆら", fn: effectYurayura },
      { label: "ぱたぱた", fn: effectPatapata },
      { label: "ヤッタ", fn: effectYatta },
      { label: "ぽよーん", fn: effectPoyon },
      { label: "もちもち", fn: effectMotimoti },
      { label: "BLINK", fn: effectBlink },
      { label: "直球", fn: effectStraight },
    ],
  }, {
    label: "シャドウ",
    effects: [
      { label: "ぐるぐる", fn: effectShadowRotate },
      { label: "ブラー", fn: effectNaturalBlur },
      { label: "ネオン", fn: effectNeon },
    ],
  },
];

export const STATIC_EFFECTS = [
  { label: "左右を反転", fn: effectFlipHoriz },
  { label: "上下を反転", fn: effectFlipVert },
];

export const PRO_EFFECTS = [
  {
    label: "背景エフェクト",
    effects: [
      { label: "チリチリ", fn: effectTiritiri },
      { label: "ディスコ", fn: effectPsych },
      { label: "サイケ", fn: effectDizzy },
    ],
  },
];
