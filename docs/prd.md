# Product Requirements Document (PRD): GameShot Museum (游戏截图博物馆 - COS版)

## 1. 项目概述 (Project Overview)

本项目是一个纯前端静态部署的个人游戏截图线上博物馆。旨在通过极简、高性能的 2D 画廊，展示存放在云端对象存储（如腾讯云COS/阿里云OSS）中的 2000-3000 张游戏截图。项目追求极致的加载性能、优雅的 UI 交互以及纯本地的个性化浏览体验。无用户登录系统，无 3D 渲染，强调“私人数字档案”的纯粹感。

## 2. 技术栈约束 (Tech Stack Constraints)

- **框架**: React 18 (Functional Components + Hooks)
- **构建工具**: Vite
- **语言**: TypeScript (Strict mode)
- **状态管理**: Zustand (结合 persist 中间件，数据存入 localStorage)
- **样式**: TailwindCSS (结合 `clsx` 和 `tailwind-merge` 处理动态类名)
- **性能优化**: `@tanstack/react-virtual` (虚拟列表), `react-intersection-observer` (懒加载)
- **路由**: React Router v6 (用于不同游戏分类的 URL 路由)

## 3. 数据与资产流水线 (Data Pipeline - 核心)

由于图片数量庞大（3000+）且存放在云端 COS，严禁将图片打包进代码仓库。

- **开发一个本地 Node.js 脚本 (`scripts/generate-manifest.js`)**:
  1. 扫描指定的本地目录（结构：`Screenshots/[游戏名称]/screenshot.jpg`）。
  2. 提取元数据：游戏分类、游戏名称、文件名。
  3. 根据配置的 COS 域名（如 `https://my-bucket.cos.ap-shanghai.myqcloud.com`），动态拼接出每张图片的**完整公网 URL**。
  4. 生成一份 `public/manifest.json`。该文件包含所有图片的元数据和 COS URL。
- **部署**: `manifest.json` 随 Vite 项目一起打包部署（极小）。图片原图保留在 COS 中，前端通过 URL 直接拉取。

## 4. 核心功能模块 (Core Features)

### 4.1 高性能 2D 画廊 (High-Performance 2D Gallery)

- **虚拟列表渲染**: 必须使用 `@tanstack/react-virtual`。无论有多少张截图，DOM 中只保留可视区域内的图片节点，确保 3000 条数据滚动时 60fps 流畅运行。
- **渐进式图片加载 (Progressive Loading)**:
  1. 初始状态：显示带有 Skeleton（骨架屏）或灰色背景的占位块，保持正确的宽高比（Aspect Ratio）。
  2. 可视区域检测：使用 `react-intersection-observer` 判断图片是否进入屏幕。
  3. 懒加载：进入屏幕后才开始请求 COS 图片 URL。
  4. 淡入效果：图片加载完成后，使用 CSS `opacity` 和 `transition` 实现平滑淡入。

### 4.2 导航与分类系统 (Navigation & Categories)

- **左侧边栏 (Sidebar)**:
  - 树状结构展示游戏分类（如：RPG、FPS、独立游戏）。
  - 点击分类，右侧画廊平滑滚动到顶部，并过滤出该分类下的截图。
  - 显示每个分类下的截图数量统计。
- **顶部搜索栏 (Search Bar)**:
  - 支持按“游戏名称”进行实时模糊搜索（防抖处理）。

### 4.3 纯本地个性化 (Local Personalization)

所有设置通过 Zustand 持久化到 `localStorage`，无需后端：

- **画廊密度 (Grid Density)**: 用户可切换网格布局（如：紧凑/2列，标准/3列，宽松/4列，大图/单列）。
- **外观主题 (Theme)**: 支持 Light/Dark 模式切换（使用 `tailwindcss` 的 `dark:` 类）。
- **私人收藏夹 (Collections)**:
  - 用户可以在图片 Hover 时点击“星标”将其加入收藏。
  - 收藏夹数据（仅存储图片的 ID/URL）保存在本地。
  - 提供一个“我的收藏”专属视图。

### 4.4 沉浸式图片查看器 (Lightbox)

- 点击画廊中的图片，弹出全屏 Lightbox 模态框。
- **交互**:
  - 支持键盘 `←` `→` 切换上一张/下一张。
  - 支持 `Esc` 关闭。
  - 支持鼠标滚轮或双指缩放图片（可使用 `react-zoom-pan-pinch` 或类似轻量库）。
- **信息面板**: 在 Lightbox 侧边或底部显示该图片的元数据（游戏名称、所属分类、原始文件名）。

## 5. 架构与文件结构建议 (Architecture)

```text
src/
├── components/
│   ├── gallery/       # Grid 容器, VirtualList 封装, ImageCard (包含懒加载逻辑)
│   ├── lightbox/      # 图片查看器及缩放控制
│   ├── sidebar/       # 分类树形菜单
│   └── ui/            # 按钮, 骨架屏, 搜索框
├── store/             # Zustand stores (useGalleryStore, usePreferencesStore)
├── hooks/             # 自定义 hooks (useImageLazyLoad, useDebounce)
├── types/             # 定义 manifest.json 的 TypeScript Interfaces
├── utils/             # 数据过滤、排序、分类聚合逻辑
└── App.tsx
```
