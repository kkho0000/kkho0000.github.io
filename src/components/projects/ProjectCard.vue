<script setup>
import { useLocale } from '../../composables/useLocale'
import ResponsiveImage from '../media/ResponsiveImage.vue'

defineProps({ project: { type: Object, required: true } })
const { copy, localize } = useLocale()
</script>

<template>
  <article class="project-card">
    <router-link class="project-link" :to="`/project/${project.slug}`">
      <div class="project-visual" :style="{ '--cover-scale': project.imageFocus?.scale, '--cover-y': project.imageFocus?.y }">
        <ResponsiveImage v-if="project.image" :src="project.image" alt="" sizes="(max-width: 600px) calc(100vw - 40px), (max-width: 800px) 200px, 248px" aspect="16 / 10" :fit="project.imageFocus ? 'cover' : 'contain'" :retryable="false" />
        <span v-else class="image-fallback">
          <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1" aria-hidden="true"><rect x="5" y="6" width="22" height="20" rx="1"/><path d="m5 22 7-7 5 5 4-4 6 6"/><circle cx="21" cy="12" r="2"/></svg>
          {{ copy.imageUnavailable }}
        </span>
      </div>
      <div class="project-copy">
        <p class="project-category">{{ copy.categories[project.category] }}</p>
        <h2>{{ localize(project.title) }}</h2>
        <p class="project-description">{{ localize(project.description) }}</p>
        <p v-if="project.contribution" class="project-contribution"><span>{{ copy.contribution }}</span><strong>{{ localize(project.contribution) }}</strong></p>
      </div>
      <span class="project-arrow" aria-hidden="true">↗</span>
    </router-link>
  </article>
</template>

<style scoped>
.project-card + .project-card { border-top: 1px solid var(--line); }
.project-link { display: grid; grid-template-columns: 248px minmax(0, 1fr) 20px; gap: 36px; align-items: center; padding: 32px 0; text-decoration: none; }
.project-visual { display: grid; aspect-ratio: 16 / 10; overflow: hidden; place-items: center; background: var(--surface); }
.project-visual :deep(img) { transform: scale(var(--cover-scale, 1)) translateY(var(--cover-y, 0%)); }
.image-fallback { display: flex; align-items: center; flex-direction: column; gap: 10px; color: var(--ink-soft); font-size: 0.8125rem; }
.image-fallback svg { width: 32px; height: 32px; opacity: 0.6; }
.project-category { margin: 0 0 10px; color: var(--ink-soft); font-size: 0.8125rem; letter-spacing: 0.03em; }
h2 { margin: 0 0 12px; font-family: var(--font-heading); font-size: 1.4375rem; font-weight: 500; letter-spacing: -0.015em; line-height: 1.5; }
.project-description { max-width: 620px; margin: 0; color: var(--ink-soft); font-size: 1rem; line-height: 1.85; text-wrap: pretty; }
.project-arrow { align-self: start; margin-top: 4px; color: var(--ink-soft); transition: transform 180ms ease, color 180ms ease; }
.project-link:is(:hover, :focus-visible) h2 { text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 5px; }
.project-link:is(:hover, :focus-visible) .project-arrow { color: var(--accent); transform: translate(2px, -2px); }
@media (prefers-reduced-motion: reduce) { .project-link:is(:hover, :focus-visible) .project-arrow { transform: none; } }
@media (max-width: 800px) { .project-link { grid-template-columns: 200px minmax(0, 1fr) 16px; gap: 24px; } }
@media (max-width: 600px) {
  .project-link { grid-template-columns: minmax(0, 1fr) 20px; gap: 22px 12px; }
  .project-visual { grid-column: 1 / -1; }
  .project-copy { grid-column: 1; }
  .project-arrow { grid-column: 2; }
}
</style>
