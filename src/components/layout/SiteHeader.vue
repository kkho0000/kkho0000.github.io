<script setup>
import { useLocale } from '../../composables/useLocale'
const { locale, copy, setLocale } = useLocale()
</script>

<template>
  <header class="site-header page-width">
    <router-link class="brand" to="/" :aria-label="copy.homeLabel">Junde Li<span aria-hidden="true">.</span></router-link>
    <div class="header-controls">
      <nav class="nav" :aria-label="copy.navigation">
        <router-link to="/" exact-active-class="is-active">{{ copy.about }}</router-link>
        <router-link to="/projects" active-class="is-active">{{ copy.projects }}</router-link>
      </nav>
      <div class="language-switch" role="group" :aria-label="copy.language">
        <button type="button" lang="zh-CN" aria-label="简体中文" :aria-pressed="locale === 'zh-CN'" @click="setLocale('zh-CN')">中</button>
        <span aria-hidden="true">/</span>
        <button type="button" lang="en" aria-label="English" :aria-pressed="locale === 'en'" @click="setLocale('en')">EN</button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 104px;
  border-bottom: 1px solid var(--line);
}
.brand { font-size: 1.2rem; font-weight: 600; letter-spacing: -0.04em; text-decoration: none; }
.brand span { color: var(--accent); }
.header-controls, .nav, .language-switch { display: flex; align-items: center; }
.header-controls { gap: 42px; }
.nav { gap: 28px; }
.nav a { padding: 12px 0; color: var(--ink-soft); font-size: 1rem; text-decoration: none; text-underline-offset: 7px; }
.nav a.is-active { color: var(--ink); text-decoration: underline; text-decoration-thickness: 1px; }
.nav a:hover { color: var(--ink); }
.language-switch { gap: 3px; color: var(--line-strong); }
.language-switch button { min-width: 32px; min-height: 44px; padding: 0 5px; border: 0; color: var(--ink-soft); background: transparent; font-size: 0.875rem; cursor: pointer; }
.language-switch button[aria-pressed='true'] { color: var(--ink); font-weight: 600; }
.language-switch button:hover { color: var(--ink); }
@media (max-width: 600px) {
  .site-header { min-height: 80px; }
  .header-controls { gap: 22px; }
  .nav { gap: 18px; }
}
@media (max-width: 380px) {
  .site-header { flex-wrap: wrap; gap: 4px; padding: 16px 0; }
  .brand { width: 100%; }
  .header-controls { width: 100%; justify-content: space-between; }
  .nav { gap: 24px; }
}
</style>
