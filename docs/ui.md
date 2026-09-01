# GameShot Museum — UI 设计稿（实现同步）

> **版本**：v3.0 · Arcade Archive（复古街机馆）  
> 气质：**深靛柜体 + 柔铜指示灯** · mono 字标 · 卡带封面 · CRT scanline。  
> 方向预览：[`museum-redesign-preview.html`](./museum-redesign-preview.html)（方向 C）

---

## 1. 设计结论

私人游戏截图博物馆走 **街机馆 / 玩家档案** 路线：左侧 Hero 讲故事与数据，右侧是卡带式封面墙。点封面进截图展墙，再进 Lightbox。

**记忆锚点**：柔铜 accent + 方角柜体边框 + 卡带厚边 + filmstrip marquee 面板。

**刻意不做**：玻璃胶囊顶栏、teal 柔光、3D 透视银幕墙、HUD 角标、漂浮光斑。

---

## 2. 信息架构

```text
┌─ 柜体顶栏（方角 arcade-panel） ─────────────────────────┐
│  GM  游戏截图博物馆   收藏室 · 高光展   [⌕]  EN  ☾      │
└─────────────────────────────────────────────────────────┘
┌─ FEATURED marquee ──────────────────────────────────────┐
│  ▌▌ ▌▌ ▌▌ ▌▌                                            │
└─────────────────────────────────────────────────────────┘
┌──────────────┬──────────────────────────────────────────┐
│  Hero        │  卡带展墙（平铺，无 3D）                     │
│  mono 标题   │  ▌▌ ▌▌ ▌▌ ▌▌ ▌▌                           │
│  统计        │                                          │
│  RANDOM CTA  │                                          │
└──────────────┴──────────────────────────────────────────┘
```

路由与能力落点不变（货架 / 高光 / 搜索 / Dock / 主题语言）。

---

## 3. 视觉系统

### 3.1 关键词

街机柜 · 卡带 · CRT · mono · 柔铜 · 方角  
**不是**：玻璃浮层、胶囊 pill、影院 3D、冷 teal SaaS、高饱和琥珀黄。

### 3.2 色彩（Arcade Archive）

```css
:root { /* 浅色中性纸 */
  --bg: #e6e5e1;
  --accent: #9a7a4f; /* 柔铜，少黄 */
  --cabinet-edge: #32363f;
}
.dark { /* 深靛柜体 */
  --bg: #0f1219;
  --accent: #c4a574;
  --cabinet: #171b26;
  --cabinet-edge: #2c3342;
}
```

### 3.3 字体

- 正文：`IBM Plex Sans`（中文回退系统黑体）
- 标题 / 品牌 / 标签 / 计数：`Oxanium`（游戏 HUD 几何感，无打字机）
- **不做**：Courier / 全大写密集 tracking

### 3.4 形状

| 元素 | 边框 |
| --- | --- |
| 顶栏 / Dock / filmstrip | `1px` 半透明 `--cabinet-edge` |
| 封面 / 展品 | `1px` 轻边，无厚黑描边 / 无 4px 底条 |
| 圆角 | `6px` 左右 |

### 3.5 氛围背景

```text
z-0  深靛/暖纸底   --ambient-base
z-0  底部琥珀地光  --ambient-horizon
z-0  左侧弱光      --ambient-spotlight
z-0  CRT scanline  .ambient-scanlines
z-0  微噪点
z-10 主内容
```

无 HUD 网格、无漂浮 orb。

---

## 4. 组件规格

### 4.1 TopBar

- `arcade-panel`：方角、2px 柜边、内嵌底阴影
- Mark：`GM` 琥珀实心底
- Nav：mono uppercase；激活态 = 琥珀底 + 深色字

### 4.2 ShelfHero

- 标题 mono bold
- CTA：`border-2 border-accent`，hover 填充反色

### 4.3 GameBox（卡带）

- 比例 `2:3`
- 厚边框 + 底部琥珀灯条 + 轻 scanline 叠层
- Hover：上浮 5px（无 3D translateZ）

### 4.4 FeaturedFilmstrip

- 外框 marquee 面板（cabinet border）
- 截图 2px 方角边框；plaque 用 mono + 琥珀字

### 4.5 ShelfDock

- `arcade-panel` 方角；筛选 chip 同柜体语言

---

## 5. 动效

只动 `transform` / `opacity`。

| 场景 | 参数 |
| --- | --- |
| 封面入场 | stagger ~35ms，y 18→0 |
| 封面 hover | translateY(-5px) |
| filmstrip | 横向 loop，hover pause |
| reduced-motion | 关闭位移与滚动 |

---

## 6. 文件对照

```text
src/components/
  AmbientBackground.tsx      # base + horizon + scanlines
  layout/TopBar.tsx          # arcade-panel 柜体顶栏
  layout/ShelfHero.tsx       # mono Hero
  layout/ShelfDock.tsx       # 方角 Dock
  gallery/GameBox.tsx        # 卡带封面
  gallery/FeaturedFilmstrip.tsx
index.css                    # Arcade Archive tokens + 样式
docs/museum-redesign-preview.html
```

---

## 7. 状态清单

- [x] 柜体顶栏（去 glass pill）
- [x] 琥珀 / 深靛 token 双主题
- [x] 卡带封面 + scanline
- [x] filmstrip marquee
- [x] CRT 氛围背景
- [x] Dock / Lightbox 方角化
- [ ] 虚拟列表（大数据量）
