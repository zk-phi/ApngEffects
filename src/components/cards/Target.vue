<script lang="ts">
import { defineComponent, PropType } from "vue";
import EffectBlock from "../formblocks/EffectBlock.vue";
import CellcountBlock from "../formblocks/CellcountBlock.vue";
import Button from "../inputs/Button.vue";
import Select from "../inputs/Select.vue";
import Checkbox from "../inputs/Checkbox.vue";
import Fieldset from "../inputs/Fieldset.vue";
import Space from "../global/Space.vue";
import Card from "../global/Card.vue";
import Grid from "../global/Grid.vue";
import GridItem from "../global/GridItem.vue";
import DevTool from "./DevTool.vue";

import { Effect, WebGLEffect } from "../../types";
import effects from "../../constants/effects";
import webgleffects from "../../constants/webgleffects";

import { renderAllCells } from "../../utils/emoji";
import {
  EMOJI_SIZE,
  ANIMATED_EMOJI_SIZE,
  BINARY_SIZE_LIMIT,
  FRAMERATE_MAX,
  FRAMECOUNT_MAX,
} from "../../constants/emoji";

type EffectOption = { label: string, value: Effect };
type WebGLEffectOption = { label: string, value: WebGLEffect };
type SpeedOption = { label: string, value: number };

const SPEED_OPTIONS = [
  { label: "コマ送り", value: 2.0 },
  { label: "遅い", value: 1.3 },
  { label: "ふつう", value: 0.8 },
  { label: "速い", value: 0.3 },
  { label: "爆速", value: 0.1 },
];

export default defineComponent({
  components: {
    EffectBlock,
    Checkbox,
    CellcountBlock,
    Card,
    Button,
    Grid,
    GridItem,
    Fieldset,
    Space,
    Select,
    DevTool,
  },
  props: {
    baseImage: { type: Object as PropType<HTMLImageElement>, default: null },
    show: { type: Boolean, required: true },
  },
  emits: [
    "render",
  ],
  data() {
    return {
      effects,
      webgleffects,
      SPEED_OPTIONS,
      conf: {
        /* basic */
        speed: SPEED_OPTIONS[2],
        cells: [1, 1],
        animationInvert: false,
        effects: [] as EffectOption[],
        webglEffects: [] as WebGLEffectOption[],
        /* advanced */
        noCrop: false,
        duration: SPEED_OPTIONS[2].value,
      },
      showDetails: false,
      devMode: false,
    };
  },
  watch: {
    baseImage: {
      handler(): void {
        if (this.baseImage) {
          this.render();
        }
      },
    },
    conf: {
      handler(): void {
        this.render();
      },
      deep: true,
    },
    devMode: {
      handler(): void {
        this.conf.effects = [];
        this.conf.webglEffects = [];
      },
    },
  },
  methods: {
    selectSpeed(speed: SpeedOption): void {
      this.conf.duration = speed.value;
    },
    render(): void {
      if (this.baseImage) {
        const animated = !!(
          this.conf.effects.length
          || this.conf.webglEffects.length
        );

        const framerate = Math.min(FRAMERATE_MAX, Math.ceil(FRAMECOUNT_MAX / this.conf.duration));
        const framecount = Math.floor(this.conf.duration * framerate);

        const maxSize = animated ? ANIMATED_EMOJI_SIZE : EMOJI_SIZE;
        renderAllCells(
          this.baseImage,
          this.conf.cells[0], this.conf.cells[1],
          maxSize, this.conf.noCrop,
          animated,
          this.conf.animationInvert,
          this.conf.effects.map((eff) => eff.value),
          this.conf.webglEffects.map((eff) => eff.value),
          framerate, framecount,
          BINARY_SIZE_LIMIT,
        ).then((res) => {
          this.$emit("render", res);
        });
      }
    },
  },
});
</script>

<template>
  <Card v-if="show && !devMode">
    <Grid :columns="[[450, 1], [Infinity, 2]]">
      <GridItem>
        <Space vertical xlarge full>
          <Fieldset label="アニメーション">
            <Space vertical full>
              <Checkbox v-model="conf.animationInvert">
                {{ "逆再生" }}
              </Checkbox>
            </Space>
          </Fieldset>
          <EffectBlock v-model="conf.webglEffects" :effects="webgleffects" />
          <EffectBlock v-model="conf.effects" :effects="effects" />
          <Fieldset v-if="showDetails" label="開発者向け">
            <Button danger type="text" @click="devMode = true">
              開発者モード
            </Button>
          </Fieldset>
        </Space>
      </GridItem>
      <GridItem>
        <Space vertical xlarge full>
          <CellcountBlock
              v-if="showDetails"
              v-model="conf.cells" />
          <Fieldset v-if="!showDetails" label="アニメ速度">
            <Select
                v-model="conf.speed"
                :options="SPEED_OPTIONS"
                @update:model-value="selectSpeed($event)" />
          </Fieldset>
          <Fieldset v-if="showDetails" label="アニメ長さ">
            <Slider
                v-model="conf.duration"
                block
                :min="0.1"
                :step="0.1"
                :max="2.0" />
          </Fieldset>
        </Space>
      </GridItem>
    </Grid>
    <template #footer>
      <div style="text-align: center;">
        <Button type="text" @click="showDetails = !showDetails">
          {{ showDetails ? '- 詳細を閉じる' : '+ 詳細オプション' }}
        </Button>
      </div>
    </template>
  </Card>
  <DevTool
      v-model:no-crop="conf.noCrop"
      :show="show && devMode"
      @close="devMode = false"
      @build-effect="conf.effects = [$event]"
      @build-shader="conf.webglEffects = [$event]" />
</template>
