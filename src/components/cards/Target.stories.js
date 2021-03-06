import Target from "./Target.vue";
import image from "../../samples/image.png";

export default {
  title: "cards/Target",
  component: Target,
};

const img = document.createElement("img");
img.src = image;

export const Base = (args) => ({
  components: { Target },
  data: () => args,
  template: `
    <Target
      :show="show"
      :base-image="baseImage"
      :sub-image="subImage"
      :width="300"
      :height="300" />
  `,
});
Base.args = { show: true, baseImage: img, subImage: img };
