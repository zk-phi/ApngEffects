import MasterTexture from "./MasterTexture.vue";

export default {
  title: "cards/MasterTexture",
  component: MasterTexture,
};

export const Base = (args) => ({
  components: { MasterTexture },
  data: () => args,
  template: `
    <MasterTexture :show="true" :width="width" :height="height" />
  `,
});
Base.args = { width: 300, height: 300 };
