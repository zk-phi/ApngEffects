import SubTexture from "./SubTexture.vue";

export default {
  title: "cards/SubTexture",
  component: SubTexture,
};

export const Base = (args) => ({
  components: { SubTexture },
  data: () => args,
  template: `
    <SubTexture :show="true" :width="width" :height="height" />
  `,
});
Base.args = { width: 300, height: 300 };
