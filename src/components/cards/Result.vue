<script lang="ts">
import { defineComponent, PropType } from "vue";
import Card from "../global/Card.vue";
import Space from "../global/Space.vue";

const transparentBg = {
  backgroundPosition: "0 0, 10px 10px",
  backgroundSize: "20px 20px",
  backgroundImage: `
    linear-gradient(45deg, #444 25%, transparent 25%, transparent 75%, #444 75%, #444),
    linear-gradient(45deg, #444 25%, transparent 25%, transparent 75%, #444 75%, #444)
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
    <Space vertical large>
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
