# 项目架构说明

## 分层

- `views/`：首页、项目列表、项目详情。
- `components/`：全局导航与可复用的项目列表项。
- `content/site.js`：联系方式、简体中文与英文界面文案。
- `composables/useLocale.js`：共享语言状态、语言选择持久化与字段本地化。
- `composables/useProjects.js`：项目列表请求、缓存和重试状态。
- `App.vue`：应用外壳、页脚，响应路由与语言变化更新页面标题、描述和 `html.lang`。

## 路由

| 路径 | 页面 |
| --- | --- |
| `/` | `HomeView` |
| `/projects` | `ProjectsView` |
| `/project/:slug` | `ProjectDetailView` |

项目页与详情页动态加载，路由切换回到顶部。未知路由回到首页；不存在的项目 slug 在详情页显示相应提示。

GitHub Pages 发布保留 History 路由。生产构建后，`scripts/prepare-pages.mjs` 根据项目数据生成 `/projects/index.html` 和 `/project/<slug>/index.html`，直接访问已知页面可返回 HTTP 200。`404.html` 用于启动未知路径的应用处理；此类请求仍返回 HTTP 404。部署目录包含 `.nojekyll`。

## 双语内容

`public/projects.json` 中的 `title` 和 `description` 使用 `zh-CN`、`en` 两个键。`category` 对应 `site.js` 中的分类标签。`content` 按语言保存 Markdown 路径；没有详情的项目省略此字段。缺少预览时将 `image` 设为 `null`。

语言默认为 `zh-CN`，用户选择保存在 `localStorage` 的 `junde-locale`。浏览器禁止存储时，本次会话中的语言切换仍可使用。

Markdown 文件由仓库维护，作为可信内容渲染；若将来接入用户提交内容，需要增加 HTML 清理。

## 图片与视频

`npm run images` 从项目列表与 Markdown 的独立图片段落收集原图，通过 sharp 生成响应式 WebP / JPEG 及 `src/media/images.json`。`npm run check:media` 验证引用、尺寸与全黑输出。

`ResponsiveImage` 统一处理尺寸占位、原生懒加载、异步解码、优化图失败后回退原图，以及详情中的重试。`MarkdownContent` 将独立图片段落渲染为 Vue 图片组件，其余可信 Markdown 保持常规渲染。低分辨率图片限制展示宽度，并提供原图入口。

`ProjectVideo` 对本地视频使用原生控件与 `preload="none"`，支持键盘、全屏与移动端内联播放。视频元数据由项目字段提供，不为显示时长预下载文件。YouTube 视频先展示本地响应式封面，点击后加载内嵌播放器，并保留原始观看链接。

## 请求与状态

项目列表首次请求后在内存中缓存，包括空数组；并发请求共享同一 Promise。失败状态提供重试按钮，错误文案由当前语言提供。

详情根据 slug 与语言读取对应 Markdown。路由或语言变化时取消旧请求，提交结果前确认请求仍有效，避免快速切换导致旧内容覆盖新内容。区分请求失败、暂无记录、项目不存在；同时识别开发服务器对缺失文件返回的 HTML 页面。
