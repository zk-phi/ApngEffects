<script lang="ts">
import { defineComponent } from "vue";
import RawResult from "../emoji/RawResult.vue";
import Card from "../global/Card.vue";

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
    RawResult, Card,
  },
  props: {
    images: { type: Array, required: true },
  },
  data: () => ({
    transparentBg,
  }),
});
</script>

<template>
  <Card :style="transparentBg" title="絵文字">
    <RawResult :images="images" />
  </Card>
</template>
