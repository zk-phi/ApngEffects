import effectBlink from "../effects/blink";
import effectPatapata from "../effects/patapata";
import effectRoulette from "../effects/roulette";
import effectGatagata from "../effects/gatagata";
import effectPoyon from "../effects/poyon";
import effectMotimoti from "../effects/motimoti";
import effectYurayura from "../effects/yurayura";
import effectStraight from "../effects/straight";

export default [
  {
    label: "変形",
    effects: [
      { label: "ガタガタ", value: effectGatagata },
      { label: "回転", value: effectRoulette },
      { label: "ゆらゆら", value: effectYurayura },
      { label: "ぱたぱた", value: effectPatapata },
      { label: "ぽよーん", value: effectPoyon },
      { label: "もちもち", value: effectMotimoti },
      { label: "点滅", value: effectBlink },
      { label: "直球", value: effectStraight },
    ],
  },
];
