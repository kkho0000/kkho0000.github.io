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
        <a
          class="project-link"
          :href="`/project/${encodeURIComponent(project.title)}`"
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
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.project-experience {
  margin-top: 20px;
  padding: 20px;
  background-color: #f9f9f9;
  background: linear-gradient(135deg, #d6d6d6, #f9f9f9);
  border-radius: 16px;
}

.projects {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.project {
  width: 100%;
  max-width: 800px;
  height: auto;
  margin: 15px auto;
  padding: 30px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.project-link {
  display: flex;
  align-items: center;
  width: 100%;
}

.project-image {
  width: 40%;
  height: auto;
  object-fit: cover;
  border-width: 1;
  border-radius: 8px;
  margin-left: 10%;
}

.background-image {
  position: fixed; /* 改为 fixed，固定在视口底部 */
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
</style>