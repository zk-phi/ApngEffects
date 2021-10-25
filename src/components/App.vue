<script lang="ts">
import { defineComponent } from "vue";
import { saveAs } from "file-saver";
import Header from "./global/Header.vue";
import Footer from "./global/Footer.vue";
import Target from "./cards/Target.vue";
import Result from "./cards/Result.vue";
import MasterTexture from "./cards/MasterTexture.vue";
import SubTexture from "./cards/SubTexture.vue";
import Button from "./inputs/Button.vue";
import Space from "./global/Space.vue";
import Grid from "./global/Grid.vue";
import GridItem from "./global/GridItem.vue";
import Save from "./icons/Save.vue";
import { extension } from "../utils/file";
import "../css/destyle.css";

export default defineComponent({
  components: {
    MasterTexture,
    SubTexture,
    Target,
    Result,
    Header,
    Footer,
    Space,
    Grid,
    GridItem,
    Button,
    Save,
  },
  data() {
    return {
      baseImage: null as (HTMLCanvasElement | null),
      subImage: null as (HTMLCanvasElement | null),
      resultImage: null as Blob | null,
      previewMode: false,
      width: 640,
      height: 480,
    };
  },
  methods: {
    onRenderTarget(img: Blob): void {
      this.resultImage = img;
    },
    onRender(img: HTMLCanvasElement): void {
      this.baseImage = img;
    },
    onRenderSubImage(img: HTMLCanvasElement): void {
      this.subImage = img;
    },
    onDownload(): void {
      if (this.resultImage) {
        saveAs(this.resultImage, `apngeffects.${extension(this.resultImage)}`);
      }
    },
  },
});
</script>

<template>
  <div class="app">
    <Space vertical large full>
      <Header />
      <Grid :columns="[[Infinity, 3]]">
        <GridItem :span="2">
          <Space vertical xlarge full>
            <Grid :columns="[[Infinity, 2]]">
              <GridItem>
                <MasterTexture
                    v-model:width="width"
                    v-model:height="height"
                    :show="true"
                    @render="onRender" />
              </GridItem>
              <GridItem>
                <SubTexture
                    default-color="#ffffff"
                    :width="width"
                    :height="height"
                    :show="true"
                    @render="onRenderSubImage" />
              </GridItem>
            </Grid>
            <Target
                :show="true"
                :base-image="baseImage"
                :sub-image="subImage"
                :width="width"
                :height="height"
                @render="onRenderTarget" />
          </Space>
        </GridItem>
        <GridItem>
          <Space large vertical>
            <Result :image="resultImage" />
            <Button v-if="baseImage" type="primary" @click="onDownload">
              <template #icon>
                <Save />
              </template>
              APNG を保存
            </Button>
          </Space>
        </GridItem>
      </Grid>
      <Footer />
    </Space>
  </div>
</template>

<style>
:root {
  /* colors */
  --fg: #333;
  --bg: #fff;
  --accentBg: #fafafa;
  --elevatedBg: var(--bg);
  --light: var(--bg);
  --dark: var(--fg);
  --distantFg: var(--bg);
  --border: #aaa;
  --primary: #ea0; /* okhsl(80, 100, 75) */
  --primaryHover: #ffb81c; /* v = 80 */
  --primaryActive: #de9e00; /* v = 70 */
  --primaryShadow: 0 0 0 2px rgba(238, 170, 0, 0.2);
  --danger: #ff91b4; /* h = 0 */
  --dangerHover: #ffaac4;
  --dangerActive: #ff77a7;
  --dangerShadow: 0 0 0 2px rgba(255, 145, 180, 0.2);

  /* typography */
  --fontSizeTitle: 28px;
  --fontSizeXLarge: 18px;
  --fontSizeLarge: 16px;
  --fontSizeMedium: 14px;
  --fontSizeSmallIcon: 16px;
  --fontSizeIcon: 26px;
  --fontSizePart: 48px;
  --multilineTextLineHeight: 1.5;

  /* layout */
  --spacingSmall: 0.25rem;
  --spacingInlineSmall: 0.375rem;
  --spacingMedium: 0.5rem;
  --spacingLarge: 1rem;
  --spacingXLarge: 1.75rem;
  --paddingV: 0.75rem;
  --paddingH: 1rem;
  --padding: var(--paddingV) var(--paddingH);
  --paddingMinimal: 4px;
  --borderRadiusSmall: 1px;
  --borderRadius: 2px;

  /* other */
  --textareaLineHeight: 1.4;
  --selectPadding: var(--paddingV) calc(var(--paddingH) + 1rem) var(--paddingV) var(--paddingH);
  --numberPadding: var(--paddingV) calc(var(--paddingH) + 2rem) var(--paddingV) var(--paddingH);
  --sliderRailHeight: 0.375em;
  --sliderMarkHeight: 0.75em;
  --sliderKnobSize: 1.25em;
  --sliderValueMargin: 0.125em;
  --sliderValueWidth: 2.5em;
  --colorSliderRailHeight: 1.125em;
  --mediaIconSize: 34px;
  --popoverShadow: rgb(0 0 0 / 19%) 0 10px 20px, rgb(0 0 0 / 23%) 0 6px 6px;
  --tabButtonPadding: 0 calc(var(--paddingH) * 0.75) calc(var(--paddingV) - 3px);
}

@media (prefers-color-scheme: dark) {
  :root {
    --fg: #eee;
    --bg: #222;
    --accentBg: #333;
    --elevatedBg: #555;
    --light: var(--fg);
    --dark: var(--bg);
    --border: #777;
    --popoverShadow: none;
  }
}

/* stylelint-disable-next-line selector-max-type */
html {
  padding: var(--spacingXLarge);
  font-family:
    "Helvetica Neue",
    Arial,
    "Hiragino Kaku Gothic ProN",
    "Hiragino Sans",
    Meiryo,
    sans-serif;
  font-size: var(--fontSizeMedium);
  line-height: 1;
  color: var(--fg);
  background-color: var(--bg);
}
</style>
