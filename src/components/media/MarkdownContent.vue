<script setup>
import { useLocale } from '../../composables/useLocale'
import ResponsiveImage from './ResponsiveImage.vue'
import imageManifest from '../../media/images.json'

defineProps({ blocks: { type: Array, required: true } })
const { copy } = useLocale()
</script>

<template>
  <div class="markdown-body">
    <template v-for="(block, index) in blocks" :key="index">
      <h2 v-if="block.type === 'heading'" :id="block.id" tabindex="-1" v-html="block.html"></h2>
      <figure v-else-if="block.type === 'image'" class="content-figure" :style="{ maxWidth: imageManifest[block.src] ? `${imageManifest[block.src].width}px` : undefined }">
        <ResponsiveImage :key="block.src" :src="block.src" :alt="block.alt" sizes="(max-width: 600px) calc(100vw - 40px), (max-width: 896px) calc(100vw - 96px), 800px" :loading="block.index === 0 ? 'eager' : 'lazy'" :priority="block.index === 0 ? 'high' : 'auto'" fit="contain" />
        <figcaption>
          <span>{{ block.alt }}</span>
          <a :href="block.src" target="_blank" rel="noreferrer">{{ copy.openOriginal }} <span aria-hidden="true">↗</span></a>
        </figcaption>
      </figure>
      <div v-else v-html="block.html"></div>
    </template>
  </div>
</template>

<style scoped>
.content-figure { margin: 36px auto; }
.content-figure:first-child { margin-top: 0; }
figcaption { display: flex; justify-content: space-between; gap: 12px 24px; margin-top: 12px; color: var(--ink-soft); font-size: 0.8125rem; line-height: 1.7; }
figcaption a { flex-shrink: 0; text-decoration: none; }
figcaption a:hover { text-decoration: underline; text-underline-offset: 4px; }
@media (max-width: 480px) { figcaption { flex-wrap: wrap; } }
</style>
