import { nextTick } from 'vue'

let pendingScroll
let projectListPosition

export function rememberProjectListPosition(to, from) {
  if (from.name === 'projects' && to.path !== from.path) {
    projectListPosition = { left: window.scrollX, top: window.scrollY }
  }
}

// Async pages reserve image dimensions, then mark their text and anchors ready.
// Cancel an old wait if the visitor navigates elsewhere before loading finishes.
export function waitForPageReady(root, signal) {
  return new Promise((resolve) => {
    const finish = () => {
      observer.disconnect()
      signal.removeEventListener('abort', finish)
      resolve()
    }
    const check = () => {
      if (!root?.querySelector('[data-page-ready="false"]') || signal.aborted) finish()
    }
    const observer = new MutationObserver(check)
    if (root) observer.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-page-ready'] })
    signal.addEventListener('abort', finish, { once: true })
    check()
  })
}

export async function scrollBehavior(to, from, savedPosition) {
  pendingScroll?.abort()
  const controller = new AbortController()
  pendingScroll = controller
  const position = savedPosition || (to.name === 'projects' && from.name === 'project-detail' ? projectListPosition : null)
  await nextTick()
  if (position || to.hash) {
    await waitForPageReady(document.getElementById('main-content'), controller.signal)
  }
  if (controller.signal.aborted) return false
  if (position) return position
  if (to.hash) {
    let id = to.hash.slice(1)
    try { id = decodeURIComponent(id) } catch { /* Invalid escapes cannot identify an anchor. */ }
    const target = document.getElementById(id)
    if (target) {
      target.focus({ preventScroll: true })
      return {
        el: target,
        top: parseFloat(getComputedStyle(target).scrollMarginTop) || 0,
        behavior: to.path === from.path && !matchMedia('(prefers-reduced-motion: reduce)').matches ? 'smooth' : 'auto',
      }
    }
  }
  return { top: 0 }
}
