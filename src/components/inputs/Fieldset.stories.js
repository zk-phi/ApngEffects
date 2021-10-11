import Fieldset from "./Fieldset.vue";
import Textarea from "./Textarea.vue";

export default {
  title: "molecules/inputs/Fieldset",
  component: Fieldset,
};

export const Base = (args) => ({
  components: { Fieldset, Textarea },
  data: () => ({
    ...args,
    value: "",
  }),
  template: `
    <Fieldset :label="label">
      <Textarea v-model="value" :rows="3" />
    </Fieldset>
  `,
});
Base.args = { label: "ほげほげ" };
