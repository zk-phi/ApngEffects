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
    <Space vertical xlarge full>
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
          <Space vertical>
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
  --distantFg: #fff;
  --border: #888;
  --primary: #edad0b;
  --primaryHover: #f2c145;
  --primaryActive: #d59b0a;
  --primaryShadow: 0 0 0 2px rgba(237, 173, 11, 0.2);
  --danger: #c7243a;
  --dangerHover: #d04255;
  --dangerActive: #b32034;
  --dangerShadow: 0 0 0 2px rgba(199, 36, 58, 0.2);

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
  --borderRadiusSmall: 1px;
  --borderRadius: 2px;
  --paddingXLarge: 20px 22px;
  --paddingLarge: 14px 16px;
  --paddingMedium: 10px 12px;
  --paddingSmall: 8px 10px;
  --paddingMinimal: 4px;
  --marginXLarge: 20px;
  --marginLarge: 16px;
  --marginMedium: 12px;
  --marginSmall: 8px;
  --marginXSmall: 4px;

  /* other */
  --textareaLineHeight: 1.4;
  --selectPadding: 10px calc(12px + 1em) 10px 12px;
  --numberPadding: 10px calc(12px + 2em) 10px 12px;
  --inputAddonTop: 10px; /* paddingMedium[0] */
  --sliderRailHeight: 0.375em;
  --sliderMarkHeight: 0.75em;
  --sliderKnobSize: 1.25em;
  --sliderValueMargin: 0.125em;
  --sliderValueWidth: 2.5em;
  --colorSliderRailHeight: 1.125em;
  --mediaIconSize: 34px;
  --popoverShadow: rgb(0 0 0 / 19%) 0 10px 20px, rgb(0 0 0 / 23%) 0 6px 6px;
  --tabButtonPadding: 0 6px 8px;
}
</style>

<style scoped>
.app {
  padding: var(--paddingLarge);
  font-family:
    "Helvetica Neue",
    Arial,
    "Hiragino Kaku Gothic ProN",
    "Hiragino Sans",
    Meiryo,
    sans-serif;
  line-height: 1;
}
</style>
