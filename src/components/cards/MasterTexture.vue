<script lang="ts">
import { defineComponent } from "vue";
import FileSelect from "../inputs/FileSelect.vue";
import Fieldset from "../inputs/Fieldset.vue";
import Color from "../inputs/Color.vue";
import Checkbox from "../inputs/Checkbox.vue";
import NumberInput from "../inputs/Number.vue";
import Space from "../global/Space.vue";
import Card from "../global/Card.vue";
import Image from "../icons/Image.vue";
import { makeTexture } from "../../utils/canvas";

export default defineComponent({
  components: {
    FileSelect, Image, Fieldset, Space, Color, Checkbox, Card, NumberInput,
  },
  props: {
    show: { type: Boolean, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    defaultColor: { type: String, default: null },
  },
  emits: [
    "render", "update:width", "update:height",
  ],
  data(params) {
    return {
      conf: {
        color: params.defaultColor || "#ffffff",
        transparent: !params.defaultColor,
        source: null as (HTMLImageElement | null),
        maxResolution: 640,
      },
    };
  },
  watch: {
    conf: {
      handler(): void {
        this.render();
      },
      deep: true,
    },
    width: {
      handler(): void {
        this.render();
      },
    },
    height: {
      handler(): void {
        this.render();
      },
    },
  },
  mounted(): void {
    this.render();
  },
  methods: {
    resize(): void {
      if (this.conf.source) {
        const img = this.conf.source;
        const scale = Math.min(
          1,
          this.conf.maxResolution / Math.max(img.naturalWidth, img.naturalHeight),
        );
        this.$emit("update:width", Math.round(img.naturalWidth * scale));
        this.$emit("update:height", Math.round(img.naturalHeight * scale));
      } else {
        this.$emit("update:width", this.conf.maxResolution);
        this.$emit("update:height", Math.round(this.conf.maxResolution * 3 / 4));
      }
    },
    render(): void {
      const texture = makeTexture(
        this.conf.transparent ? null : this.conf.color,
        this.width,
        this.height,
        this.conf.source,
        0,
        0,
        this.conf.source ? this.conf.source.width : 0,
        this.conf.source ? this.conf.source.height : 0,
      );
      this.$emit("render", texture);
    },
    loadSource(img: HTMLImageElement): void {
      this.conf.source = img;
      this.resize();
      this.render();
    },
  },
});
</script>

<template>
  <Card v-if="show" title="シーン">
    <Space vertical xlarge full>
      <Fieldset label="背景">
        <Space vertical>
          <Color v-model="conf.color" block @update:model-value="conf.transparent = false" />
          <Checkbox v-model="conf.transparent">
            透過
          </Checkbox>
        </Space>
      </Fieldset>
      <Fieldset label="画像">
        <Space vertical>
          <FileSelect removable @load="loadSource">
            <Image /> ファイルを選ぶ
          </FileSelect>
        </Space>
      </Fieldset>
      <Fieldset label="最大サイズ (長辺px)">
        <NumberInput v-model="conf.maxResolution" :min="0" @update:model-value="resize" />
        <p class="notice">
          ※ 大きくするとフリーズしがちです (特にアニメーション使用時)
        </p>
      </Fieldset>
    </Space>
  </Card>
</template>

<style scoped>
.notice {
  margin-top: var(--marginMedium);
  font-size: var(--fontSizeMedium);
}
</style>
