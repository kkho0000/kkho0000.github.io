<script setup>
import { onMounted } from 'vue'
import ProjectCard from '../components/projects/ProjectCard.vue'
import ResponsiveImage from '../components/media/ResponsiveImage.vue'
import FocusIcon from '../components/icons/FocusIcon.vue'
import { useLocale } from '../composables/useLocale'
import { useProjects } from '../composables/useProjects'
import { contact } from '../content/site'

const { locale, copy } = useLocale()
const { projects, loading, error, loadProjects } = useProjects()
onMounted(loadProjects)
</script>

<template>
  <div class="home page-width" :data-page-ready="!loading">
    <section class="introduction" aria-labelledby="intro-title">
      <div class="intro-text">
        <div class="name-line">
          <h1 id="intro-title">{{ copy.name }}</h1>
          <span class="alternate-name" :lang="locale === 'en' ? 'zh-CN' : 'en'">{{ copy.alternateName }}</span>
        </div>
        <p class="intro-copy">{{ copy.introduction }}</p>
        <router-link class="intro-jump text-link" :to="{ path: '/', hash: '#selected-title' }">{{ copy.jumpToProjects }} <span aria-hidden="true">↓</span></router-link>
        <section class="education" aria-labelledby="education-title">
          <h2 id="education-title" class="section-label">{{ copy.educationTitle }}</h2>
          <ul class="education-list">
            <li v-for="entry in copy.education" :key="entry.period" class="education-item">
              <div>
                <h3>{{ entry.school }}</h3>
                <p>{{ entry.degree }}</p>
              </div>
              <span class="education-period">{{ entry.period }}</span>
            </li>
          </ul>
        </section>
        <div class="intro-links">
          <a :href="`mailto:${contact.email}`">{{ contact.email }} <span aria-hidden="true">↗</span></a>
          <a :href="contact.github" target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>
        </div>
      </div>
      <div class="portrait">
        <ResponsiveImage src="/img/profile.JPG" :alt="copy.portraitAlt" sizes="(max-width: 600px) 360px, 500px" loading="eager" priority="high" aspect="3 / 4" :retryable="false" />
      </div>
    </section>

    <section class="focus-section" aria-labelledby="focus-title">
      <h2 id="focus-title" class="section-label">{{ copy.focusTitle }}</h2>
      <div class="focus-grid">
        <article v-for="(area, index) in copy.focus" :key="index" class="focus-area">
          <FocusIcon :kind="index" />
          <h3>{{ area.title }}</h3>
          <p>{{ area.description }}</p>
        </article>
      </div>
    </section>

    <section class="selected-section" aria-labelledby="selected-title">
      <div class="section-heading">
        <h2 id="selected-title" class="section-label anchor-target" tabindex="-1">{{ copy.selectedWork }}</h2>
        <router-link class="text-link" to="/projects">{{ copy.allProjects }} <span aria-hidden="true">↗</span></router-link>
      </div>
      <div v-if="loading" class="state" role="status">{{ copy.loadingProjects }}</div>
      <div v-else-if="error" class="state" role="alert">
        <p>{{ copy.projectsError }}</p>
        <button class="text-button" type="button" @click="loadProjects">{{ copy.retry }}</button>
      </div>
      <div v-else-if="!projects.length" class="state" role="status">{{ copy.emptyProjects }}</div>
      <div v-else class="project-list">
        <ProjectCard v-for="project in projects.slice(0, 2)" :key="project.slug" :project="project" />
      </div>
    </section>
  </div>
</template>

<style scoped>
.introduction { display: grid; grid-template-columns: minmax(0, 1fr) 268px; align-items: center; gap: 72px; padding: 82px 0; }
.name-line { display: flex; align-items: baseline; flex-wrap: wrap; gap: 16px 24px; }
.name-line h1 { margin: 0; font-family: var(--font-heading); font-size: clamp(3rem, 5vw, 4.5rem); font-weight: 400; letter-spacing: -0.035em; line-height: 1.2; }
.alternate-name { color: var(--ink-soft); font-size: 1.0625rem; }
.intro-copy { max-width: 610px; margin: 28px 0 0; color: var(--ink-soft); font-size: 1.125rem; line-height: 1.95; text-wrap: pretty; }
.intro-jump { display: none; }
.education { margin-top: 34px; }
.education-list { display: grid; gap: 20px; margin: 18px 0 0; padding: 0; list-style: none; }
.education-item { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: baseline; gap: 20px; }
.education-item h3 { margin: 0; font-size: 1rem; font-weight: 500; line-height: 1.6; }
.education-item p { margin: 4px 0 0; color: var(--ink-soft); font-size: 1rem; line-height: 1.7; }
.education-period { color: var(--ink-soft); font-size: 0.875rem; font-variant-numeric: tabular-nums; white-space: nowrap; }
.intro-links { display: flex; flex-wrap: wrap; gap: 12px 28px; margin-top: 28px; }
.intro-links a { font-size: 1rem; text-decoration: none; }
.intro-links a:hover { text-decoration: underline; text-underline-offset: 5px; }
.intro-links a span { margin-left: 4px; color: var(--ink-soft); }
.portrait { width: 100%; margin: 0; }
.portrait :deep(.responsive-image) { --image-position: right center; }
.portrait :deep(img) { filter: saturate(0.72); }
.focus-section { padding: 32px 0 68px; border-top: 1px solid var(--line); }
.focus-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 42px; margin-top: 36px; }
.focus-area h3 { margin: 22px 0 14px; font-size: 1.1875rem; font-weight: 500; line-height: 1.6; }
.focus-area p { margin: 0; color: var(--ink-soft); font-size: 1rem; line-height: 1.9; text-wrap: pretty; }
.selected-section { padding: 32px 0 72px; border-top: 1px solid var(--line); }
.section-heading { display: flex; align-items: baseline; justify-content: space-between; gap: 20px; margin-bottom: 12px; }
@media (max-width: 900px) {
  .introduction { grid-template-columns: minmax(0, 1fr) 212px; gap: 36px; padding: 64px 0; }
  .focus-grid { gap: 28px; }
}
@media (max-width: 700px) {
  .introduction { grid-template-columns: minmax(0, 1fr) 176px; gap: 28px; }
  .intro-links { gap: 12px; }
  .intro-links a { font-size: 0.9375rem; }
  .name-line { gap: 12px; }
}
@media (max-width: 600px) {
  .introduction { grid-template-columns: 1fr; gap: 36px; padding: 48px 0; }
  .portrait { width: 190px; justify-self: end; }
  .name-line { gap: 16px; }
  .intro-copy { font-size: 1.0625rem; }
  .intro-jump { display: inline-flex; align-items: center; min-height: 44px; margin-top: 12px; color: var(--accent); }
  .education-item { grid-template-columns: 1fr; gap: 5px; }
  .education-period { grid-row: 1; }
  .focus-grid { grid-template-columns: 1fr; gap: 36px; margin-top: 30px; }
  .focus-area { display: grid; grid-template-columns: 40px 1fr; column-gap: 20px; }
  .focus-icon { grid-row: span 2; margin-top: 3px; }
  .focus-area h3 { margin: 0 0 10px; }
  .focus-section { padding-bottom: 48px; }
  .selected-section { padding-bottom: 48px; }
}
</style>
