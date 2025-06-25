<template>
  <section class="introduction-section">
    <div class="top-half">
      <div class="introduction-card" :style="{ opacity: cardOpacity }">
        <h1>李君德</h1>
        <p>
          Hello! I'm Junde Li, a passionate developer with a love for creating
          innovative solutions. This homepage showcases my projects and experiences
          in the tech world. Feel free to explore and learn more about my work!
        </p>
      </div>
    </div>
    <div class="bottom-half">
      <div class="social-links">
        <a href="https://github.com/kkho0000" target="_blank" aria-label="GitHub">
          <img src="/icons/github.svg" alt="GitHub" />
        </a>
        <!-- <a href="https://twitter.com/yourname" target="_blank" aria-label="Twitter">
          <img src="/vite.svg" alt="Twitter" />
        </a> -->
        <a href="mailto:junde2002@163.com" aria-label="Email">
          <img src="/icons/email.svg" alt="Email" />
        </a>
        <!-- 可继续添加更多社交链接 -->
      </div>
    </div>
    <div class="background-image" :style="{ filter: `blur(${bgBlur}px)` }"></div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const cardOpacity = ref(1)
const bgBlur = ref(8) // 初始虚化程度

const handleScroll = () => {
  const scrollY = window.scrollY
  // 0~200px内，卡片淡出，背景逐渐清晰
  cardOpacity.value = Math.max(0, 1 - scrollY / 200)
  bgBlur.value = Math.max(0, 8 - (scrollY / 200) * 8)
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.introduction-section {
  position: relative;
  min-height: 100%; /* 两页高度 */
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.top-half, .bottom-half {
  height: 80vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.introduction-card {
  max-width: 800px;
  padding: 32px 24px;
  background: linear-gradient(135deg, #f9f9f9, #b3b3b3);
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  text-align: center;
  transition: opacity 0.3s;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 32px;
  z-index: 2;
}

.social-links img {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  opacity: 0.7;
  transition: opacity 0.2s, transform 0.2s;
  cursor: pointer;
  box-shadow:
    0 0 0 4px rgba(180, 210, 255, 0.06);
}
.social-links img:hover {
  opacity: 1;
  transform: scale(1.12);
}

.background-image {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 0;
  background: url('/img/profile.JPG') center center/cover no-repeat;
  transition: filter 0.3s;
  will-change: filter;
}
</style>