# 数据流水线：manifest 生成

图片不进 Git 仓库。本地整理截图 → 上传到 COS → 运行脚本生成 `public/manifest.json` → 前端通过 URL 拉取原图。

---

## 1. 目录约定

### 布局 A：`category-first`（推荐）

与分类展柜一致，本地与 COS 保持相同层级：

```text
Screenshots/
├── RPG/
│   ├── 塞尔达传说/
│   │   ├── meta.json          # 可选，覆盖分类等元数据
│   │   ├── 001.jpg
│   │   └── 002.jpg
│   └── 艾尔登法环/
│       └── boss.jpg
└── FPS/
    └── 使命召唤/
        └── 001.png
```

### 布局 B：`game-first`

```text
Screenshots/
├── 塞尔达传说/
│   ├── meta.json              # 建议写 category
│   └── 001.jpg
└── 超级马里奥兄弟/
    └── world1.png
```

`game-first` 下若未在 `meta.json` 或配置里指定分类，使用 `defaultCategory`（默认「未分类」）。

### 可选 `meta.json`

放在每个游戏文件夹内：

```json
{
  "category": "RPG",
  "cover": "boss-fight.jpg"
}
```

| 字段 | 说明 |
|------|------|
| `category` | 覆盖该游戏分类 |
| `cover` | **封面文件名**（必须是同目录下已有图片） |

### 封面选取优先级

1. `meta.json` 的 `cover` 字段  
2. 配置 `coverFileNames` 约定名（默认 `cover.jpg` / `cover.png` 等）  
3. 该游戏目录内文件名排序后的第一张  

命中后，manifest 对应条目会带 `"isCover": true`，盒墙用其 URL 作封面。

示例目录：

```text
Screenshots/RPG/塞尔达传说/
├── meta.json          # { "cover": "temple.jpg" } 可选
├── cover.jpg          # 或直接放约定封面名
├── temple.jpg
└── 002.jpg
```

---

## 2. COS 路径与 URL

脚本按以下规则拼接公网 URL：

```text
{cosBaseUrl}/{cosPathPrefix}/{相对路径}/{文件名}
```

示例：

| 配置 | 值 |
|------|-----|
| `cosBaseUrl` | `https://my-bucket.cos.ap-shanghai.myqcloud.com` |
| `cosPathPrefix` | `Screenshots` |
| 本地文件 | `Screenshots/RPG/塞尔达传说/001.jpg` |

生成 URL：

```text
https://my-bucket.cos.ap-shanghai.myqcloud.com/Screenshots/RPG/塞尔达传说/001.jpg
```

**上传 COS 时，对象 Key 必须与上述相对路径一致**（含中文路径）。

---

## 3. 配置

| 文件 | 说明 |
|------|------|
| `scripts/manifest.config.js` | 默认配置（占位，可提交） |
| `scripts/manifest.config.example.js` | 示例 |
| `scripts/manifest.config.local.js` | 本地真实配置（**勿提交**，已在 `.gitignore`） |

### 快速开始

```bash
cp scripts/manifest.config.example.js scripts/manifest.config.local.js
# 编辑 cosBaseUrl、cosPathPrefix、layout 等
```

### 主要字段

| 字段 | 说明 |
|------|------|
| `sourceDir` | 本地截图根目录。**支持相对路径**（相对项目根，如 `Screenshots`）或**绝对路径**（如 `E:/tea/yylapi/app/api/Screenshots`） |
| `cosBaseUrl` | COS/OSS 公网根 URL |
| `cosPathPrefix` | 桶内路径前缀 |
| `outputFile` | 输出文件，默认 `public/manifest.json` |
| `layout` | `category-first` \| `game-first` |
| `defaultCategory` | 默认分类名 |
| `gameCategories` | `{ "游戏名": "分类" }` 覆盖表 |
| `imageExtensions` | 识别的图片后缀 |
| `coverFileNames` | 约定封面文件名列表（如 `cover.jpg`）；也可用 `meta.json` 的 `cover` |

也可通过环境变量指定配置：

```bash
MANIFEST_CONFIG=./my-config.js npm run manifest
```

### `sourceDir` 路径写法

| 写法 | 示例 | 说明 |
|------|------|------|
| 相对路径 | `Screenshots` | 相对本项目根目录 |
| 绝对路径 | `E:/tea/yylapi/app/api/Screenshots` | 扫描项目外任意目录 |
| Windows 反斜杠 | `E:\\tea\\yylapi\\app\\api\\Screenshots` | JS 字符串需转义 `\` |

`sourceDir` 只决定**本地扫描位置**；COS 上的路径仍由 `cosPathPrefix` + 游戏目录结构决定，两者可以不一致。

```js
// manifest.config.local.js 示例
export default {
  sourceDir: 'E:/tea/yylapi/app/api/Screenshots',
  cosPathPrefix: 'Screenshots', // 上传到 COS 时仍用此前缀
}
```

---

## 4. 生成 manifest

```bash
# 写入 public/manifest.json
npm run manifest

# 仅预览 stdout，不写文件
node scripts/generate-manifest.js --dry-run

# 指定配置文件
node scripts/generate-manifest.js --config ./scripts/manifest.config.local.js
```

成功输出示例：

```text
[manifest] 配置: scripts/manifest.config.local.js
[manifest] 扫描: Screenshots (category-first)
[manifest] 游戏: 12 · 截图: 348
[manifest] 输出: public/manifest.json
```

---

## 5. manifest.json 结构

```json
{
  "version": 1,
  "generatedAt": "2026-08-24T07:00:00.000Z",
  "cosBaseUrl": "https://...",
  "cosPathPrefix": "Screenshots",
  "layout": "category-first",
  "itemCount": 348,
  "gameCount": 12,
  "items": [
    {
      "id": "a1b2c3d4e5f6g7h8",
      "gameId": "9f8e7d6c5b4a3210",
      "gameName": "塞尔达传说",
      "category": "RPG",
      "fileName": "001.jpg",
      "relativePath": "RPG/塞尔达传说/001.jpg",
      "url": "https://.../Screenshots/RPG/塞尔达传说/001.jpg",
      "isCover": true
    }
  ]
}
```

- `id` / `gameId`：基于路径的稳定哈希，重跑脚本不变（路径不变时）。  
- `isCover`：盒墙封面标记，由 `meta.cover` / `coverFileNames` / 默认首张决定。  
- TypeScript 类型见 `src/types/manifest.ts`。
---

## 6. 前端加载

开发/构建时 Vite 从 `public/manifest.json` 提供静态文件：

```ts
import { loadManifest } from '@/utils/loadManifest'

const manifest = await loadManifest()
```

新增截图后：**更新本地目录 → 上传 COS → 重跑 `npm run manifest` → 刷新页面**。

---

## 7. 注意事项

- **封面 / 截图比例与体积推荐**见根目录 [README.md · 图片规范](../README.md#图片规范封面--截图)（脚本本身不强制校验分辨率与文件大小）。  
- `Screenshots/` 整目录已在 `.gitignore`，请勿提交原图。  
- `cosBaseUrl` 仍为占位时会打印警告。  
- COS 需配置 CORS（若跨域）与公有读或 CDN 域名。  
- 中文路径 URL 已做编码；部分客户端需确认 COS 控制台路径与本地一致。

---

## 8. 推荐工作流

1. 本地按布局整理 `Screenshots/`  
2. 同步上传到 COS（保持 Key 一致）  
3. `npm run manifest`  
4. `npm run dev` 验证盒墙与链接可访问  
5. `npm run build` 部署 `dist/`（含 manifest，不含大图）
