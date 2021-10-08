<script lang="ts">
import { defineComponent } from "vue";
import { Effect, WebGLEffect } from "../../types";
import {
  webglEffectShader,
  webglLoadEffectShader,
  webglSetFloat,
  webglSetVec2,
} from "../../utils/webgl";
import Textarea from "../inputs/Textarea.vue";
import Button from "../inputs/Button.vue";
import Checkbox from "../inputs/Checkbox.vue";
import Fieldset from "../inputs/Fieldset.vue";
import TabGroup from "../inputs/TabGroup.vue";
import TabButton from "../inputs/TabButton.vue";
import Card from "../global/Card.vue";
import Space from "../global/Space.vue";

const sampleEffect = "ctx.translate(0, 0);";

const sampleShader = `precision highp float;
uniform sampler2D texture;
uniform sampler2D subTexture;
varying vec2 vUv;

uniform vec2 resolution;
uniform float keyframe;

void main(void) {
  gl_FragColor = texture2D(texture, vUv);
}`;

export default defineComponent({
  components: {
    Card, Textarea, Button, Checkbox, Space, Fieldset, TabGroup, TabButton,
  },
  props: {
    show: { type: Boolean, required: true },
    noCrop: { type: Boolean, required: true },
  },
  emits: [
    "update:noCrop", "buildEffect", "buildShader", "close",
  ],
  data: () => ({
    tab: "effect",
    source: {
      effect: sampleEffect,
      webgl: sampleShader,
    },
  }),
  methods: {
    build(): void {
      if (this.tab === "effect") {
        this.buildEffect();
      } else {
        this.buildShader();
      }
    },
    buildEffect(): void {
      try {
        const effectImpl = new Function(
          "keyframe", "ctx", "cellWidth", "cellHeight",
          this.source.effect,
        );
        const effect: Effect = (...args) => {
          try {
            effectImpl(...args);
          } catch (error) {
            console.log(error);
          }
        };
        this.$emit("buildEffect", { label: "カスタム", value: effect });
      } catch (error) {
        console.log(error);
      }
    },
    buildShader(): void {
      try {
        const program: WebGLProgram = webglLoadEffectShader(webglEffectShader(this.source.webgl));
        const effect: WebGLEffect = (keyframe, w, h) => {
          webglSetFloat(program, "keyframe", keyframe);
          webglSetVec2(program, "resolution", [w, h]);
          return program;
        };
        this.$emit("buildShader", { label: "カスタム", value: effect });
      } catch (error) {
        console.log(error);
      }
    },
    /* eslint-enable */
  },
});
</script>

<template>
  <Card v-if="show">
    <Space vertical xlarge full>
      <TabGroup>
        <TabButton v-model="tab" value="effect">
          エフェクト (js)
        </TabButton>
        <TabButton v-model="tab" value="webgl">
          エフェクト (glsl)
        </TabButton>
      </TabGroup>
      <Fieldset label="ソース">
        <Space vertical full>
          <p class="description">
            コンパイルエラーはコンソールを見てください。
          </p>
          <p v-if="tab === 'effect'" class="description">
            args: keyframe, ctx, cellWidth, cellHeight
          </p>
          <Textarea v-model="source[tab]" block :rows="20" />
          <Button @click="build">
            適用
          </Button>
        </Space>
      </Fieldset>
      <Fieldset label="デバッグ">
        <Checkbox :model-value="noCrop" @update:model-value="$emit('update:noCrop', $event)">
          {{ "余白を切らない (効果適用時のみ)" }}
        </Checkbox>
      </Fieldset>
      <Button type="text" @click="$emit('close')">
        開発者モードを終わる
      </Button>
    </Space>
  </Card>
</template>

<style scoped>
.description {
  font-size: var(--fontSizeMedium);
}
</style>
