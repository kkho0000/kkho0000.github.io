<script setup>
import { onMounted } from 'vue'
import ProjectCard from '../components/projects/ProjectCard.vue'
import { useProjects } from '../composables/useProjects'
import { useLocale } from '../composables/useLocale'

const { projects, loading, error, loadProjects } = useProjects()
const { copy } = useLocale()
onMounted(loadProjects)
</script>

<template>
  <section class="projects-page page-width" :data-page-ready="!loading" aria-labelledby="projects-title">
    <header class="page-heading">
      <h1 id="projects-title">{{ copy.projects }}</h1>
      <p>{{ copy.projectsIntro }}</p>
    </header>
    <div v-if="loading" class="state" role="status">{{ copy.loadingProjects }}</div>
    <div v-else-if="error" class="state" role="alert">
      <p>{{ copy.projectsError }}</p>
      <button class="text-button" type="button" @click="loadProjects">{{ copy.retry }}</button>
    </div>
    <div v-else-if="!projects.length" class="state" role="status">{{ copy.emptyProjects }}</div>
    <div v-else class="project-list">
      <ProjectCard v-for="project in projects" :key="project.slug" :project="project" />
    </div>
  </section>
</template>

<style scoped>
.projects-page { padding-bottom: 72px; }
.project-list { border-top: 1px solid var(--line); }
@media (max-width: 600px) { .projects-page { padding-bottom: 48px; } }
</style>
