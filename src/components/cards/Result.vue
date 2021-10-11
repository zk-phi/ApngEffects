<script lang="ts">
import { defineComponent, PropType } from "vue";
import Card from "../global/Card.vue";
import Space from "../global/Space.vue";

const transparentBg = {
  backgroundPosition: "0 0, 10px 10px",
  backgroundSize: "20px 20px",
  backgroundImage: `
    linear-gradient(45deg, #efefef 25%, transparent 25%, transparent 75%, #efefef 75%, #efefef),
    linear-gradient(45deg, #efefef 25%, transparent 25%, transparent 75%, #efefef 75%, #efefef)
  `,
};

export default defineComponent({
  components: {
    Card, Space,
  },
  props: {
    image: { type: Object as PropType<Blob>, default: null },
  },
  data: () => ({
    transparentBg,
  }),
  computed: {
    src(): string | null {
      return this.image ? URL.createObjectURL(this.image) : null;
    },
  },
});
</script>

<template>
  <Card :style="transparentBg" title="プレビュー">
    <Space vertical>
      <img v-if="image" class="result" :src="src">
      <p v-if="image">
        {{ Math.ceil(image.size / 1000) }} KB
        ({{ Math.ceil(image.size / 1024) }} KiB)
      </p>
    </Space>
  </Card>
</template>

<style scoped>
.result {
  border: 1px solid var(--border);
}
</style>
