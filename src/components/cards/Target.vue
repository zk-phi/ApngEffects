<script lang="ts">
import { defineComponent, PropType } from "vue";
import EffectBlock from "../formblocks/EffectBlock.vue";
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
} from "../../constants/emoji";

type EffectOption = { label: string, value: Effect };
type WebGLEffectOption = { label: string, value: WebGLEffect };
type SpeedOption = { label: string, value: number };

const DURATION_OPTIONS = [
  { label: "超ゆっくり (4sec)", value: 4 },
  { label: "ゆっくり (2sec)", value: 2 },
  { label: "ふつう (1sec)", value: 1 },
  { label: "さくさく (0.5sec)", value: 0.5 },
  { label: "一瞬 (0.25sec)", value: 0.25 },
];

const FPS_OPTIONS = [
  { label: "超せつやく (5fps)", value: 5 },
  { label: "せつやく (10fps)", value: 10 },
  { label: "ふつう (15fps)", value: 15 },
  { label: "なめらか (30fps)", value: 30 },
  { label: "超なめらか (60fps)", value: 60 },
];

const CNUM_OPTIONS = [
  { label: "超せつやく (64色)", value: 64 },
  { label: "せつやく (128色)", value: 128 },
  { label: "ふつう (256色)", value: 256 },
  { label: "高画質 (512色)", value: 512 },
  { label: "最高画質 (減色なし)", value: Infinity },
];

export default defineComponent({
  components: {
    EffectBlock,
    Checkbox,
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
      DURATION_OPTIONS,
      FPS_OPTIONS,
      CNUM_OPTIONS,
      conf: {
        /* basic */
        duration: DURATION_OPTIONS[2],
        fps: FPS_OPTIONS[2],
        animationInvert: false,
        effects: [] as EffectOption[],
        webglEffects: [] as WebGLEffectOption[],
        /* advanced */
        cnum: CNUM_OPTIONS[2],
        noCrop: false,
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
    render(): void {
      if (this.baseImage) {
        const animated = !!(
          this.conf.effects.length
          || this.conf.webglEffects.length
        );

        const framecount = Math.floor(this.conf.duration.value * this.conf.fps.value);
        const maxSize = animated ? ANIMATED_EMOJI_SIZE : EMOJI_SIZE;
        renderAllCells(
          this.baseImage,
          maxSize, this.conf.noCrop,
          animated,
          this.conf.animationInvert,
          this.conf.effects.map((eff) => eff.value),
          this.conf.webglEffects.map((eff) => eff.value),
          this.conf.fps.value, framecount, this.conf.cnum.value,
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
          <Fieldset label="アニメ長さ">
            <Select
                v-model="conf.duration"
                :options="DURATION_OPTIONS" />
          </Fieldset>
          <Fieldset label="クオリティ (アニメ)">
            <Select
                v-model="conf.fps"
                :options="FPS_OPTIONS" />
          </Fieldset>
          <Fieldset label="クオリティ (色数)">
            <Select
                v-model="conf.cnum"
                :options="CNUM_OPTIONS" />
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
