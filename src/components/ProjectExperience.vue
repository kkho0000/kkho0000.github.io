<script setup>
import {ref, onMounted} from 'vue'
const projects = ref([])

onMounted(async() => {
  const res = await fetch('/projects.json')
  projects.value = await res.json()
})
</script>

<template>
  <section class="project-experience">
    <div class="background-image"></div>
    <div class="projects">
      <div 
        class="project" 
        v-for="project in projects" 
        :key="project.title"
      >
        <router-link
          class="project-link"
          :to="`/project/${project.slug}`"
          style="display: flex; align-items: center; text-decoration: none; color: inherit;"
        >
          <div class="project-info" style="flex: 1; text-align: left;">
            <h3>{{ project.title }}</h3>
            <p>{{ project.description || '这里是项目简介...' }}</p>
          </div>
          <img
            class="project-image"
            :src="project.image"
            :alt="project.title"
          />
        </router-link>
      </div>
    </div>
  </section>
</template>

<style scoped>
.project-experience {
  padding-top: 20px;
}

.projects {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.project {
  max-width: 900px;
  margin: 15px auto;
  padding: 30px;
  border: 1px solid #9d9d9d;
  border-radius: 16px;
  background: linear-gradient(135deg, #f9f9f9, #b3b3b3);
}

.projects,
.project {
  width: 100%;
  box-sizing: border-box;
}

.project-experience {
  max-width: 90vw;
  overflow-x: hidden;
}

.project-link {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 32px;
}

.project-info,
.project-image {
  flex: 1 1 0;
  min-width: 0;
}

.project-image {
  height: auto;
  object-fit: cover;
  border-radius: 8px;
}

.background-image {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: -1;
  background: linear-gradient(135deg, #272727, #4a4a4a, #6d6d6d, #909090, #b3b3b3, #d6d6d6, #f9f9f9);
  background-size: 400% 400%;
  animation: gradientMove 15s ease infinite;
  filter: blur(12px) brightness(0.8);
  opacity: 1;
  pointer-events: none;
}

@keyframes gradientMove {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@media (max-width: 600px) {
  .project-experience {
    margin-top: 8px;
    align-self: center;
    width: 100%;
  }
  .project {
    padding: 4px;
  }
  .project {
    max-width: 100%;
    padding: 12px;
    margin: 8px 0;
  }
  .project-link {
    flex-direction: column;
    align-items: flex-start;
    gap: 0;
  }
  .project-info {
    width: 100%;
    margin-bottom: 8px;
    text-align: left;
  }
  .project-image {
    width: 100%;
    margin-left: 0;
    margin-bottom: 0;
    border-radius: 8px;
    height: auto;
    max-height: 180px;
    object-fit: cover;
  }
}
</style>