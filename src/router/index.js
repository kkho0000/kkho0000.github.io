import { createRouter, createWebHistory } from 'vue-router'
import ProjectExperience from '../components/ProjectExperience.vue'
// 你还需要创建 ProjectDetail.vue
import ProjectDetail from '../components/ProjectDetail.vue'
import Introduction from '../components/Introduction.vue'

const routes = [
  { path: '/', component: Introduction },
  { path: '/projects', component: ProjectExperience },
  { path: '/project/:slug', component: ProjectDetail, props: true }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router