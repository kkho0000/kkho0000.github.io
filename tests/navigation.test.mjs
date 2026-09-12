import assert from 'node:assert/strict'
import test from 'node:test'
import { nextTick } from 'vue'
import { rememberProjectListPosition, scrollBehavior } from '../src/router/scroll.js'

test('scroll restoration waits for async content, honors reduced motion, and cancels stale navigation', async (t) => {
  let loading = false
  let reducedMotion = false
  const observers = new Set()
  const root = { querySelector: () => loading ? {} : null }
  const target = { focus: t.mock.fn() }
  const stubGlobal = (name, value) => {
    const original = Object.getOwnPropertyDescriptor(globalThis, name)
    Object.defineProperty(globalThis, name, { configurable: true, writable: true, value })
    t.after(() => {
      if (original) Object.defineProperty(globalThis, name, original)
      else delete globalThis[name]
    })
  }
  stubGlobal('MutationObserver', class {
    constructor(callback) { this.callback = callback }
    observe() { observers.add(this) }
    disconnect() { observers.delete(this) }
  })
  stubGlobal('document', { getElementById: (id) => id === 'main-content' ? root : id === 'section-2' ? target : null })
  stubGlobal('getComputedStyle', () => ({ scrollMarginTop: '24px' }))
  stubGlobal('matchMedia', () => ({ matches: reducedMotion }))
  stubGlobal('window', { scrollX: 0, scrollY: 720 })
  const from = { name: 'projects', path: '/projects', hash: '' }
  const detail = { name: 'project-detail', path: '/project/wuzhen', hash: '#section-2' }
  const ready = () => { loading = false; for (const observer of [...observers]) observer.callback() }

  loading = true
  let completed = false
  const restoration = scrollBehavior(detail, from, { top: 960, left: 0 }).then((value) => { completed = true; return value })
  await nextTick()
  assert.equal(completed, false)
  ready()
  assert.deepEqual(await restoration, { top: 960, left: 0 })
  assert.equal(target.focus.mock.callCount(), 0, 'history position takes priority over a hash')

  assert.deepEqual(await scrollBehavior(detail, detail), { el: target, top: 24, behavior: 'smooth' })
  assert.deepEqual(target.focus.mock.calls.at(-1).arguments, [{ preventScroll: true }])
  reducedMotion = true
  assert.equal((await scrollBehavior(detail, detail)).behavior, 'auto')
  assert.deepEqual(await scrollBehavior({ ...detail, hash: '#missing' }, from), { top: 0 })

  loading = true
  const stale = scrollBehavior(detail, from, { top: 1200 })
  await nextTick()
  assert.ok(observers.size > 0)
  assert.deepEqual(await scrollBehavior({ name: 'home', path: '/', hash: '' }, detail), { top: 0 })
  assert.equal(await stale, false)
  assert.equal(observers.size, 0)

  ready()
  rememberProjectListPosition(detail, from)
  assert.deepEqual(await scrollBehavior(from, detail), { left: 0, top: 720 })
  assert.deepEqual(await scrollBehavior(from, detail, { top: 400, left: 0 }), { top: 400, left: 0 })
})
