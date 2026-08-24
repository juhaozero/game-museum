# GameShot Museum 开发流程

基于 [prd.md](./prd.md) 梳理的推荐开发顺序。原则：**先跑通数据与骨架，再做性能与交互，最后做个性化与打磨**。

---

## 阶段总览

| 阶段 | 目标 | 产出 |
|------|------|------|
| 0. 工程初始化 | 可运行的 Vite + React + TS 空壳 | 本地 `dev` / `build` 通过 |
| 1. 数据流水线 | 本地截图 → `manifest.json` | `scripts/generate-manifest.js` + 样例数据 |
| 2. 类型与状态 | 数据模型 + 基础 Store | `types/` + `store/` |
| 3. 布局与导航 | 侧边栏 + 路由 + 搜索 | 可按分类/关键词过滤列表 |
| 4. 高性能画廊 | 虚拟列表 + 懒加载 | 3000 条数据流畅滚动 |
| 5. Lightbox | 全屏查看与缩放 | 键盘/滚轮交互完整 |
| 6. 本地个性化 | 密度 / 主题 / 收藏 | Zustand persist 生效 |
| 7. 打磨与部署 | 体验与上线 | COS 域名配置 + 静态部署 |

建议每个阶段结束时做一次自测，再进入下一阶段。

---

## 阶段 0：工程初始化 ✅

**目标**：搭好技术栈约束内的空项目，目录按 PRD + 当前 UI 稿落位。

1. 使用 Vite 创建 React + TypeScript 项目，开启 Strict mode。
2. 安装并配置依赖：
   - 路由：`react-router-dom` v6
   - 状态：`zustand`（含 persist）
   - 样式：`tailwindcss` v4 + `@tailwindcss/vite` + `clsx` + `tailwind-merge`
   - 性能：`@tanstack/react-virtual`、`react-intersection-observer`
   - Lightbox 缩放（可后装）：`react-zoom-pan-pinch`
3. 目录骨架（已对齐 `docs/ui.md` 无侧栏展柜布局）：

```text
src/
├── components/
│   ├── gallery/       # GameBox 实体盒、后续 VirtualShelf
│   ├── layout/        # AppShell、TopBar、MotifBackdrop
│   ├── lightbox/
│   └── ui/
├── pages/             # ShelfPage / GameGalleryPage / FavoritesPage
├── store/             # usePreferencesStore / useGalleryStore
├── hooks/
├── types/
├── utils/
└── App.tsx
scripts/
└── generate-manifest.js   # 阶段 1 再写
public/
└── manifest.json          # 占位，阶段 1 生成
```

4. Tailwind `dark` 使用 `class` 策略；`src/index.css` 已写入 Console Slate 设计 token。
5. `npm run dev` / `npm run build` 已通过。

**完成标准**：空壳可启动，全宽顶栏 + 疏朗盒装展柜占位页可浏览。

---

## 阶段 1：数据与资产流水线（核心前置）✅

**目标**：不把图片打进仓库，前端只依赖 `manifest.json` + COS URL。

1. 本地目录：`Screenshots/{分类}/{游戏名}/*` 或 `Screenshots/{游戏名}/*`（见 `docs/manifest.md`）。
2. `scripts/generate-manifest.js` + 配置：
   - `scripts/manifest.config.js` — 默认占位
   - `scripts/manifest.config.example.js` — 示例
   - `scripts/manifest.config.local.js` — 本地真实配置（gitignore）
3. 运行 `npm run manifest` → 输出 `public/manifest.json`。
4. 前端 `loadManifest()` / `useManifest()` 启动时拉取清单；盒墙已接聚合数据。

**文档**：[`docs/manifest.md`](./manifest.md)

**完成标准**：改本地目录后重跑脚本，页面能读到最新 manifest；仓库内无大体积图片。

---

## 阶段 2：类型定义与基础状态 ✅

**目标**：用 TypeScript 锁住数据契约，用 Zustand 管理过滤与偏好。

1. `src/types/manifest.ts`：`ScreenshotItem`、`Manifest`、`GameSummary`、`CategorySummary`、`GalleryFilters`、`GalleryStats`。
2. Store：
   - `useGalleryStore`：搜索词、分类筛选、收藏 ID（收藏 persist）
   - `usePreferencesStore`：密度、主题（persist）
3. `src/utils/manifest.ts`：聚合、分类统计、模糊搜索、收藏筛选。
4. Hooks：
   - `useDebounce` — 搜索防抖 300ms
   - `useGalleryFilters` — manifest + store 派生结果
   - `useAppContext` — 壳层 Outlet 共享数据
5. 顶栏搜索已接入；盒墙 / 游戏详情 / 收藏页使用过滤结果。

**完成标准**：给定 manifest，搜索过滤正确；主题/密度/收藏刷新后仍在。

---

## 阶段 3：布局、路由与导航 ✅

**目标**：浏览 / 分类 / 搜索跑通，普通网格验证数据流（对齐 ui.md：**无侧栏**，顶栏 Chip）。

1. 全宽布局：顶栏 Search + 分类 Chip（多分类时显示）+ 主内容区。
2. React Router v6：
   - `/` — 全部馆藏
   - `/category/:categorySlug` — 分类筛选
   - `?q=` — 搜索词（可分享/刷新）
   - `/favorites`、`/game/:gameId`
3. 分类 Chip：显示数量，点击更新路由并滚回顶部。
4. 搜索：防抖 300ms，URL 双向同步（防输入竞态）。
5. `ScreenshotGrid` / `ScreenshotCard` 普通 `<img>` 网格。

**完成标准**：分类切换与搜索驱动列表；URL 可分享/刷新；返回馆藏保留筛选状态。

---

## 阶段 4：高性能 2D 画廊

**目标**：满足 2000–3000 张图下的滚动与加载性能。

1. 用 `@tanstack/react-virtual` 封装虚拟 Grid/List（`components/gallery/`）。
2. 网格列数读取 Preferences（紧凑 2 / 标准 3 / 宽松 4 / 大图 1），列数变化时重算虚拟项尺寸。
3. `ImageCard` 渐进式加载：
   - 骨架屏 / 灰色占位，保持正确宽高比
   - `react-intersection-observer` 进入视口后再请求 COS URL
   - 加载完成后 `opacity` + `transition` 淡入
4. 用接近真实规模的 manifest（或重复样例数据）做滚动压力测试，目标约 60fps。

**完成标准**：大数据量下滚动流畅；未进入视口的图片不发请求。

---

## 阶段 5：沉浸式 Lightbox

**目标**：从画廊点进全屏查看，交互完整。

1. 实现 Lightbox 模态：打开/关闭、当前索引、元数据面板（游戏名、分类、文件名）。
2. 键盘：`←` / `→` 切换，`Esc` 关闭。
3. 集成缩放平移（如 `react-zoom-pan-pinch`）：滚轮 / 双指缩放。
4. 与画廊联动：点击卡片打开；切换时保持在当前过滤结果集内。

**完成标准**：键盘与缩放可用；元数据展示正确。

---

## 阶段 6：纯本地个性化

**目标**：无后端的偏好与收藏体验闭环。

1. 画廊密度切换 UI，写入 `usePreferencesStore`。
2. Light/Dark 主题切换（`dark:` + `document.documentElement` class）。
3. Hover 星标收藏：只持久化图片 ID/URL；提供「我的收藏」视图（路由 + 过滤）。
4. 确认 `localStorage` 读写正常，无敏感数据上云。

**完成标准**：密度、主题、收藏刷新后仍在；收藏视图与 Lightbox 行为一致。

---

## 阶段 7：打磨与部署

**目标**：体验收尾并静态上线。

1. UI 细节：空状态、加载失败占位、焦点与可访问性（Lightbox 焦点陷阱等）。
2. 性能复查：manifest 体积、图片尺寸策略（若 COS 支持缩略图/处理参数可后续加，非首版必须）。
3. 环境配置：COS 公网域名、CORS（如需）、脚本配置与 README 说明。
4. `vite build` 产出静态资源；将 `dist` 部署到任意静态托管（Pages / OSS 静态网站等）。
5. 图片仍只存在于 COS；站点只部署前端 + `manifest.json`。

**完成标准**：生产构建可访问；分类/搜索/虚拟列表/Lightbox/偏好在生产环境正常。

---

## 推荐迭代节奏（简版 Checklist）

```text
[x] 0  Vite + React + TS + Tailwind + 目录骨架 + 展柜空壳
[x] 1  generate-manifest.js → public/manifest.json + docs/manifest.md
[x] 2  types + Zustand + 搜索过滤 utils/hooks
[x] 3  顶栏 Chip + Router + URL 搜索同步 + 截图网格
[ ] 4  Virtual list + IntersectionObserver + 淡入
[ ] 5  Lightbox（键盘 + 缩放 + 元数据）
[ ] 6  密度 / 主题 / 收藏 + persist（主题/密度/收藏 store 已就绪）
[ ] 7  打磨 + 静态部署 + COS 联调
```

---

## 开发注意点（来自 PRD 约束）

- **禁止**将截图原图提交进 Git；只提交脚本与生成的 `manifest.json`（或 CI 中生成）。
- **无登录、无后端、无 3D**；所有个性化仅 `localStorage`。
- 性能底线：虚拟列表必做；懒加载必做；先正确再炫技。
- 模块边界尽量清晰：`gallery` / `lightbox` / `sidebar` / `ui` 各管一块，过滤逻辑放 `utils`，状态放 `store`。

---

## 建议的日常工作流

1. 新增/整理本地截图 → 运行 `node scripts/generate-manifest.js`。
2. `npm run dev` 验证分类、搜索、滚动、Lightbox。
3. 改偏好/收藏后硬刷新，确认 persist。
4. 合并前 `npm run build`，用预览模式抽查生产包。
