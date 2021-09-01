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

import { Effect, WebGLEffect, Easing } from "../../types";
import effects from "../../constants/effects";
import webgleffects from "../../constants/webgleffects";
import easings from "../../constants/easings";

import { renderApng } from "../../utils/emoji";

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
    baseImage: { type: Object as PropType<HTMLCanvasElement>, default: null },
    subImage: { type: Object as PropType<HTMLCanvasElement>, default: null },
    show: { type: Boolean, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
  },
  emits: [
    "render",
  ],
  data() {
    return {
      effects,
      webgleffects,
      easings,
      DURATION_OPTIONS,
      FPS_OPTIONS,
      CNUM_OPTIONS,
      conf: {
        /* basic */
        duration: DURATION_OPTIONS[2],
        fps: FPS_OPTIONS[2],
        animationInvert: false,
        animationLoop: true,
        effects: [] as EffectOption[],
        webglEffects: [] as WebGLEffectOption[],
        easing: easings[0],
        cnum: CNUM_OPTIONS[2],
        /* dev options */
        noCrop: false,
      },
      devMode: false,
    };
  },
  watch: {
    baseImage: {
      handler(): void {
        this.render();
      },
    },
    subImage: {
      handler(): void {
        this.render();
      },
    },
    conf: {
      handler(): void {
        // if (window.ga) {
        //   const animationName = this.conf.animation ? this.conf.animation.label : "";
        //   const effectNames = [
        //     this.conf.staticEffects.map((e) => e.label).join(","),
        //     this.conf.effects.map((e) => e.label).join(","),
        //     this.conf.webglEffects.map((e) => e.label).join(","),
        //   ].join("/");
        //   window.ga("set", "dimension2", `${animationName}/${effectNames}`);
        // }
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
  mounted() {
    // if (window.ga) {
    //   window.ga("set", "dimension2", "///");
    // }
  },
  methods: {
    render(): void {
      if (this.baseImage && this.subImage) {
        const animated = !!(
          this.conf.effects.length
          || this.conf.webglEffects.length
        );

        const framecount = Math.floor(this.conf.duration.value * this.conf.fps.value);
        renderApng(
          this.baseImage,
          this.subImage,
          this.width, this.height,
          this.conf.noCrop,
          animated, this.conf.easing.value,
          this.conf.animationInvert,
          this.conf.effects.map((eff) => eff.value),
          this.conf.webglEffects.map((eff) => eff.value),
          this.conf.fps.value, framecount, this.conf.cnum.value, this.conf.animationLoop,
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
    <Grid :columns="[[Infinity, 3]]">
      <GridItem>
        <Space vertical xlarge full>
          <Fieldset label="再生設定">
            <Space vertical full>
              <Space>
                <Checkbox v-model="conf.animationLoop">
                  {{ "ループ再生" }}
                </Checkbox>
                <Checkbox v-model="conf.animationInvert">
                  {{ "逆再生" }}
                </Checkbox>
              </Space>
            </Space>
          </Fieldset>
          <Fieldset label="タイミング">
            <Select v-model="conf.easing" :options="easings" />
          </Fieldset>
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
      <GridItem :span="2">
        <Space vertical xlarge full>
          <EffectBlock v-model="conf.webglEffects" :effects="webgleffects" />
          <EffectBlock v-model="conf.effects" :effects="effects" />
          <Fieldset label="開発者向け">
            <Button danger type="text" @click="devMode = true">
              エフェクトエディタ
            </Button>
          </Fieldset>
        </Space>
      </GridItem>
    </Grid>
  </Card>
  <DevTool
      v-model:no-crop="conf.noCrop"
      :show="show && devMode"
      @close="devMode = false"
      @build-effect="conf.effects = [$event]"
      @build-shader="conf.webglEffects = [$event]" />
</template>
