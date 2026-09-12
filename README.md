# Junde Li — Personal Website

李君德的中英文个人主页，关注元宇宙、AI 与虚拟现实，数学与医疗数据分析，以及游戏开发与策划。基于 Vue 3、Vue Router 与 Vite，采用简约排版。

## 本地开发

需要 Node.js 20.19+ 或 22.12+。

```bash
npm ci
npm run dev
```

生产构建与预览：

```bash
npm run build
npm run preview
```

## 内容维护

- 联系方式、首页及界面中英文文案：`src/content/site.js`
- 语言切换与持久化：`src/composables/useLocale.js`
- 项目名称、简介及详情路径：`public/projects.json`
- 项目职责与封面取景：`public/projects.json` 的可选 `contribution`（双语）与 `imageFocus`（缩放 `scale`、纵向偏移 `y`）
- 中文详情：`public/md/<slug>.md`
- 英文详情：`public/md/en/<slug>.md`
- 项目图片：`public/img/project/<slug>/`
- 全局布局与颜色：`src/style.css`

默认显示简体中文，可通过页头的「中 / EN」切换；刷新与页面跳转保留语言选择。

添加项目时，在 `projects.json` 提供两种语言的 `title`、`description`，以及 `slug`、`category`。有详情时，在 `content` 中填写 `zh-CN` 和 `en` 的 Markdown 路径；暂无详情时省略。图片缺失时设为 `null`。三个项目均提供双语详情。乌镇项目包含 YouTube 视频，飞船竞速包含本地演示视频。

医学数据分析当前作为关注方向呈现，尚未添加具体项目记录。

设计和架构说明见 [`docs/DESIGN.md`](docs/DESIGN.md) 与 [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)。

## 图片与视频

原图保存在 `public/img/`。更新原图、封面路径或 Markdown 图片后执行：

```bash
npm run images
npm run check:media
```

图片脚本使用开发依赖 sharp，按内容实际引用生成 400 / 800 / 1200 / 1600px 的 WebP 与 JPEG（不放大原图），并更新 `src/media/images.json`。生成文件随站点发布，运行时不需要图片服务。`ResponsiveImage` 按屏幕宽度选择尺寸，预留空间并处理原图回退与重试。详情首图优先加载，后续独立图片按需加载，可打开原图。

三个及以上 `##` 标题的详情自动生成目录，章节锚点为 `#section-1`、`#section-2` 等；双语保持相同章节顺序即可复用锚点。正文结束后可继续浏览下一项目。

导航和 Markdown 行为检查：`npm test`；完整检查（含媒体资源）：`npm run check`。

飞船竞速视频位于 `public/video/vr-spaceship-racing.mp4`，来自提供的项目演示；封面取自其中的游戏画面。项目的 `video` 字段配置视频地址、封面、时长与尺寸，播放器使用 `preload="none"`，点击后播放。

YouTube 视频在 `video` 中填写 `provider: "youtube"`、视频 `id` 和本地 `poster` 路径。页面先显示本地封面，点击后加载内嵌播放器，并始终保留 YouTube 原始页面链接。

## 部署

站点地址：<https://kkho0000.github.io/>。源码维护在 `dev` 分支，构建产物发布到 `gh-pages` 分支。

首次配置时，在仓库 **Settings → Pages** 选择 **Deploy from a branch**，分支设为 `gh-pages`，目录设为 `/ (root)`。本地需要具备仓库的 Git 推送权限。

整理并提交源码后执行：

```bash
git push origin dev
npm run deploy
```

`npm run deploy` 自动运行行为测试、媒体检查和全新生产构建，任一步失败都会停止发布，避免上传旧产物。发布提交保留 `gh-pages` 分支历史；无需手动提交 `dist/`。

构建后的 `scripts/prepare-pages.mjs` 为项目列表和 `projects.json` 中每个项目生成目录形式的 `index.html`，使直接访问、刷新和章节链接可在 GitHub Pages 正常打开。新增项目会自动加入发布入口。`404.html` 加载应用的未知路由处理，但保留 HTTP 404；`.nojekyll` 禁用 Jekyll 处理。

发布后检查首页、`/projects/` 和各个 `/project/<slug>/` 页面，以及中英文切换和视频资源。GitHub Pages 更新通常需要几分钟。

当前配置面向域名根路径；子路径部署需同时调整 Vite base、路由基路径和公共资源路径。版本改动见 [`CHANGELOG.md`](CHANGELOG.md)。
