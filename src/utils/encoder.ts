type EncoderArgs = {
  w: number;
  h: number;
  cnum?: number;
  loops?: number;
};

export default class APNGEncoder {
  private worker: Worker;
  private frames: ArrayBuffer[];
  private options: EncoderArgs;
  private dels: number[];

  constructor({ w, h, cnum = Infinity, loops = Infinity }: EncoderArgs) {
    this.worker = new Worker(new URL('./encoder.worker.ts', import.meta.url));
    this.frames = [];
    this.dels = [];
    this.options = { w, h, cnum, loops };
  }

  addFrame(ctx: CanvasRenderingContext2D, delay = 16): void {
    this.frames.push(ctx.getImageData(0, 0, this.options.w, this.options.h).data.buffer);
    this.dels.push(delay);
  }

  render(): Promise<Blob> {
    return new Promise((resolve) => {
      this.worker.postMessage([
        this.frames,
        this.options.w,
        this.options.h,
        this.options.cnum === Infinity ? 0 : this.options.cnum,
        this.dels,
        this.options.loops === Infinity ? {} : { loop: this.options.loops },
      ]);
      this.worker.onmessage = ({ data: png }) => resolve(new Blob([png], { type: "image/apng" }));
    });
  }

  abort(): void {
    this.worker.terminate();
  }
};
