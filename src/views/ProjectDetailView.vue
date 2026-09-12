<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import MarkdownContent from '../components/media/MarkdownContent.vue'
import ProjectVideo from '../components/media/ProjectVideo.vue'
import { useProjects } from '../composables/useProjects'
import { useLocale } from '../composables/useLocale'
import { markdownDocument } from '../lib/markdown'

const route = useRoute()
const { locale, copy, localize } = useLocale()
const { projects, error: projectsError, loadProjects } = useProjects()
const markdown = ref('')
const loading = ref(true)
const state = ref('')
let controller
const project = computed(() => projects.value.find((item) => item.slug === route.params.slug))
const content = computed(() => markdownDocument(markdown.value))
const nextProject = computed(() => {
  const index = projects.value.findIndex((item) => item.slug === route.params.slug)
  if (index < 0 || projects.value.length < 2) return null
  return projects.value[(index + 1) % projects.value.length]
})

async function loadDetail() {
  controller?.abort()
  const currentController = new AbortController()
  controller = currentController
  const { signal } = currentController
  const language = locale.value
  const slug = route.params.slug
  loading.value = true
  state.value = ''
  markdown.value = ''

  try {
    await loadProjects()
    if (signal.aborted) return
    if (projectsError.value) {
      state.value = 'error'
      return
    }
    const currentProject = projects.value.find((item) => item.slug === slug)
    if (!currentProject) {
      state.value = 'not-found'
      return
    }
    const path = currentProject.content?.[language]
    if (!path) {
      state.value = 'pending'
      return
    }
    const response = await fetch(path, { signal })
    if (response.status === 404) {
      state.value = 'pending'
      return
    }
    if (!response.ok) throw new Error('Content request failed')
    const content = await response.text()
    if (signal.aborted) return
    // Development servers may return the app shell for a missing Markdown file.
    if (response.headers.get('content-type')?.includes('text/html') || /^\s*<!doctype html/i.test(content)) {
      state.value = 'pending'
      return
    }
    markdown.value = content
  } catch (reason) {
    if (!signal.aborted) state.value = 'error'
  } finally {
    if (!signal.aborted) loading.value = false
  }
}

watch([() => route.params.slug, locale], loadDetail, { immediate: true })
onBeforeUnmount(() => controller?.abort())
</script>

<template>
  <article class="detail-page page-width" :data-page-ready="!loading">
    <header class="page-heading">
      <router-link class="back-link text-link" to="/projects"><span aria-hidden="true">←</span> {{ copy.backToProjects }}</router-link>
      <p v-if="project" class="detail-category">{{ copy.categories[project.category] }}</p>
      <h1>{{ project ? localize(project.title) : copy.projectNote }}</h1>
      <p v-if="project">{{ localize(project.description) }}</p>
      <div v-if="project?.contribution" class="project-contribution"><span>{{ copy.contribution }}</span><strong>{{ localize(project.contribution) }}</strong></div>
    </header>
    <nav v-if="!loading && !state && content.headings.length >= 3" class="detail-toc" :aria-label="copy.onThisPage">
      <p class="section-label">{{ copy.onThisPage }}</p>
      <ul>
        <li v-for="heading in content.headings" :key="heading.id">
          <router-link class="text-link" :to="{ path: route.path, hash: `#${heading.id}` }">{{ heading.text }}</router-link>
        </li>
      </ul>
    </nav>
    <div class="detail-content">
      <ProjectVideo v-if="project?.video" :video="project.video" />
      <div v-if="loading" class="state" role="status">{{ copy.loadingDetail }}</div>
      <div v-else-if="state" class="state" :role="state === 'error' ? 'alert' : 'status'">
        <h2>{{ state === 'not-found' ? copy.projectNotFound : state === 'error' ? copy.detailErrorTitle : copy.detailUnavailable }}</h2>
        <p>{{ state === 'not-found' ? copy.projectNotFoundCopy : state === 'error' ? copy.detailError : copy.detailPending }}</p>
        <button v-if="state === 'error'" class="text-button" type="button" @click="loadDetail">{{ copy.retry }}</button>
        <router-link v-else class="text-link" to="/projects">{{ copy.browseProjects }} <span aria-hidden="true">→</span></router-link>
      </div>
      <MarkdownContent v-else :key="`${route.params.slug}-${locale}`" :blocks="content.blocks" />
    </div>
    <nav v-if="!loading && !state && nextProject" class="next-project" :aria-label="copy.nextProject">
      <router-link :to="`/project/${nextProject.slug}`">
        <span class="section-label">{{ copy.nextProject }}</span>
        <span class="next-project-title">{{ localize(nextProject.title) }}</span>
        <span class="next-project-arrow" aria-hidden="true">→</span>
      </router-link>
    </nav>
  </article>
</template>

<style scoped>
.detail-page { max-width: 800px; padding-bottom: 80px; }
.back-link { display: inline-block; margin-bottom: 44px; color: var(--ink-soft); }
.page-heading .detail-category { margin: 0 0 16px; font-size: 0.875rem; }
.page-heading h1 { font-size: clamp(2rem, 4.5vw, 3rem); line-height: 1.3; }
.detail-content { padding-top: 36px; border-top: 1px solid var(--line); }
.detail-toc { padding: 24px 0; border-top: 1px solid var(--line); }
.detail-toc ul { display: flex; flex-wrap: wrap; gap: 4px 24px; margin: 12px 0 0; padding: 0; list-style: none; }
.detail-toc a { display: inline-flex; align-items: center; min-height: 44px; line-height: 1.6; color: var(--ink-soft); }
.detail-toc a:is(:hover, :focus-visible) { color: var(--ink); }
.next-project { margin-top: 56px; border-top: 1px solid var(--line); }
.next-project > a { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; gap: 12px 24px; padding: 28px 0; text-decoration: none; }
.next-project .section-label { grid-column: 1 / -1; }
.next-project-title { font-family: var(--font-heading); font-size: 1.5rem; line-height: 1.5; }
.next-project-arrow { color: var(--ink-soft); transition: transform 180ms ease, color 180ms ease; }
.next-project a:is(:hover, :focus-visible) .next-project-title { text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 5px; }
.next-project a:is(:hover, :focus-visible) .next-project-arrow { color: var(--accent); transform: translateX(2px); }
@media (prefers-reduced-motion: reduce) { .next-project a:is(:hover, :focus-visible) .next-project-arrow { transform: none; } }
:deep(.markdown-body) { font-size: 1.0625rem; line-height: 1.95; overflow-wrap: anywhere; }
:deep(.markdown-body > :first-child) { margin-top: 0; }
:deep(.markdown-body h2), :deep(.markdown-body h3) { margin: 2.5em 0 0.8em; font-weight: 500; line-height: 1.5; }
:deep(.markdown-body h2) { font-size: 1.5rem; }
:deep(.markdown-body h3) { font-size: 1.2rem; }
:deep(.markdown-body p), :deep(.markdown-body ul), :deep(.markdown-body ol) { color: var(--ink-soft); }
:deep(.markdown-body li + li) { margin-top: 12px; }
:deep(.markdown-body table) { width: 100%; margin: 28px 0; border-collapse: collapse; font-size: 0.9375rem; }
:deep(.markdown-body th), :deep(.markdown-body td) { padding: 12px 20px 12px 0; border-bottom: 1px solid var(--line); text-align: left; vertical-align: top; }
:deep(.markdown-body th) { font-weight: 500; }
:deep(.markdown-body td) { color: var(--ink-soft); }
:deep(.markdown-body th:last-child), :deep(.markdown-body td:last-child) { padding-right: 0; }
:deep(.markdown-body a) { color: var(--ink); text-underline-offset: 4px; }
:deep(.markdown-body hr) { margin: 36px 0; border: 0; border-top: 1px solid var(--line); }
:deep(.markdown-body blockquote) { margin: 28px 0; padding-left: 20px; border-left: 2px solid var(--line-strong); }
:deep(.markdown-body code) { padding: 0.15em 0.4em; background: var(--surface); font-size: 0.9em; }
:deep(.markdown-body pre) { overflow-x: auto; padding: 16px; background: var(--surface); }
@media (max-width: 600px) { .detail-page { padding-bottom: 48px; } }
</style>
