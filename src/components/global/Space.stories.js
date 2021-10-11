import Space from "./Space.vue";

export default {
  title: "utils/Space",
  component: Space,
};

const Template = (args) => ({
  components: { Space },
  data: () => args,
  template: `
    <Space vertical :small="small" :large="large">
      <Space :small="small" :large="large">
        <span>あ</span>
        <span>あ</span>
        <span>あ</span>
      </Space>
      <Space :small="small" :large="large">
        <span>あ</span>
        <span>あ</span>
        <span>あ</span>
      </Space>
      <Space :small="small" :large="large">
        <span>あ</span>
        <span>あ</span>
        <span>あ</span>
      </Space>
    </Space>
  `,
});

export const Base = Template.bind({});
Base.args = { small: false, large: false };

export const Small = Template.bind({});
Small.args = { small: true, large: false };

export const Large = Template.bind({});
Large.args = { small: false, large: true };
