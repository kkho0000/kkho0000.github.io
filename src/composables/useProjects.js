import { readonly, ref } from 'vue'

const projects = ref([])
const loading = ref(false)
const error = ref(false)
let request
let loaded = false

async function loadProjects() {
  if (loaded) return projects.value
  if (request) return request
  loading.value = true
  error.value = false

  request = fetch('/projects.json')
    .then((response) => {
      if (!response.ok) throw new Error('Projects request failed')
      return response.json()
    })
    .then((data) => {
      if (!Array.isArray(data) || data.some((project) => !project?.slug || !project?.title)) {
        throw new Error('Invalid project data')
      }
      projects.value = data
      loaded = true
      return data
    })
    .catch(() => {
      error.value = true
      return []
    })
    .finally(() => {
      loading.value = false
      request = undefined
    })
  return request
}

export function useProjects() {
  return { projects: readonly(projects), loading: readonly(loading), error: readonly(error), loadProjects }
}
