<script lang="ts">
import { defineComponent, PropType } from "vue";
import { HWB2HEX } from "../../utils/color";

export default defineComponent({
  props: {
    h: { type: Number, required: true },
    w: { type: Number, required: true },
    b: { type: Number, required: true },
  },
  emits: [
    "update:w", "update:b",
  ],
  data: () => ({
    moveHandler: null as ((e: PointerEvent) => void) | null,
    upHandler: null as ((e?: PointerEvent) => void) | null,
  }),
  computed: {
    baseColor(): string {
      return HWB2HEX({ h: this.h, w: 0, b: 0 });
    },
  },
  beforeUnmount() {
    if (this.upHandler) {
      this.upHandler();
    }
  },
  methods: {
    startDrag(evt: PointerEvent): void {
      if (this.moveHandler) return;
      const rect = (this.$refs.container as HTMLDivElement).getBoundingClientRect();
      this.moveHandler = (e: PointerEvent) => {
        const white = (1 - (e.clientX - rect.left) / rect.width);
        const black = (e.clientY - rect.top) / rect.height;
        this.$emit("update:w", 100 * Math.min(1, Math.max(0, white)));
        this.$emit("update:b", 100 * Math.min(1, Math.max(0, black)));
        e.preventDefault();
      };
      this.upHandler = (e?: PointerEvent) => {
        if (this.moveHandler) {
          document.removeEventListener("pointermove", this.moveHandler);
          this.moveHandler = null;
        }
        if (this.upHandler) {
          document.removeEventListener("pointerup", this.upHandler);
          document.removeEventListener("pointerleave", this.upHandler);
          this.upHandler = null;
        }
        if (e) {
          e.preventDefault();
        }
      };
      document.addEventListener("pointermove", this.moveHandler);
      document.addEventListener("pointerup", this.upHandler);
      document.addEventListener("pointerleave", this.upHandler);
      evt.preventDefault();
    },
  },
});
</script>

<template>
  <div class="tone-picker" :style="{ '--jsValueH': (1 - w / 100), '--jsValueV': b / 100 }">
    <div ref="container" class="container">
      <div class="layer" :style="{ background: baseColor }" />
      <div class="layer" :style="{ background: `linear-gradient(90deg, white, transparent)` }" />
      <div class="layer" :style="{ background: `linear-gradient(0deg, black, transparent)` }" />
      <div class="knob" @pointerdown="startDrag($event)" />
    </div>
  </div>
</template>

<style scoped>
.tone-picker {
  position: relative;
  display: block;
  height: 320px; /* override me */
  width: 100%;
}

.container {
  position: relative;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.layer {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  border: 1px solid var(--border);
}

.knob {
  position: absolute;
  left: calc(100% * var(--jsValueH));
  top: calc(100% * var(--jsValueV));
  display: inline-block;
  width: var(--sliderKnobSize);
  height: var(--sliderKnobSize);
  margin-top: calc(-1 * var(--sliderKnobSize) / 2);
  margin-left: calc(-1 * var(--sliderKnobSize) / 2);
  cursor: pointer;
  background-color: transparent;
  border-radius: calc(var(--sliderKnobSize) / 2);
  box-shadow:
    0 0 0 1px inset var(--border),
    0 0 0 2px inset white,
    0 0 0 3px inset black;
  /* stylelint-disable-next-line plugin/no-unsupported-browser-features */
  touch-action: none;
}

.knob:hover {
  box-shadow:
    0 0 0 1px inset var(--primary),
    0 0 0 2px inset white,
    0 0 0 3px inset black;
}

.knob:active {
  box-shadow:
    var(--primaryShadow),
    0 0 0 1px inset var(--primaryActive),
    0 0 0 2px inset white,
    0 0 0 3px inset black;
}
</style>