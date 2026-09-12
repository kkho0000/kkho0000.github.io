<script setup>
import { computed, ref, watch } from 'vue'
import { useLocale } from '../../composables/useLocale'
import imageManifest from '../../media/images.json'
import ResponsiveImage from './ResponsiveImage.vue'

const props = defineProps({ video: { type: Object, required: true } })
const { copy } = useLocale()
const failed = ref(false)
const player = ref(null)
const embedStarted = ref(false)
const embedLoaded = ref(false)
const isYouTube = computed(() => props.video.provider === 'youtube')
const embedUrl = computed(() => isYouTube.value ? `https://www.youtube.com/embed/${props.video.id}?rel=0&autoplay=1&playsinline=1` : '')
const videoUrl = computed(() => isYouTube.value ? `https://www.youtube.com/watch?v=${props.video.id}` : props.video.src)
const poster = computed(() => imageManifest[props.video.poster]?.src || props.video.poster)
function retry() {
  failed.value = false
  player.value?.load()
}
watch(videoUrl, () => {
  failed.value = false
  embedStarted.value = false
  embedLoaded.value = false
})
</script>

<template>
  <figure class="project-video">
    <div v-if="isYouTube" class="youtube-embed">
      <ResponsiveImage v-if="!embedLoaded && video.poster" :src="video.poster" alt="" sizes="(max-width: 600px) calc(100vw - 40px), (max-width: 896px) calc(100vw - 96px), 800px" aspect="16 / 9" :retryable="false" />
      <button v-if="!embedStarted" class="youtube-preview" type="button" :aria-label="copy.playProjectVideo" @click="embedStarted = true">
        <span class="play-label">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m9 5 11 7-11 7Z" /></svg>
          {{ copy.playProjectVideo }}
        </span>
      </button>
      <span v-else-if="!embedLoaded" class="play-label" role="status">{{ copy.loadingProjectVideo }}</span>
      <iframe
        v-if="embedStarted"
        :key="video.id"
        class="youtube-player"
        :class="{ 'is-ready': embedLoaded }"
        :src="embedUrl"
        :title="copy.projectVideo"
        width="1280"
        height="720"
        referrerpolicy="strict-origin-when-cross-origin"
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowfullscreen
        @load="embedLoaded = true"
      ></iframe>
    </div>
    <video v-else ref="player" :key="video.src" :src="video.src" :poster="poster" :width="video.width" :height="video.height" :aria-label="copy.projectVideo" controls playsinline preload="none" @error="failed = true">
      <a :href="video.src">{{ copy.openVideo }}</a>
    </video>
    <div v-if="failed && !isYouTube" class="video-error" role="alert">
      <span>{{ copy.videoLoadError }}</span>
      <button class="text-button" type="button" @click="retry">{{ copy.retry }}</button>
    </div>
    <figcaption>
      <span>{{ copy.projectVideo }}<template v-if="video.duration"> · {{ video.duration }}</template></span>
      <a :href="videoUrl" target="_blank" rel="noreferrer">{{ isYouTube ? copy.watchOnYouTube : copy.openVideo }} <span aria-hidden="true">↗</span></a>
    </figcaption>
  </figure>
</template>

<style scoped>
.project-video { margin: 0 0 44px; }
video, iframe { display: block; width: 100%; height: auto; aspect-ratio: 16 / 9; border: 0; background: var(--surface); }
.youtube-embed { position: relative; aspect-ratio: 16 / 9; overflow: hidden; background: var(--surface); }
.youtube-preview { position: absolute; inset: 0; width: 100%; padding: 0; border: 0; background: transparent; cursor: pointer; }
.youtube-player { position: absolute; inset: 0; visibility: hidden; }
.youtube-player.is-ready { visibility: visible; }
.play-label { position: absolute; inset: auto 20px 20px auto; display: flex; align-items: center; gap: 10px; padding: 12px 18px; color: var(--paper); background: var(--ink); font-size: 0.9375rem; }
.play-label svg { width: 20px; height: 20px; }
.youtube-preview:hover .play-label { background: var(--accent); }
@media (max-width: 600px) { .play-label { right: 12px; bottom: 12px; padding: 9px 12px; } }
figcaption { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 12px; margin-top: 12px; color: var(--ink-soft); font-size: 0.875rem; line-height: 1.7; }
figcaption a { text-decoration: none; }
figcaption a:hover { text-decoration: underline; text-underline-offset: 4px; }
.video-error { display: flex; flex-wrap: wrap; align-items: center; gap: 16px; padding: 16px 0; font-size: 0.9375rem; color: var(--ink-soft); }
</style>
