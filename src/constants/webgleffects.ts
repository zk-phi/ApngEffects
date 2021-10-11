import webglKira from "../webgleffects/kira";
import webglFoil from "../webgleffects/foil";
import webglBlur from "../webgleffects/blur";
import webglBlurVertical from "../webgleffects/blurVertical";
import webglZoom from "../webgleffects/zoom";
import webglWave from "../webgleffects/wave";
import webglStrobo from "../webgleffects/strobo";
import webglFocusLine from "../webgleffects/focusLine";
import webglGlitch from "../webgleffects/glitch";
import webglMosaic from "../webgleffects/mosaic";
import webglTransitionSlideOut from "../webgleffects/transitionSlideOut";
import webglTransitionSlideIn from "../webgleffects/transitionSlideIn";
import webglTransitionSlideVerticalOut from "../webgleffects/transitionSlideVerticalOut";
import webglTransitionSlideVerticalIn from "../webgleffects/transitionSlideVerticalIn";
import webglTransitionWipeIn from "../webgleffects/transitionWipeIn";
import webglTransitionWipeOut from "../webgleffects/transitionWipeOut";
import webglTransitionWipeVerticalIn from "../webgleffects/transitionWipeVerticalIn";
import webglTransitionWipeVerticalOut from "../webgleffects/transitionWipeVerticalOut";
import webglTransitionFadeIn from "../webgleffects/transitionFadeIn";
import webglTransitionFadeOut from "../webgleffects/transitionFadeOut";

export default [
  {
    label: "特殊効果",
    effects: [
      { label: "キラ", value: webglKira },
      { label: "横もや", value: webglBlur },
      { label: "縦もや", value: webglBlurVertical },
      { label: "Foil", value: webglFoil },
      { label: "残像", value: webglZoom },
      { label: "ウェイヴ", value: webglWave },
      { label: "ストロボ", value: webglStrobo },
      { label: "集中線", value: webglFocusLine },
      { label: "グリッチ", value: webglGlitch },
      { label: "モザイク", value: webglMosaic },
    ],
  }, {
    label: "シーン転換",
    effects: [
      { label: "スライドイン", value: webglTransitionSlideIn },
      { label: "スライドアウト", value: webglTransitionSlideOut },
      { label: "縦スライドイン", value: webglTransitionSlideVerticalIn },
      { label: "縦スライドアウト", value: webglTransitionSlideVerticalOut },
      { label: "ワイプイン", value: webglTransitionWipeIn },
      { label: "ワイプアウト", value: webglTransitionWipeOut },
      { label: "縦ワイプイン", value: webglTransitionWipeVerticalIn },
      { label: "縦ワイプアウト", value: webglTransitionWipeVerticalOut },
      { label: "フェードイン", value: webglTransitionFadeIn },
      { label: "フェードアウト", value: webglTransitionFadeOut },
    ],
  },
];
