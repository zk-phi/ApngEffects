<script lang="ts">
import { defineComponent, PropType } from "vue";
import Card from "../global/Card.vue";
import Space from "../global/Space.vue";

export default defineComponent({
  components: {
    Card, Space,
  },
  props: {
    image: { type: Object as PropType<Blob>, default: null },
  },
  computed: {
    src(): string | null {
      return this.image ? URL.createObjectURL(this.image) : null;
    },
  },
});
</script>

<template>
  <Card class="result" title="プレビュー">
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
  background-image:
    linear-gradient(
      45deg,
      var(--bg) 25%,
      transparent 25%,
      transparent 75%,
      var(--bg) 75%,
      var(--bg)
    ),
    linear-gradient(
      45deg,
      var(--bg) 25%,
      transparent 25%,
      transparent 75%,
      var(--bg) 75%,
      var(--bg)
    );
  background-position: 0 0, 10px 10px;
  background-size: 20px 20px;
  border: 1px solid var(--border);
}
</style>
