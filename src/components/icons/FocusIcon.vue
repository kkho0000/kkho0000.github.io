<script setup>
defineProps({ kind: { type: Number, required: true } })
</script>

<template>
  <svg class="focus-icon" viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
    <g v-if="kind === 0">
      <ellipse cx="20" cy="20" rx="16" ry="7.5" transform="rotate(-32 20 20)" />
      <ellipse cx="20" cy="20" rx="7.5" ry="16" transform="rotate(-32 20 20)" />
      <circle cx="20" cy="20" r="2.8" />
      <circle cx="33.5" cy="12" r="2.2" fill="var(--paper)" />
    </g>
    <g v-else-if="kind === 1">
      <path d="M7 6v27h27M6 25c7 0 8-15 15-15s6 14 14 14" />
      <path d="M14 33v-2m9 2v-2m9 2v-2" />
      <circle cx="21" cy="10" r="2.5" fill="var(--paper)" />
      <circle cx="12" cy="22" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="30" cy="21" r="1.3" fill="currentColor" stroke="none" />
    </g>
    <g v-else>
      <path d="m20 5 6 6-6 6-6-6 6-6ZM20 17v6m-11 5v-5h22v5" />
      <rect x="4" y="28" width="10" height="8" rx="1" />
      <circle cx="31" cy="32" r="5" />
      <path d="M7 32h4m-2-2v4" />
    </g>
  </svg>
</template>

<style scoped>
.focus-icon { display: block; width: 40px; height: 40px; color: var(--accent); }
</style>
