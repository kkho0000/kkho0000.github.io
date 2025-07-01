<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { marked } from 'marked'

const route = useRoute()
const markdown = ref('')
const html = ref('')

onMounted(async () => {
  // 假设你的 md 文件放在 public/md/ 目录下
  const mdPath = `/md/${route.params.slug}.md`
  try {
    const res = await fetch(mdPath)
    if (!res.ok) throw new Error('未找到详情文件')
    markdown.value = await res.text()
    html.value = marked.parse(markdown.value)
  } catch (e) {
    html.value = '<p style="color:red;">未找到该项目的详情内容。</p>'
  }
})
</script>

<template>
  <section class="project-experience">
    <div class="background-image"></div>
    <div class="projects">
      <div class="project detail-card">
        <router-link to="/projects" class="back-link">← 返回项目列表</router-link>
        <div v-html="html" class="markdown-body"></div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.project-experience {
  max-width: 90vw;
  padding-top: 20px;
  overflow-x: hidden;
  position: relative;
}

.background-image {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: -1;
  background: linear-gradient(135deg, #272727, #4a4a4a, #6d6d6d, #909090, #b3b3b3, #d6d6d6, #f9f9f9);
  background-size: 400% 400%;
  animation: gradientMove 15s ease infinite;
  filter: blur(12px) brightness(0.8);
  opacity: 1;
  pointer-events: none;
}

@keyframes gradientMove {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.projects {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  gap: 24px;
}

.project.detail-card {
  width: 100%;
  max-width: 900px;
  margin: 15px auto;
  padding: 30px;
  border: 1px solid #9d9d9d;
  border-radius: 16px;
  background: linear-gradient(135deg, #f9f9f9, #b3b3b3);
  box-sizing: border-box;
}

.back-link {
  display: inline-block;
  margin-bottom: 24px;
  color: #427db9;
  text-decoration: none;
  font-size: 16px;
}

.markdown-body {
  line-height: 1.8;
  color: #222;
  text-align: left;
}

:deep(.markdown-body h1),
:deep(.markdown-body h2),
:deep(.markdown-body h3) {
  margin: 1.2em 0 0.6em 0;
  font-weight: bold;
  text-align: center;
}

:deep(.markdown-body img) {
  max-width: 100%;
  border-radius: 8px;
  margin: 16px auto;
  display: block;
}

@media (max-width: 600px) {
  .project-experience {
    margin-top: 8px;
    align-self: center;
    width: 100%;
  }
  .projects {
    width: 90vw;
    gap: 8px;
  }
  .project.detail-card {
    max-width: 100%;
    padding: 12px;
    margin: 8px 0;
  }
  .back-link {
    margin-bottom: 16px;
    font-size: 15px;
  }
  .markdown-body img {
    max-height: 180px;
  }
}
</style>