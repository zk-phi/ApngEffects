<template>
  <header class="header">
    <h1 class="title">
      ApngEffects
    </h1>
    <p class="description">
      ちょっとした APNG 素材をサクッと作れる🐱
    </p>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  flex-wrap: wrap;
  color: var(--fg);
  align-items: flex-end;
  gap: var(--marginSmall);
}

.title {
  margin: 0;
  font-size: var(--fontSizeTitle);
  font-weight: bold;
  line-height: 1;
}

.description {
  margin: 0;
  font-size: var(--fontSizeMedium);
  line-height: var(--multilineTextLineHeight);
  color: var(--fg);
}
</style>
