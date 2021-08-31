<script lang="ts">
import { defineComponent } from "vue";
import FileSelect from "../inputs/FileSelect.vue";
import Fieldset from "../inputs/Fieldset.vue";
import Color from "../inputs/Color.vue";
import Checkbox from "../inputs/Checkbox.vue";
import Select from "../inputs/Select.vue";
import Space from "../global/Space.vue";
import Card from "../global/Card.vue";
import Image from "../icons/Image.vue";
import { makeTexture } from "../../utils/canvas";

const TRIMMING_OPTIONS = [
  { label: "ぴっちり", value: "" },
  { label: "はみだす (アス比維持)", value: "cover" },
  { label: "おさめる (アス比維持)", value: "contain" },
];

export default defineComponent({
  components: {
    FileSelect, Image, Fieldset, Space, Color, Checkbox, Card, Select,
  },
  props: {
    show: { type: Boolean, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    defaultColor: { type: String, default: null },
  },
  emits: [
    "render",
  ],
  data(params) {
    return {
      TRIMMING_OPTIONS,
      conf: {
        trimming: TRIMMING_OPTIONS[1],
        color: params.defaultColor || "#ffffff",
        transparent: !params.defaultColor,
        source: null as (HTMLImageElement | null),
        /* advanced */
        trimH: [0, 0],
        trimV: [0, 0],
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
        this.refreshDefaultSettings();
        this.render();
      },
    },
    height: {
      handler(): void {
        this.refreshDefaultSettings();
        this.render();
      },
    },
  },
  methods: {
    refreshDefaultSettings(): void {
      if (this.conf.source) {
        const img = this.conf.source;

        let widthRatio = this.width / img.naturalWidth;
        let heightRatio = this.height / img.naturalHeight;

        if (this.conf.trimming.value === "cover") {
          widthRatio = Math.max(widthRatio, heightRatio);
          heightRatio = widthRatio;
        } else if (this.conf.trimming.value === "contain") {
          widthRatio = Math.min(widthRatio, heightRatio);
          heightRatio = widthRatio;
        }
        const offsetH = Math.floor((img.naturalWidth - this.width / widthRatio) / 2);
        const offsetV = Math.floor((img.naturalHeight - this.height / heightRatio) / 2);
        this.conf.trimH = [offsetH, img.naturalWidth - offsetH];
        this.conf.trimV = offsetV < 0 ? (
          [offsetV, img.naturalHeight - offsetV]
        ) : (
          [0, img.naturalHeight - offsetV * 2]
        );
      }
    },
    render(): void {
      const texture = makeTexture(
        this.conf.transparent ? null : this.conf.color,
        this.width,
        this.height,
        this.conf.source,
        this.conf.trimH[0],
        this.conf.trimV[0],
        this.conf.trimH[1] - this.conf.trimH[0],
        this.conf.trimV[1] - this.conf.trimV[0],
      );
      this.$emit("render", texture);
    },
    loadSource(img: HTMLImageElement): void {
      this.conf.source = img;
      this.refreshDefaultSettings();
    },
  },
  mounted(): void {
    this.render();
  },
});
</script>

<template>
  <Card v-if="show" title="待機画面など (シーン転換用)">
    <Space vertical xlarge full>
      <Fieldset label="背景">
        <Space vertical>
          <Color block v-model="conf.color" @update:model-value="conf.transparent = false" />
          <Checkbox v-model="conf.transparent">
            透過
          </Checkbox>
        </Space>
      </Fieldset>
      <Fieldset label="画像">
        <FileSelect removable @load="loadSource">
          <Image /> ファイルを選ぶ
        </FileSelect>
      </Fieldset>
      <Fieldset label="リサイズ戦略">
        <Select
            v-model="conf.trimming"
            :options="TRIMMING_OPTIONS"
            @update:model-value="refreshDefaultSettings" />
      </Fieldset>
    </Space>
  </Card>
</template>
