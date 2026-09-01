# GameShot Museum — UI 设计稿（实现同步）

> **版本**：v3.1 · Arcade Archive（街机馆藏）  
> 气质：**深色馆藏为主** · 浅色为冷 slate 日间展厅 · 深靛柜体 · 街机指示铜 · 卡带脊线 + 底部灯条 · marquee 顶灯。  
> 方向预览：[`museum-redesign-preview.html`](./museum-redesign-preview.html)（方向 C）

---

## 1. 设计结论

私人游戏截图博物馆走 **街机馆 / 玩家档案** 路线。默认 **深色馆藏模式**；浅色仅为次要对照。

左侧 Hero 讲故事与数据，右侧是卡带式封面墙。点封面进截图展墙，再进 Lightbox。

**记忆锚点（去 logo 仍可辨）**：

1. 封面 **左侧脊线** + **底部灯条 / 外置柔光**
2. Filmstrip **marquee 顶灯条**
3. 底部 **地平线铜光** + 四角暗角

**刻意不做**：玻璃胶囊顶栏、冷 teal SaaS、3D 透视银幕、HUD 角标漂浮光斑、打字机字体、Oxanium 窄体、米黄浅色反色、厚黑描边。

---

## 2. 信息架构

```text
┌─ 柜体顶栏 arcade-panel ─────────────────────────────────┐
│  GM  游戏截图博物馆   收藏室 · 高光展   [⌕]  EN  ☾      │
└─────────────────────────────────────────────────────────┘
┌─ FEATURED marquee（顶灯条） ────────────────────────────┐
│  ▌▌ ▌▌ ▌▌ ▌▌                                            │
└─────────────────────────────────────────────────────────┘
┌──────────────┬──────────────────────────────────────────┐
│  Hero        │  卡带展墙（脊线 + 底灯）                     │
│  中文标题    │  ▌▌ ▌▌ ▌▌ ▌▌ ▌▌                           │
│  HUD 统计    │                                          │
│  CTA         │                                          │
└──────────────┴──────────────────────────────────────────┘
```

---

## 3. 视觉系统

### 3.1 关键词

街机柜 · 卡带脊线 · 灯条 · marquee · 深色馆藏 · Noto Sans SC  
**不是**：玻璃浮层、胶囊 pill、影院 3D、冷 teal、高饱和廉价黄、打字机、窄体游戏字、负字距。

### 3.2 色彩（深色为主 · 浅色日间展厅）

```css
.dark { /* 主推 · 夜场馆藏 */
  --bg: #0b0e14;
  --accent: #d4a24a;
  --cabinet: #141925;
}
:root { /* 浅色 · 冷 slate 日间展厅（非米黄反色） */
  --bg: #e8edf4;
  --accent: #8f6420; /* 深铜，压住黄感 */
  --cabinet: #eef2f8;
  --surface: #ffffff;
}
```

默认主题：`dark`。浅色用冷灰蓝柜体托铜指示，避免米黄 + 琥珀的「脏黄」组合。

### 3.3 字体

| 用途 | 字体 | 说明 |
| --- | --- | --- |
| 全文（中文优先） | `Noto Sans SC` + `IBM Plex Sans` | 字面宽、不挤 |
| 字距 | 标题 `0.08em` · 标签 `0.14em` | **禁止负 letter-spacing** |
| **不做** | Oxanium / Sora / 负 tracking | 中文会显窄、堆字 |

### 3.4 形状与锚点

| 元素 | 规格 |
| --- | --- |
| 顶栏 / Dock / filmstrip | `1px` 半透明边 + `6px` 圆角 |
| 卡带封面 | `1px` 外框 + **左脊 `3px` accent 混边** |
| 底部灯条 | 封面内 `::after` + 外置 `.cart-shelf-glow` |
| marquee | `.filmstrip::before` 顶灯 + glow |

### 3.5 氛围背景

```text
z-0  --ambient-base
z-0  --ambient-horizon   （地平线铜光，深色 ~22%）
z-0  --ambient-spotlight
z-0  --ambient-floor
z-0  --ambient-vignette  （四角暗角）
z-0  CRT scanlines（弱）
z-0  noise
z-10 主内容
```

---

## 4. 组件规格

### 4.1 TopBar

- `arcade-panel`
- Mark：`GM` + accent 实心底
- Nav：Plex/Noto 常规；激活态 = accent 底 + 深色字；`tracking 0.08em`

### 4.2 ShelfHero

- 标题：Noto/Plex Semibold + `letter-spacing: 0.08em`
- Badge / 统计：同族字体，标签 `0.14em`
- CTA：`1px` accent 边，hover 实心反色

### 4.3 GameBox（卡带）

- 比例 `2:3`
- 左脊线 + 底灯条 + `.cart-shelf-glow`
- 轻 scanline 叠层（低不透明度）
- Hover：上浮 6px，灯条更亮

### 4.4 FeaturedFilmstrip

- marquee 外框 + **顶灯条**
- 标签 / plaque：同族宽体 + 正字距 + accent

### 4.5 ShelfDock

- `arcade-panel`；计数用 `.type-label`

---

## 5. 动效

| 场景 | 参数 |
| --- | --- |
| 封面入场 | stagger ~35ms，y 18→0 |
| 封面 hover | translateY(-6px) + 灯条 opacity |
| filmstrip | 横向 loop，hover pause |
| reduced-motion | 关闭位移与滚动 |

---

## 6. 文件对照

```text
AmbientBackground.tsx   # base + horizon + vignette + scanlines
layout/TopBar.tsx
layout/ShelfHero.tsx
layout/ShelfDock.tsx
gallery/GameBox.tsx     # cinema-screen + cart-shelf-glow
gallery/FeaturedFilmstrip.tsx
index.css               # Arcade Archive tokens + 锚点样式
docs/ui.md              # 本文件
```

---

## 7. 状态清单

- [x] 深色馆藏默认
- [x] 街机指示铜 accent + 地光 / 暗角
- [x] 卡带脊线 + 底部灯条记忆锚点
- [x] filmstrip marquee 顶灯
- [x] Noto Sans SC + 正字距（解决中文堆窄）
- [x] 浅色日间展厅（冷 slate，非米黄反色）
- [x] 文档与实现同步（v3.1）
- [ ] 虚拟列表（大数据量）
