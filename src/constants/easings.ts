import easingLinear from "../easings/linear";
import easingExponent from "../easings/exponent";
import easingBounce from "../easings/bounce";
import easingBlink from "../easings/blink";

export default [
  { label: "スッと", value: easingLinear },
  { label: "ヌルっと", value: easingExponent },
  { label: "ボテっと", value: easingBounce },
  { label: "チラッと", value: easingBlink },
];
