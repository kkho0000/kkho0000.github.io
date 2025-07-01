<script setup>
import { ref } from 'vue'
import Introduction from './components/Introduction.vue'
import ProjectExperience from './components/ProjectExperience.vue'

const currentTab = ref('intro')
</script>

<template>
  <div class="tabs">
    <router-link to="/" :class="{active: $route.path === '/'}">个人介绍</router-link>
    <router-link to="/projects" :class="{active: $route.path === '/projects'}">项目经历</router-link>
  </div>
  <router-view />
</template>

<style scoped>
.tabs {
  display: flex;
  gap: 24px;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: #fff;
  z-index: 100;
  padding: 16px 0 0 0;
  box-shadow: 0 4px 8px rgba(0,0,0,0.03);
}

.tabs :deep(a) {
  padding: 8px 24px;
  border: none;
  color: #222;
  background: #fff;
  cursor: pointer;
  border-radius: 6px 6px 0 0;
  font-size: 16px;
  border-bottom: 2px solid transparent;
  outline: none;
  text-decoration: none;
  transition: color 0.2s, border-bottom 0.2s, background 0.2s;
}

.tabs :deep(.active) {
  background: #fff;
  border-bottom: 2px solid #427db9;
  color: #427db9;
  font-weight: bold;
}

.tab-content {
  min-height: 200px;
}

:global(body) {
  color: #222;
}
</style>
