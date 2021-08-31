<script lang="ts">
import { defineComponent } from "vue";
import { urlToImg, loadFileAsBlobURL } from "../../utils/canvas";
import Button from "./Button.vue";
import IconButton from "./IconButton.vue";
import File from "../icons/File.vue";
import Delete from "../icons/Delete.vue";

export default defineComponent({
  components: {
    Button, IconButton, File, Delete,
  },
  props: {
    label: { type: String, default: undefined },
    removable: { type: Boolean, default: false },
  },
  emits: [
    "load",
  ],
  data() {
    return {
      file: null as File | null,
    };
  },
  methods: {
    onClick(): void {
      (this.$refs.input as HTMLInputElement).click();
    },
    onChange(e: { target: { files: FileList } }): void {
      if (e.target.files[0]) {
        this.file = e.target.files[0];
        loadFileAsBlobURL(this.file).then((blobUrl) => {
          urlToImg(blobUrl, (img) => this.$emit("load", img));
        });
      }
    },
    onRemove(): void {
      this.file = null;
      (this.$refs.input as HTMLInputElement).value = "";
      this.$emit("load", null);
    },
  },
});
</script>

<template>
  <input ref="input" type="file" style="display: none;" @change="onChange">
  <Button type="dashed" @click="onClick">
    <slot />
  </Button>
  <div v-if="file" class="file">
    <File />
    {{ file.name }}
    <IconButton v-if="removable" type="danger" @click="onRemove">
      <Delete />
    </IconButton>
  </div>
</template>

<style scoped>
.file {
  margin-top: var(--marginSmall);
  font-size: var(--fontSizeMedium);
  color: var(--fg);
  user-select: none;
}
</style>
