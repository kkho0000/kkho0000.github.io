<script setup>
import { computed, ref, watch } from 'vue'
import imageManifest from '../../media/images.json'
import { useLocale } from '../../composables/useLocale'

const props = defineProps({
  src: { type: String, required: true },
  alt: { type: String, default: '' },
  sizes: { type: String, default: '100vw' },
  loading: { type: String, default: 'lazy' },
  priority: { type: String, default: 'auto' },
  fit: { type: String, default: 'cover' },
  aspect: { type: String, default: '' },
  retryable: { type: Boolean, default: true },
})
const { copy } = useLocale()
const asset = computed(() => imageManifest[props.src])
const state = ref('loading')
const useOriginal = ref(false)
const attempt = ref(0)
const source = computed(() => useOriginal.value ? props.src : asset.value?.src || props.src)
const ratio = computed(() => props.aspect || (asset.value ? `${asset.value.width} / ${asset.value.height}` : '16 / 9'))

function reset() {
  state.value = 'loading'
  useOriginal.value = false
  attempt.value += 1
}
function onError() {
  if (!useOriginal.value && asset.value) {
    useOriginal.value = true
    attempt.value += 1
  } else {
    state.value = 'error'
  }
}
watch(() => props.src, reset)
</script>

<template>
  <span class="responsive-image" :class="`is-${state}`" :style="{ aspectRatio: ratio, '--image-fit': fit }">
    <picture v-if="state !== 'error'" :key="`${src}-${attempt}`">
      <source v-if="asset && !useOriginal" type="image/webp" :srcset="asset.webp" :sizes="sizes" />
      <img
        :src="source"
        :srcset="useOriginal ? undefined : asset?.jpeg"
        :sizes="sizes"
        :alt="alt"
        :width="asset?.width"
        :height="asset?.height"
        :loading="loading"
        :fetchpriority="priority"
        decoding="async"
        @load="state = 'loaded'"
        @error="onError"
      />
    </picture>
    <span v-else class="image-error" role="status">
      <span>{{ copy.imageLoadError }}</span>
      <button v-if="retryable" type="button" class="text-button" @click="reset">{{ copy.retry }}</button>
    </span>
  </span>
</template>

<style scoped>
.responsive-image { position: relative; display: block; width: 100%; overflow: hidden; background: var(--surface); }
picture { display: block; width: 100%; height: 100%; }
img { display: block; width: 100%; height: 100%; object-fit: var(--image-fit); object-position: var(--image-position, center); }
.image-error { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding: 20px; color: var(--ink-soft); font-size: 0.875rem; text-align: center; }
</style>
