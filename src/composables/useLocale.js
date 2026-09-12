import { computed, readonly, ref } from 'vue'
import { messages } from '../content/site'

const storageKey = 'junde-locale'
function initialLocale() {
  try {
    const saved = localStorage.getItem(storageKey)
    return Object.hasOwn(messages, saved) ? saved : 'zh-CN'
  } catch {
    return 'zh-CN'
  }
}
const locale = ref(initialLocale())
const copy = computed(() => messages[locale.value])

function setLocale(value) {
  if (!Object.hasOwn(messages, value)) return
  locale.value = value
  try {
    localStorage.setItem(storageKey, value)
  } catch {
    // Language switching still works when browser storage is unavailable.
  }
}
function localize(value) {
  if (typeof value === 'string') return value
  return value?.[locale.value] || value?.['zh-CN'] || ''
}
export function useLocale() {
  return { locale: readonly(locale), copy, setLocale, localize }
}
