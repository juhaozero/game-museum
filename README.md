# GameShot Museum

游戏截图小馆：本地整理截图 → 上传 COS → 生成清单 → 纯前端货架浏览。  
无登录、无后端；主题 / 语言 / 星标只存在本机 `localStorage`。

| 文档                                   | 说明                                                                      |
| -------------------------------------- | ------------------------------------------------------------------------- |
| [docs/ui.md](./docs/ui.md)             | UI 设计稿（v2.0，对齐 [Generated_image.png](./docs/Generated_image.png)） |
| [docs/manifest.md](./docs/manifest.md) | manifest 生成与 COS 流水线（完整说明）                                    |
| [docs/dev.md](./docs/dev.md)           | 开发阶段清单                                                              |
| [docs/prd.md](./docs/prd.md)           | 产品需求（历史规格，部分已演进）                                          |

---

## 功能一览

- **货架**：竖版封面墙（约 2:3）+ 货架柔光；点封面进入该游戏截图展墙
- **截图展墙**：约 16:9 裁切网格；星标；Lightbox（键盘切换 / 滚轮缩放）
- **搜索 / 分类筛选 / 随机封面**
- **中英切换 · 明暗主题 · 星标收藏**（本地持久化）

---

## 快速开始

```bash
# 依赖（pnpm / npm / yarn 均可）
pnpm install

# 可选：子路径、UI 开关
cp .env.example .env

# 配置截图源与 COS 域名
cp scripts/manifest.config.example.js scripts/manifest.config.local.js
# 编辑 cosBaseUrl、sourceDir、layout 等

# 整理本地截图后生成清单
pnpm run manifest

# 开发
pnpm run dev
```

| 命令                | 作用                              |
| ------------------- | --------------------------------- |
| `pnpm run dev`      | 本地开发                          |
| `pnpm run build`    | 生产构建                          |
| `pnpm run preview`  | 预览构建产物                      |
| `pnpm run manifest` | 扫描截图 → `public/manifest.json` |
| `pnpm test`         | 单元测试                          |
| `pnpm run lint`     | oxlint                            |

默认开发地址多为 `http://localhost:5173`；若设置了 `PUBLIC_ROUTE_SUFFIX=/museum`，则为 `http://localhost:5173/museum`。

---

## 图片规范（封面 & 截图）

脚本**不会**在生成时校验分辨率或文件体积；下列为与当前 UI 匹配的**推荐规范**。过大的原图会拖慢首屏与 Lightbox，建议上传 COS 前自行压缩。

### 支持格式

由 `imageExtensions` 决定（默认）：

`.jpg` · `.jpeg` · `.png` · `.webp` · `.gif` · `.avif`

推荐优先 **WebP / JPEG**；PNG 适合透明或像素风，体积往往更大。

### 封面（货架 Level 1）

前端以 **`aspect-[2/3]`（竖版约 2:3）** 展示并圆角裁切。

| 项         | 推荐                                               | 说明                                   |
| ---------- | -------------------------------------------------- | -------------------------------------- |
| 比例       | **2:3**（如 600×900、800×1200）                    | 横图会被居中裁切，上下或左右可能被切掉 |
| 短边       | ≥ **600px**                                        | 再小货架上易糊                         |
| 长边       | ≤ **1600px** 一般足够                              | 货架缩略展示，不必用 4K                |
| 单文件体积 | **≤ 300–500 KB**（理想 ≤ 200 KB）                  | 一屏多封面并行加载                     |
| 命名       | `cover.jpg` / `cover.webp` 等，或 `meta.json` 指定 | 见下方「封面如何选定」                 |

**不适合当封面**：超宽截图、带大量 UI 边框的截图（裁切后主体可能偏掉）。更稳妥：单独导出一张竖版海报，或把最能代表该作的截图做成 2:3 再命名为 `cover.webp`。

### 截图（展墙 Level 2 / Lightbox）

展墙卡片按 **`aspect-video`（16:9）** 裁切；Lightbox 内按原图等比完整查看。

| 项         | 推荐                                  | 说明                             |
| ---------- | ------------------------------------- | -------------------------------- |
| 比例       | **16:9** 最贴展墙；其它比例也能用     | 非 16:9 会在网格里被裁切         |
| 分辨率     | **1280×720～2560×1440**               | 常用区间；更高对货架帮助有限     |
| 长边       | 建议 ≤ **2560px**                     | 再大主要增加流量与解码时间       |
| 单文件体积 | **≤ 800 KB～1.5 MB**（理想 ≤ 500 KB） | Lightbox 会加载原图 URL          |
| 单游戏数量 | 视体验而定；大量时建议压缩更狠        | 未来会接虚拟列表，目前全量进网格 |

### 体积速查（经验值）

| 用途 | 理想     | 可接受上限 | 不建议          |
| ---- | -------- | ---------- | --------------- |
| 封面 | ≤ 200 KB | ≤ 500 KB   | \> 1 MB         |
| 截图 | ≤ 500 KB | ≤ 1.5 MB   | \> 3 MB（单张） |

压缩可用：Squoosh、ImageOptim、`cwebp`、Photoshop「导出为 Web」等。COS 若支持图片处理参数，也可后续加缩略图策略（当前前端拉的是清单里的原图 URL）。

### 封面如何选定

优先级（高 → 低）：

1. 游戏目录 `meta.json` 的 `"cover": "文件名.jpg"`（必须是同目录已有文件）
2. 配置 `coverFileNames` 约定名（默认含 `cover.jpg` / `cover.png` / `cover.webp` 等）
3. 该目录内**文件名排序后的第一张**

前端货架还会：**若该游戏有星标截图，优先用星标图当封面**。

```json
// Screenshots/…/某游戏/meta.json
{
  "category": { "zh": "RPG", "en": "RPG" },
  "cover": "poster.webp",
  "name": { "zh": "某游戏", "en": "Some Game" }
}
```

---

## 目录与 manifest

**游戏名默认 = 文件夹名**（检索始终能搜到文件夹名）。展示译名写在 `meta.json` 的 `name` 里：

```json
{ "name": { "zh": "塞尔达传说", "en": "The Legend of Zelda" } }
```

改文件夹名或 `name` 后需重跑 `pnpm run manifest`。

| `layout`             | 结构                            | 游戏身份（文件夹） |
| -------------------- | ------------------------------- | ------------------ |
| `game-first`（常见） | `Screenshots/游戏名/*.jpg`      | 一级文件夹名       |
| `category-first`     | `Screenshots/分类/游戏名/*.jpg` | 分类下的子文件夹名 |

分类解析顺序：`meta.json` → `gameCategories` 映射 →（category-first）父文件夹名 → `defaultCategory`。

```text
Screenshots/
└── 塞尔达传说/
    ├── meta.json       # 可选 { "category": "RPG", "cover": "cover.webp" }
    ├── cover.webp      # 推荐单独封面
    ├── 001.jpg
    └── 002.jpg
```

更完整的 COS Key、配置字段、manifest JSON 结构见 **[docs/manifest.md](./docs/manifest.md)**。

工作流：

1. 本地按布局整理并压缩图片
2. 上传 COS（对象 Key 与相对路径一致）
3. `pnpm run manifest`
4. `pnpm run dev` 验证封面与链接

**不要把 `Screenshots/` 原图提交进 Git**（已在 `.gitignore`）。

---

## 环境变量（`.env`）

复制 `.env.example` 为 `.env` 后按需修改（改完需重启 dev / 重新 build）：

| 变量                               | 默认                    | 说明                           |
| ---------------------------------- | ----------------------- | ------------------------------ |
| `PUBLIC_SITE_URL`                  | `http://localhost:5173` | 站点 Origin（canonical / OG；生产改真实域名） |
| `PUBLIC_ROUTE_SUFFIX`              | 空                      | 子路径，如 `/museum`（会拼进 canonical） |
| `PUBLIC_SHOW_IMAGE_FILENAME`       | `false`                 | 悬停 / Lightbox 是否显示文件名 |
| `PUBLIC_SHOW_SCREENSHOT_GAME_NAME` | `true`                  | 收藏等多游戏列表是否显示游戏名 |
| `PUBLIC_ENABLE_LIGHT_MODE`         | `false`                 | 是否开放浅色模式切换（关闭则强制深色） |

---

## 技术栈

React 18 · TypeScript · Vite · Tailwind CSS v4 · React Router v6 · Zustand · Motion · react-zoom-pan-pinch

本地偏好键：`gameshot-preferences`（主题 / 语言）、`gameshot-gallery`（星标 ID）。

---

## 构建与部署

```bash
pnpm run build
pnpm run preview
```

部署 `dist/` 即可；**大图始终在 COS**。注意：

- COS 公有读或 CDN；跨域时配置 CORS
- 中文路径需与清单 URL 一致
- 子路径部署时同步设置 `PUBLIC_ROUTE_SUFFIX` 与托管侧的 rewrite
