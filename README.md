# GameShot Museum

- 设计：`docs/ui.md`
- 开发流程：`docs/dev.md`
- **数据流水线：`docs/manifest.md`**

## 开发

```bash
pnpm install
cp .env.example .env   # 可选：配置子路径
pnpm run dev
```

### 路由前缀（可选）

复制 `.env.example` 为 `.env`，设置 `PUBLIC_ROUTE_SUFFIX`：

```env
PUBLIC_ROUTE_SUFFIX=/museum
```

- 本地开发：`http://localhost:5173/museum`
- 打包后静态资源与路由均挂在该前缀下
- 根路径部署时留空即可

## 生成 manifest（阶段 1）

```bash
cp scripts/manifest.config.example.js scripts/manifest.config.local.js
# 编辑 COS 域名与目录布局

# 整理本地 Screenshots/ 后执行
pnpm run manifest
```

详见 [docs/manifest.md](./docs/manifest.md)。

### 游戏名与分类

**游戏名**由截图目录的**文件夹名称**决定，前端盒墙标题、详情页面包屑等均直接显示该名称。修改游戏名 = 重命名对应文件夹，然后重新执行 `pnpm run manifest`。

| 布局 `layout` | 目录结构 | 游戏名来源 |
|---------------|----------|------------|
| `game-first`（默认） | `Screenshots/游戏名/*.jpg` | 一级子文件夹名，如 `Screenshots/塞尔达传说/` → **塞尔达传说** |
| `category-first` | `Screenshots/分类/游戏名/*.jpg` | 分类下的子文件夹名，如 `Screenshots/RPG/塞尔达传说/` → **塞尔达传说** |

目前**不支持**在 `meta.json` 里单独配置显示标题；若文件夹用编号（如 `01`），界面上也会显示 `01`。

**分类**按以下优先级解析（见 `scripts/generate-manifest.js`）：

1. 游戏目录内 `meta.json` 的 `category` 字段（两种布局均可用）
2. `manifest.config.local.js` 里的 `gameCategories` 映射（如 `{ '塞尔达传说': 'RPG' }`）
3. `category-first`：上一级分类文件夹名（如 `RPG`）
4. 以上都没有时：使用 `defaultCategory`（默认 **未分类**）

`game-first` 示例：

```text
Screenshots/
└── 塞尔达传说/
    ├── meta.json      # { "category": "RPG" } 建议写上分类
    └── 001.jpg
```

`category-first` 示例：

```text
Screenshots/
└── RPG/
    └── 塞尔达传说/
        └── 001.jpg    # 分类自动为 RPG，也可在 meta.json 里覆盖
```

配置片段（`scripts/manifest.config.local.js`）：

```js
export default {
  layout: 'game-first',           // 或 'category-first'
  defaultCategory: '未分类',
  gameCategories: {
    '塞尔达传说': 'RPG',          // 按游戏名覆盖分类
  },
}
```

改完目录或配置后，需重新运行 `pnpm run manifest` 才会更新 `public/manifest.json`。

## 构建

```bash
pnpm run build
pnpm run preview
```
