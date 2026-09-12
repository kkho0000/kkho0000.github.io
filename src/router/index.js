import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { rememberProjectListPosition, scrollBehavior } from './scroll'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/projects',
    name: 'projects',
    component: () => import('../views/ProjectsView.vue'),
  },
  {
    path: '/project/:slug',
    name: 'project-detail',
    component: () => import('../views/ProjectDetailView.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior,
})

router.beforeEach(rememberProjectListPosition)

export default router
