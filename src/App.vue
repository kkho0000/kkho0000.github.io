<script setup>
import { watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import SiteHeader from './components/layout/SiteHeader.vue'
import { useLocale } from './composables/useLocale'
import { contact } from './content/site'

const route = useRoute()
const { locale, copy } = useLocale()
watchEffect(() => {
  const title = route.name === 'home'
    ? `${copy.value.name} · ${copy.value.alternateName}`
    : `${route.name === 'projects' ? copy.value.projects : copy.value.projectNote} · ${copy.value.name}`
  document.documentElement.lang = locale.value
  document.title = title
  for (const selector of ['meta[name="description"]', 'meta[property="og:description"]', 'meta[name="twitter:description"]']) {
    document.querySelector(selector)?.setAttribute('content', copy.value.metaDescription)
  }
  for (const selector of ['meta[property="og:title"]', 'meta[name="twitter:title"]']) {
    document.querySelector(selector)?.setAttribute('content', title)
  }
  document.querySelector('meta[property="og:locale"]')?.setAttribute('content', locale.value === 'en' ? 'en_US' : 'zh_CN')
})
</script>

<template>
  <a class="skip-link" href="#main-content">{{ copy.skip }}</a>
  <SiteHeader />
  <main id="main-content" tabindex="-1">
    <router-view />
  </main>
  <footer class="site-footer page-width">
    <span>© {{ new Date().getFullYear() }} Junde Li</span>
    <div class="footer-links">
      <a :href="`mailto:${contact.email}`">{{ copy.contact }}</a>
      <a :href="contact.github" target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>
    </div>
  </footer>
</template>
