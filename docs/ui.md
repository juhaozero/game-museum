# GameShot Museum — UI 设计稿（实现同步）

> **版本**：v2.0 · 对齐 `docs/Generated_image.png`（影院货架 / Horizon Shelf）  
> 气质：**深色影院展陈** · 浮层玻璃导航 · 左侧叙事 Hero · 柔光货架封面墙 · 明暗 / 语言记住上次。  
> 参考图：[`Generated_image.png`](./Generated_image.png)

---

## 1. 设计结论

私人游戏截图博物馆：左侧讲故事与数据，右侧是圆角封面货架；每张封面坐在 **teal 柔光灯带**上。点封面进截图展墙，再进 Lightbox。无外框封板，元素浮在深炭黑画布上。

**记忆锚点**：封面底部货架灯带 + 浮层玻璃胶囊顶栏。

---

## 2. 信息架构

```text
┌─ 浮层玻璃顶栏 ──────────────────────────────────────────┐
│  🏛 GAMESHOT MUSEUM   货架 · 星标    [⌕ 搜索]  EN  ☾   │
└─────────────────────────────────────────────────────────┘
┌──────────────┬──────────────────────────────────────────┐
│  Hero        │  封面货架墙（圆角 + 灯带）                  │
│  大标题      │  ▌▌ ▌▌ ▌▌ ▌▌                             │
│  简介        │  ▌▌ ▌▌ ▌▌ ▌▌                             │
│  统计        │                                          │
│  随机封面    │  ┌─ 浮层底栏：筛选 · 显示 N/总 ─────────┐ │
│              │  └────────────────────────────────────┘ │
└──────────────┴──────────────────────────────────────────┘
        │ 点击封面
        ▼
  Level 2 截图展墙 → Level 3 Lightbox
```

| 能力 | 落点 |
| --- | --- |
| 货架 / 星标 | 顶栏中央 Nav（Shelf / Stars） |
| 搜索 | 顶栏右侧胶囊 |
| 分类筛选 | 底部 Dock「筛选」弹出 |
| 主题 / 语言 | 顶栏圆形工具钮 |
| 随机封面 | Hero CTA → `/game/:id` |
| 密度切换 | 无（列数响应式） |

### 路由

| 路径 | 页面 |
| --- | --- |
| `/` · `/category/:slug` | 馆藏货架（Hero + 墙 + Dock） |
| `/favorites` | 我的收藏 |
| `/game/:gameId` | 截图展墙 |

---

## 3. 视觉系统

### 3.1 关键词

影院 · 货架柔光 · 玻璃浮层 · 圆角 · 疏朗  
**不是**：工业方角轨、外框展板、密铺无留白、暖黄画廊灯。

### 3.2 色彩（深色默认对齐参考图）

```css
.dark {
  --bg: #0c0e12;
  --bg-elevated: #141820;
  --surface: #1a2030;
  --text: #eef2f6;
  --text-muted: #8b97a8;
  --accent: #5ec8d8; /* 货架灯 / 激活 */
  --glass: rgba(20, 24, 32, 0.62);
  --glass-border: rgba(238, 242, 246, 0.1);
  --shelf-glow / --shelf-glow-soft; /* 封面灯带 */
}
```

浅色保留 Console Slate 可读版；深色为展陈主场景。

### 3.3 字体

- UI：`IBM Plex Sans`（Hero 大标题 semibold / tracking-tight）
- 计数 / 状态：`IBM Plex Mono`
- 导航：小号大写 + letter-spacing

### 3.4 形状

| 元素 | 圆角 |
| --- | --- |
| 顶栏 / 搜索 / 工具 | `rounded-full` |
| 封面 | `rounded-2xl`（~16px） |
| Dock / 菜单 | `rounded-2xl` → `sm:rounded-full` |
| 统计图标格 | `rounded-xl` |

### 3.5 氛围背景

```text
z-0  暗角底色     --ambient-base
z-0  中段地光     --ambient-horizon（横向 ellipse）
z-0  左侧淡光     --ambient-spotlight
z-0  微噪点       feTurbulence
z-10 主内容
```

无网格、无 L4 展板。

---

## 4. 组件规格

### 4.1 TopBar

- 浮层：`glass-panel` + `rounded-full`，左右留白 `px-4/6/8`
- 左：博物馆图标 + 站名 + tagline
- 中（md+）：馆藏 / 收藏 Nav，激活态半透明胶囊 + 轻 glow
- 右：⌕ 胶囊搜索 · 语言 · 主题
- 移动端：汉堡菜单收纳 Nav / 语言 / 主题

### 4.2 ShelfHero（lg+ 左栏）

- 大标题 `heroTitle`
- 短文案 `heroBody`
- 三行统计：游戏 / 截图 / 分类
- 底：`随机封面` 胶囊按钮

### 4.3 GameBox（封面）

- 比例 `2:3`，`rounded-2xl`
- 底部 `cover-shelf-glow`（teal 灯带）
- Hover：上浮 6px + 灯带更亮 + 底部渐变叠层显示标题/shots
- 无外置标题栏（对齐参考图「纯封面货架」）

### 4.4 封面网格

| 断点 | 列数（有 Hero 时右侧） |
| --- | --- |
| 默认 | 2 |
| sm | 3 |
| md | 4 |
| lg | 3（旁有 Hero） |
| xl | 4 |
| 2xl | 5 |

间距：`gap-x-4/5` · `gap-y-8/10`（给灯带留白）。

### 4.5 ShelfDock

- `sticky bottom-4` 居中浮层
- 筛选（分类列表）· 清除 · `显示 {shown} / 共 {total} 款`

### 4.6 Level 2 / 3

截图墙与 Lightbox 逻辑不变；视觉继承圆角 / accent / glass。

---

## 5. 动效

只动 `transform` / `opacity` / `filter`。

| 场景 | 参数 |
| --- | --- |
| 封面入场 | stagger ~45ms，y 14→0，280ms |
| 封面 hover | translateY(-6px) + 灯带 opacity，200ms |
| 共享元素 | layoutId 220ms |
| reduced-motion | 关闭位移，保留 opacity |

---

## 6. i18n / 持久化

- `src/i18n/messages.ts`：Hero / Dock / Nav 文案
- `gameshot-preferences`：theme（默认 dark）、locale
- `gameshot-gallery`：favoriteIds

---

## 7. 文件对照

```text
src/components/
  AmbientBackground.tsx      # 地光背景
  layout/
    TopBar.tsx               # 浮层玻璃导航
    ShelfHero.tsx            # 左 Hero
    ShelfDock.tsx            # 底栏筛选
    AppShell.tsx
  gallery/GameBox.tsx        # 货架封面
pages/ShelfPage.tsx          # Hero + 墙 + Dock
index.css                    # token + glass-panel + shelf-glow
docs/Generated_image.png     # 视觉参考
```

---

## 8. 状态清单

- [x] 浮层玻璃顶栏
- [x] 左侧 Hero + 随机封面
- [x] 圆角封面 + 货架灯带
- [x] 底部 Dock 筛选 / 计数
- [x] 氛围地光背景
- [x] i18n / 主题
- [ ] 虚拟列表（大数据量）
- [ ] 参考图中的分页器（当前用全量网格 + 计数，未做分页）

---

## 9. 与参考图的取舍

| 参考图 | 本实现 |
| --- | --- |
| 中央多级 Nav（Platforms…） | 仅馆藏 / 收藏（真实路由） |
| 用户头像 | 语言 + 主题圆形钮 |
| 底部分页 | 计数展示；筛选进 Dock |
| 商标封面 | 用户 manifest 封面 |

> 避免通用 UI：用**货架灯带 + 浮层玻璃**当记忆锚点，而不是又一套暗色卡片仪表盘。
